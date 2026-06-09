import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Le client n'est créé que si les deux clés sont présentes.
// Permet de builder/déployer même avant d'avoir branché Supabase :
// le formulaire affiche alors un message propre au lieu de planter.
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = supabase !== null;

export type WaitlistStatus =
  | "Alternant"
  | "Étudiant"
  | "Jeune diplômé / actif"
  | "Autre";

export interface WaitlistEntry {
  email: string;
  status: WaitlistStatus;
  pain_point?: string | null;
}

export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: "duplicate" | "config" | "error"; message: string };

export async function joinWaitlist(entry: WaitlistEntry): Promise<SubmitResult> {
  if (!supabase) {
    return {
      ok: false,
      reason: "config",
      message:
        "La waitlist n'est pas encore connectée. Réessaie dans un instant.",
    };
  }

  const { error } = await supabase.from("waitlist").insert({
    email: entry.email.trim().toLowerCase(),
    status: entry.status,
    pain_point: entry.pain_point?.trim() || null,
  });

  if (error) {
    // 23505 = violation de contrainte unique (email déjà inscrit)
    if (error.code === "23505") {
      return {
        ok: false,
        reason: "duplicate",
        message: "Tu es déjà sur la liste, merci !",
      };
    }
    return {
      ok: false,
      reason: "error",
      message: "Une erreur est survenue. Réessaie dans un instant.",
    };
  }

  return { ok: true };
}
