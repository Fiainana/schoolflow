import type { ReactNode } from 'react';

/* ---------- Icônes ---------- */

const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

export const Icones = {
  accueil: <svg {...base}><path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5Z" /></svg>,
  eleves: <svg {...base}><path d="M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM21 20v-2a4 4 0 0 0-3-3.9M16 2.1a4 4 0 0 1 0 7.8" /></svg>,
  classes: <svg {...base}><path d="M3 5h18v11H3zM8 21h8M12 16v5" /></svg>,
  enseignants: <svg {...base}><path d="M22 10 12 5 2 10l10 5 10-5ZM6 12.2V17c0 1.2 2.7 3 6 3s6-1.8 6-3v-4.8" /></svg>,
  scolarite: <svg {...base}><path d="M3 7h18v12H3zM3 11h18M7 15h3" /></svg>,
  presences: <svg {...base}><rect x="4" y="4" width="16" height="17" rx="2.5" /><path d="M8 2.5v3M16 2.5v3M4 9.5h16M9 15l2 2 4-4" /></svg>,
  parametres: <svg {...base}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></svg>,
  recherche: <svg {...base} width={18} height={18}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>,
  cloche: <svg {...base}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8ZM10 20a2 2 0 0 0 4 0" /></svg>,
  haut: <svg {...base} width={14} height={14} strokeWidth={2.4}><path d="m6 14 6-6 6 6" /></svg>,
  bas: <svg {...base} width={14} height={14} strokeWidth={2.4}><path d="m6 10 6 6 6-6" /></svg>,
  plus: <svg {...base} width={16} height={16} strokeWidth={2.2}><path d="M12 5v14M5 12h14" /></svg>,
  argent: <svg {...base} width={16} height={16}><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9.5 9.5c0-1 1-1.7 2.5-1.7s2.5.7 2.5 1.7-1 1.5-2.5 1.8-2.5.8-2.5 1.8 1 1.7 2.5 1.7 2.5-.7 2.5-1.7" /></svg>,
  absence: <svg {...base} width={16} height={16}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5M17 17l5 5M22 17l-5 5" /></svg>,
  note: <svg {...base} width={16} height={16}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5ZM14 3v5h5M9 13h6M9 17h6" /></svg>,
};

/* ---------- Graphiques SVG (sans dépendance) ---------- */

/** Courbe lissée passant par les points (Bézier cubique, tangentes horizontales). */
function courbe(pts: [number, number][]) {
  return pts.reduce((d, [x, y], i) => {
    if (i === 0) return `M${x},${y}`;
    const [px, py] = pts[i - 1];
    const cx = (px + x) / 2;
    return `${d} C${cx},${py} ${cx},${y} ${x},${y}`;
  }, '');
}

export function Sparkline({ serie, couleur = 'var(--primary)' }: { serie: number[]; couleur?: string }) {
  const w = 96, h = 36, p = 3;
  const min = Math.min(...serie), max = Math.max(...serie);
  const plage = max - min || 1;
  const pts = serie.map((v, i): [number, number] => [p + (i * (w - 2 * p)) / (serie.length - 1), h - p - ((v - min) / plage) * (h - 2 * p)]);
  const d = courbe(pts);
  const id = `sp${couleur.replace(/\W/g, '')}${serie.join('')}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="spark">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={couleur} stopOpacity="0.28" />
          <stop offset="1" stopColor={couleur} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${w - p},${h} L${p},${h} Z`} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={couleur} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CourbeAire({ donnees }: { donnees: { semaine: string; valeur: number }[] }) {
  const W = 640, H = 240, g = 44, d = 16, b = 32, h = 12;
  const min = 90, max = 100;
  const x = (i: number) => g + (i * (W - g - d)) / (donnees.length - 1);
  const y = (v: number) => h + (1 - (v - min) / (max - min)) * (H - h - b);
  const pts = donnees.map((e, i): [number, number] => [x(i), y(e.valeur)]);
  const ligne = courbe(pts);
  const dernier = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Taux de présence par semaine" className="courbe">
      <defs>
        <linearGradient id="aire" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--primary)" stopOpacity="0.32" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="trait" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--primary-2)" />
        </linearGradient>
      </defs>
      {[90, 92.5, 95, 97.5, 100].map((v) => (
        <g key={v}>
          <line x1={g} x2={W - d} y1={y(v)} y2={y(v)} stroke="var(--border)" strokeDasharray="3 5" />
          <text x={g - 10} y={y(v) + 4} textAnchor="end" className="axe">{v} %</text>
        </g>
      ))}
      <path d={`${ligne} L${dernier[0]},${H - b} L${pts[0][0]},${H - b} Z`} fill="url(#aire)" />
      <path d={ligne} fill="none" stroke="url(#trait)" strokeWidth="3" strokeLinecap="round" />
      {donnees.map((e, i) => (
        <text key={e.semaine} x={x(i)} y={H - 10} textAnchor="middle" className="axe">{e.semaine}</text>
      ))}
      {pts.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={i === pts.length - 1 ? 5.5 : 3.5} fill="var(--surface)" stroke="var(--primary)" strokeWidth="2.5" />
      ))}
      <g transform={`translate(${Math.min(dernier[0], W - 34)}, ${dernier[1] - 16})`}>
        <rect x="-27" y="-20" width="54" height="22" rx="7" fill="var(--text)" />
        <text y="-5" textAnchor="middle" className="bulle">{donnees[donnees.length - 1].valeur.toString().replace('.', ',')} %</text>
      </g>
    </svg>
  );
}

export function Anneau({ pourcentage, children }: { pourcentage: number; children?: ReactNode }) {
  const r = 52, c = 2 * Math.PI * r;
  return (
    <div className="anneau">
      <svg viewBox="0 0 140 140" role="img" aria-label={`${pourcentage} % encaissé`}>
        <defs>
          <linearGradient id="anneau" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--primary)" />
            <stop offset="1" stopColor="var(--primary-2)" />
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--primary-soft)" strokeWidth="14" />
        <circle
          cx="70" cy="70" r={r} fill="none" stroke="url(#anneau)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${(pourcentage / 100) * c} ${c}`} transform="rotate(-90 70 70)"
        />
      </svg>
      <div className="anneau-centre">{children}</div>
    </div>
  );
}
