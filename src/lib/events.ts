import { supabase } from "./supabase";
import type { EventSource } from "./sources";

export interface CalendarEvent {
  id: string;
  title: string;
  source: EventSource;
  starts_at: string; // ISO
  ends_at: string; // ISO
}

export interface EventInput {
  title: string;
  source: EventSource;
  starts_at: string;
  ends_at: string;
}

function assertClient() {
  if (!supabase) {
    throw new Error(
      "Supabase n'est pas configuré (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).",
    );
  }
  return supabase;
}

export async function fetchEvents(
  fromISO: string,
  toISO: string,
): Promise<CalendarEvent[]> {
  const client = assertClient();
  const { data, error } = await client
    .from("events")
    .select("id,title,source,starts_at,ends_at")
    .gte("starts_at", fromISO)
    .lt("starts_at", toISO)
    .order("starts_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as CalendarEvent[];
}

export async function createEvent(input: EventInput): Promise<CalendarEvent> {
  const client = assertClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) throw new Error("Non authentifié.");

  const { data, error } = await client
    .from("events")
    .insert({ ...input, user_id: user.id })
    .select("id,title,source,starts_at,ends_at")
    .single();
  if (error) throw error;
  return data as CalendarEvent;
}

export async function updateEvent(
  id: string,
  input: EventInput,
): Promise<CalendarEvent> {
  const client = assertClient();
  const { data, error } = await client
    .from("events")
    .update(input)
    .eq("id", id)
    .select("id,title,source,starts_at,ends_at")
    .single();
  if (error) throw error;
  return data as CalendarEvent;
}

export async function deleteEvent(id: string): Promise<void> {
  const client = assertClient();
  const { error } = await client.from("events").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Retourne l'ensemble des ids d'événements qui en chevauchent un autre
 * dans le temps (toutes sources confondues) = conflits d'agenda.
 */
export function findConflicts(events: CalendarEvent[]): Set<string> {
  const conflicts = new Set<string>();
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i];
      const b = events[j];
      const aStart = new Date(a.starts_at).getTime();
      const aEnd = new Date(a.ends_at).getTime();
      const bStart = new Date(b.starts_at).getTime();
      const bEnd = new Date(b.ends_at).getTime();
      if (aStart < bEnd && bStart < aEnd) {
        conflicts.add(a.id);
        conflicts.add(b.id);
      }
    }
  }
  return conflicts;
}
