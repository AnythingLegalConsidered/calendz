/**
 * Illustration abstraite du hero : trois calendriers color-codés
 * (école / boulot / perso) qui se rejoignent en une seule vue.
 * 100% SVG, aucune photo. Reprend les couleurs du logo Calendz.
 */

type CardProps = {
  x: number;
  y: number;
  rotate: number;
  bar: string;
  accent: string;
  opacity?: number;
};

function CalendarCard({ x, y, rotate, bar, accent, opacity = 1 }: CardProps) {
  const cols = 5;
  const rows = 4;
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <rect
          key={`${r}-${c}`}
          x={18 + c * 22}
          y={56 + r * 20}
          width={12}
          height={12}
          rx={3}
          fill="#E8EDF3"
        />,
      );
    }
  }

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity={opacity}>
      {/* corps de la carte */}
      <rect width={140} height={150} rx={16} fill="#FFFFFF" stroke="#E8EDF3" />
      {/* barre d'en-tête colorée */}
      <rect width={140} height={34} rx={16} fill={bar} />
      <rect y={18} width={140} height={16} fill={bar} />
      {/* pastilles d'en-tête */}
      <circle cx={22} cy={17} r={5} fill="#FFFFFF" opacity={0.85} />
      <circle cx={40} cy={17} r={5} fill="#FFFFFF" opacity={0.55} />
      {/* grille de jours */}
      {dots}
      {/* événement accentué */}
      <rect x={40} y={76} width={56} height={12} rx={3} fill={accent} />
      <rect x={18} y={116} width={34} height={12} rx={3} fill={accent} opacity={0.7} />
    </g>
  );
}

export default function CalendarMerge() {
  return (
    <svg
      viewBox="0 0 440 360"
      role="img"
      aria-label="Trois agendas color-codés qui se réunissent en une seule vue"
      className="h-auto w-full max-w-[520px]"
    >
      {/* halo doux */}
      <ellipse cx={220} cy={200} rx={200} ry={150} fill="#76CCD6" opacity={0.10} />

      {/* trois calendriers en éventail qui convergent */}
      <CalendarCard x={40} y={70} rotate={-9} bar="#1E3A5F" accent="#76CCD6" opacity={0.92} />
      <CalendarCard x={150} y={50} rotate={0} bar="#76CCD6" accent="#FF9F7A" />
      <CalendarCard x={262} y={70} rotate={9} bar="#FF9F7A" accent="#1E3A5F" opacity={0.92} />

      {/* flèches de fusion */}
      <path
        d="M210 250 q10 18 0 36"
        fill="none"
        stroke="#1E3A5F"
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.5}
      />
    </svg>
  );
}
