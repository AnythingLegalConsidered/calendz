import { useEffect, useRef, useState, type FormEvent } from "react";
import { format } from "date-fns";
import { X, Trash2, Loader2 } from "lucide-react";
import { SOURCES, SOURCE_KEYS, type EventSource } from "../../lib/sources";
import type { CalendarEvent, EventInput } from "../../lib/events";

export interface ModalTarget {
  event?: CalendarEvent; // édition d'un événement existant
  defaults?: { date: string; start: string; end: string }; // création depuis un créneau
}

interface Props {
  target: ModalTarget;
  onClose: () => void;
  onSave: (input: EventInput, id?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function toISO(date: string, time: string): string {
  // date "2026-06-09" + time "09:00" interprétés en heure locale
  return new Date(`${date}T${time}`).toISOString();
}

export default function EventModal({ target, onClose, onSave, onDelete }: Props) {
  const editing = target.event;

  const [title, setTitle] = useState(editing?.title ?? "");
  const [source, setSource] = useState<EventSource>(editing?.source ?? "ecole");
  const [date, setDate] = useState(
    editing ? format(new Date(editing.starts_at), "yyyy-MM-dd") : target.defaults!.date,
  );
  const [start, setStart] = useState(
    editing ? format(new Date(editing.starts_at), "HH:mm") : target.defaults!.start,
  );
  const [end, setEnd] = useState(
    editing ? format(new Date(editing.ends_at), "HH:mm") : target.defaults!.end,
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Accessibilité modale : fermeture par Escape, focus trap et scroll lock du body.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;
      const focusables = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Donne un titre à l'événement.");
      return;
    }
    if (toISO(date, end) <= toISO(date, start)) {
      setError("L'heure de fin doit être après l'heure de début.");
      return;
    }
    setBusy(true);
    try {
      await onSave(
        {
          title: title.trim(),
          source,
          starts_at: toISO(date, start),
          ends_at: toISO(date, end),
        },
        editing?.id,
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement.");
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!editing) return;
    setBusy(true);
    try {
      await onDelete(editing.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression.");
      setBusy(false);
    }
  }

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-deep/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={editing ? "Modifier l'événement" : "Nouvel événement"}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-deep">
            {editing ? "Modifier l'événement" : "Nouvel événement"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate hover:bg-cloud"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="ev-title" className="block text-sm font-bold text-deep">
              Titre
            </label>
            <input
              id="ev-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              placeholder="Cours de stats, Daily équipe…"
              className="mt-1.5 w-full rounded-xl border border-cloud bg-cloud px-4 py-2.5 text-anthracite placeholder:text-slate/70 focus:border-sky focus:bg-white"
            />
          </div>

          <div>
            <span className="block text-sm font-bold text-deep">Source</span>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {SOURCE_KEYS.map((key) => {
                const active = source === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setSource(key)}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      active ? SOURCES[key].swatch : "border-cloud text-slate hover:border-sky"
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${SOURCES[key].dot}`} />
                    {SOURCES[key].label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="ev-date" className="block text-sm font-bold text-deep">
              Date
            </label>
            <input
              id="ev-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-cloud bg-cloud px-4 py-2.5 text-anthracite focus:border-sky focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="ev-start" className="block text-sm font-bold text-deep">
                Début
              </label>
              <input
                id="ev-start"
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-cloud bg-cloud px-4 py-2.5 text-anthracite focus:border-sky focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor="ev-end" className="block text-sm font-bold text-deep">
                Fin
              </label>
              <input
                id="ev-end"
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-cloud bg-cloud px-4 py-2.5 text-anthracite focus:border-sky focus:bg-white"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm font-semibold text-coral">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button type="submit" disabled={busy} className="btn-primary flex-1">
              {busy && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
              Enregistrer
            </button>
            {editing && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-coral px-4 py-3.5 text-sm font-bold text-coral transition hover:bg-coral/10 disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
