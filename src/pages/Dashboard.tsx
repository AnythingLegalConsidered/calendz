import { useState, useEffect, useCallback, useMemo } from "react";
import { startOfWeek, addWeeks, addDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  LogOut,
  AlertTriangle,
  Loader2,
  CalendarPlus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  findConflicts,
  type CalendarEvent,
  type EventInput,
} from "../lib/events";
import { SOURCES, SOURCE_KEYS, type EventSource } from "../lib/sources";
import WeekView from "../components/calendar/WeekView";
import EventModal, { type ModalTarget } from "../components/calendar/EventModal";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<Set<EventSource>>(new Set(SOURCE_KEYS));
  const [modal, setModal] = useState<ModalTarget | null>(null);
  const [seeding, setSeeding] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const from = weekStart.toISOString();
      const to = addDays(weekStart, 7).toISOString();
      setEvents(await fetchEvents(from, to));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger les événements.");
    } finally {
      setLoading(false);
    }
  }, [weekStart]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const conflicts = useMemo(() => findConflicts(events), [events]);
  const visibleEvents = useMemo(
    () => events.filter((e) => active.has(e.source)),
    [events, active],
  );

  function toggleSource(key: EventSource) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function handleSave(input: EventInput, id?: string) {
    if (id) await updateEvent(id, input);
    else await createEvent(input);
    await loadEvents();
  }

  async function handleDelete(id: string) {
    await deleteEvent(id);
    await loadEvents();
  }

  async function seedDemoWeek() {
    setSeeding(true);
    setError(null);
    const at = (offset: number, h: number, m: number) => {
      const d = addDays(weekStart, offset);
      d.setHours(h, m, 0, 0);
      return d.toISOString();
    };
    // Une semaine type, avec un conflit volontaire mer. 11:00 (TD vs Médecin).
    const demo: EventInput[] = [
      { title: "Cours de stats", source: "ecole", starts_at: at(0, 9, 0), ends_at: at(0, 11, 0) },
      { title: "Daily équipe", source: "boulot", starts_at: at(0, 11, 30), ends_at: at(0, 12, 30) },
      { title: "Review sprint", source: "boulot", starts_at: at(1, 14, 0), ends_at: at(1, 15, 30) },
      { title: "TD SQL", source: "ecole", starts_at: at(2, 10, 0), ends_at: at(2, 12, 0) },
      { title: "Médecin", source: "perso", starts_at: at(2, 11, 0), ends_at: at(2, 12, 0) },
      { title: "Point client", source: "boulot", starts_at: at(4, 9, 0), ends_at: at(4, 10, 0) },
      { title: "Sport", source: "perso", starts_at: at(3, 18, 0), ends_at: at(3, 19, 30) },
    ];
    try {
      for (const e of demo) await createEvent(e);
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du remplissage.");
    } finally {
      setSeeding(false);
    }
  }

  const weekLabel = `${format(weekStart, "d MMM", { locale: fr })} – ${format(
    addDays(weekStart, 6),
    "d MMM yyyy",
    { locale: fr },
  )}`;

  return (
    <div className="min-h-screen bg-cloud">
      {/* Barre d'application */}
      <header className="sticky top-0 z-40 border-b border-cloud bg-white">
        <div className="mx-auto flex max-w-content items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="h-7 w-7" width={28} height={28} />
            <span className="text-lg font-extrabold tracking-tight text-deep">Calendz</span>
            <span className="hidden text-sm font-medium text-slate sm:inline">/ Mon agenda</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[180px] truncate text-sm text-slate md:inline">
              {user?.email}
            </span>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-xl border border-cloud px-3 py-2 text-sm font-semibold text-deep transition hover:bg-cloud"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-content px-5 py-6">
        {/* Barre d'outils */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setWeekStart((w) => addWeeks(w, -1))}
              className="rounded-xl border border-cloud bg-white p-2 text-deep transition hover:bg-cloud"
              aria-label="Semaine précédente"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
              className="rounded-xl border border-cloud bg-white px-3 py-2 text-sm font-semibold text-deep transition hover:bg-cloud"
            >
              Aujourd'hui
            </button>
            <button
              type="button"
              onClick={() => setWeekStart((w) => addWeeks(w, 1))}
              className="rounded-xl border border-cloud bg-white p-2 text-deep transition hover:bg-cloud"
              aria-label="Semaine suivante"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="ml-2 text-base font-bold text-deep">{weekLabel}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filtres par source */}
            {SOURCE_KEYS.map((key) => {
              const on = active.has(key);
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => toggleSource(key)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                    on ? SOURCES[key].swatch : "border-cloud bg-white text-slate"
                  }`}
                  aria-pressed={on}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${SOURCES[key].dot}`} />
                  {SOURCES[key].label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() =>
                setModal({
                  defaults: {
                    date: format(new Date(), "yyyy-MM-dd"),
                    start: "09:00",
                    end: "10:00",
                  },
                })
              }
              className="btn-primary px-4 py-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              Nouvel événement
            </button>
          </div>
        </div>

        {/* Bannière conflits */}
        {conflicts.size > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {conflicts.size} créneaux en conflit cette semaine.
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-coral/40 bg-coral/10 px-4 py-2.5 text-sm font-semibold text-deep">
            {error}
          </div>
        )}

        {/* Calendrier */}
        <div className="mt-4">
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-cloud bg-white">
              <Loader2 className="h-6 w-6 animate-spin text-deep" aria-label="Chargement" />
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-cloud bg-white py-16 text-center">
              <p className="text-base font-semibold text-deep">Aucun événement cette semaine.</p>
              <p className="mt-1 text-sm text-slate">
                Clique sur un créneau pour ajouter, ou charge une semaine d'exemple.
              </p>
              <button
                type="button"
                onClick={seedDemoWeek}
                disabled={seeding}
                className="btn-primary mt-5 px-4 py-2.5 text-sm"
              >
                {seeding ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <CalendarPlus className="h-4 w-4" />
                )}
                Charger une semaine d'exemple
              </button>
            </div>
          ) : (
            <WeekView
              weekStart={weekStart}
              events={visibleEvents}
              conflicts={conflicts}
              onSelectSlot={(day, hour) =>
                setModal({
                  defaults: {
                    date: format(day, "yyyy-MM-dd"),
                    start: `${pad(hour)}:00`,
                    end: `${pad(hour + 1)}:00`,
                  },
                })
              }
              onSelectEvent={(event) => setModal({ event })}
            />
          )}
        </div>
      </main>

      {modal && (
        <EventModal
          target={modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
