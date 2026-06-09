import { addDays, format, isSameDay, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertTriangle } from "lucide-react";
import { SOURCES } from "../../lib/sources";
import type { CalendarEvent } from "../../lib/events";

const DAY_START = 8; // première heure affichée
const DAY_END = 21; // dernière heure affichée
const HOUR_H = 56; // hauteur d'une heure en px
const HOURS = Array.from({ length: DAY_END - DAY_START }, (_, i) => DAY_START + i);
const TOTAL_H = (DAY_END - DAY_START) * HOUR_H;

interface Props {
  weekStart: Date;
  events: CalendarEvent[];
  conflicts: Set<string>;
  onSelectSlot: (day: Date, hour: number) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

interface Positioned {
  event: CalendarEvent;
  top: number;
  height: number;
  left: number;
  width: number;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function decimalHour(iso: string) {
  const d = new Date(iso);
  return d.getHours() + d.getMinutes() / 60;
}

function geom(e: CalendarEvent) {
  const top = (clamp(decimalHour(e.starts_at), DAY_START, DAY_END) - DAY_START) * HOUR_H;
  const bottom = (clamp(decimalHour(e.ends_at), DAY_START, DAY_END) - DAY_START) * HOUR_H;
  return { top, height: Math.max(bottom - top, 24) };
}

/** Place les événements d'une journée en colonnes pour gérer les chevauchements. */
function layoutDay(dayEvents: CalendarEvent[]): Positioned[] {
  const sorted = [...dayEvents].sort(
    (a, b) =>
      new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime() ||
      new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime(),
  );
  const out: Positioned[] = [];
  let cluster: CalendarEvent[] = [];
  let clusterEnd = 0;

  const flush = () => {
    if (!cluster.length) return;
    const cols: CalendarEvent[][] = [];
    const colOf = new Map<string, number>();
    for (const e of cluster) {
      let placed = false;
      for (let ci = 0; ci < cols.length; ci++) {
        const last = cols[ci][cols[ci].length - 1];
        if (new Date(e.starts_at).getTime() >= new Date(last.ends_at).getTime()) {
          cols[ci].push(e);
          colOf.set(e.id, ci);
          placed = true;
          break;
        }
      }
      if (!placed) {
        cols.push([e]);
        colOf.set(e.id, cols.length - 1);
      }
    }
    const n = cols.length;
    for (const e of cluster) {
      const ci = colOf.get(e.id) ?? 0;
      const { top, height } = geom(e);
      out.push({ event: e, top, height, left: (ci / n) * 100, width: (1 / n) * 100 });
    }
    cluster = [];
    clusterEnd = 0;
  };

  for (const e of sorted) {
    const s = new Date(e.starts_at).getTime();
    if (cluster.length && s >= clusterEnd) flush();
    cluster.push(e);
    clusterEnd = Math.max(clusterEnd, new Date(e.ends_at).getTime());
  }
  flush();
  return out;
}

export default function WeekView({
  weekStart,
  events,
  conflicts,
  onSelectSlot,
  onSelectEvent,
}: Props) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const gridCols = "64px repeat(7, minmax(0, 1fr))";

  return (
    <div className="overflow-x-auto rounded-xl border border-cloud bg-white shadow-card">
      <div className="min-w-[820px]">
        {/* En-têtes des jours */}
        <div className="grid border-b border-cloud" style={{ gridTemplateColumns: gridCols }}>
          <div className="border-r border-cloud" />
          {days.map((day) => {
            const today = isToday(day);
            return (
              <div
                key={day.toISOString()}
                className={`border-r border-cloud py-2 text-center ${today ? "bg-sky/10" : ""}`}
              >
                <div className="text-xs font-medium uppercase tracking-wide text-slate">
                  {format(day, "EEE", { locale: fr })}
                </div>
                <div
                  className={`text-lg font-bold ${today ? "text-sky" : "text-deep"}`}
                >
                  {format(day, "d", { locale: fr })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Corps : gouttière horaire + colonnes jours */}
        <div className="grid" style={{ gridTemplateColumns: gridCols }}>
          {/* Gouttière des heures */}
          <div className="relative border-r border-cloud" style={{ height: TOTAL_H }}>
            {HOURS.map((h) => (
              <div
                key={h}
                className="absolute -translate-y-1/2 pr-2 text-right text-xs text-slate"
                style={{ top: (h - DAY_START) * HOUR_H, right: 0, width: 56 }}
              >
                {h}:00
              </div>
            ))}
          </div>

          {/* Colonnes jours */}
          {days.map((day) => {
            const dayEvents = events.filter((e) => isSameDay(new Date(e.starts_at), day));
            const positioned = layoutDay(dayEvents);
            return (
              <div
                key={day.toISOString()}
                className={`relative border-r border-cloud ${isToday(day) ? "bg-sky/5" : ""}`}
                style={{ height: TOTAL_H }}
              >
                {/* Cases horaires cliquables (fond) */}
                {HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => onSelectSlot(day, h)}
                    aria-label={`Ajouter un événement le ${format(day, "EEEE d MMMM", { locale: fr })} à ${h}h`}
                    className="absolute left-0 right-0 border-b border-cloud/70 transition hover:bg-cloud/60"
                    style={{ top: (h - DAY_START) * HOUR_H, height: HOUR_H }}
                  />
                ))}

                {/* Blocs d'événements */}
                {positioned.map(({ event, top, height, left, width }) => {
                  const inConflict = conflicts.has(event.id);
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => onSelectEvent(event)}
                      className={`absolute overflow-hidden rounded-lg px-2 py-1 text-left text-xs leading-tight shadow-sm transition hover:brightness-105 ${SOURCES[event.source].block} ${
                        inConflict ? "ring-2 ring-red-500" : ""
                      }`}
                      style={{
                        top: top + 1,
                        height: height - 2,
                        left: `calc(${left}% + 2px)`,
                        width: `calc(${width}% - 4px)`,
                      }}
                    >
                      <span className="flex items-center gap-1 font-semibold">
                        {inConflict && (
                          <AlertTriangle className="h-3 w-3 shrink-0 text-red-600" aria-label="Conflit" />
                        )}
                        <span className="truncate">{event.title}</span>
                      </span>
                      <span className="block opacity-80">
                        {format(new Date(event.starts_at), "HH:mm")}–
                        {format(new Date(event.ends_at), "HH:mm")}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
