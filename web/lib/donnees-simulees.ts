/**
 * DONNÉES SIMULÉES — uniquement pour maquetter le tableau de bord.
 * À remplacer par des appels à l'API quand les modules (élèves, classes, scolarité) existeront.
 */

export const anneeScolaire = '2026 – 2027';

export const kpis = [
  { cle: 'eleves', libelle: 'Élèves inscrits', valeur: '342', variation: '+12', note: 'ce mois-ci', tendance: 'hausse' as const, serie: [296, 301, 310, 318, 322, 330, 342] },
  { cle: 'enseignants', libelle: 'Enseignants', valeur: '24', variation: '+1', note: 'depuis septembre', tendance: 'hausse' as const, serie: [22, 22, 23, 23, 23, 24, 24] },
  { cle: 'classes', libelle: 'Classes', valeur: '12', variation: '28,5', note: 'élèves par classe', tendance: 'neutre' as const, serie: [12, 12, 12, 12, 12, 12, 12] },
  { cle: 'presence', libelle: 'Présence du jour', valeur: '96,2 %', variation: '−0,8 pt', note: 'vs hier', tendance: 'baisse' as const, serie: [95, 96, 94, 97, 96, 97, 96] },
];

export const presenceHebdo = [
  { semaine: 'S36', valeur: 94.1 },
  { semaine: 'S37', valeur: 95.3 },
  { semaine: 'S38', valeur: 93.2 },
  { semaine: 'S39', valeur: 95.8 },
  { semaine: 'S40', valeur: 92.4 },
  { semaine: 'S41', valeur: 95.1 },
  { semaine: 'S42', valeur: 96.7 },
  { semaine: 'S43', valeur: 96.2 },
];

export const niveaux = [
  { niveau: 'CP', eleves: 78, classes: 3 },
  { niveau: 'CE1', eleves: 72, classes: 3 },
  { niveau: 'CE2', eleves: 68, classes: 2 },
  { niveau: 'CM1', eleves: 64, classes: 2 },
  { niveau: 'CM2', eleves: 60, classes: 2 },
];

export const scolarite = { encaisse: 57_800_000, attendu: 85_000_000, retards: 18 };

export const activites = [
  { type: 'inscription', texte: 'Nouvelle inscription — Rakoto Fenitra, CE1', quand: 'Il y a 12 min' },
  { type: 'paiement', texte: 'Paiement reçu — Famille Randria, 150 000 Ar', quand: 'Il y a 1 h' },
  { type: 'absence', texte: 'Absence signalée — CM2 B, 3 élèves', quand: 'Ce matin' },
  { type: 'note', texte: 'Notes de dictée saisies — CE2 A', quand: 'Hier' },
  { type: 'inscription', texte: 'Dossier complété — Andrianina Mialy, CP', quand: 'Hier' },
];

export const agenda = [
  { jour: '14', mois: 'NOV', titre: 'Réunion parents-enseignants', detail: '15 h 00 · Salle polyvalente' },
  { jour: '20', mois: 'NOV', titre: 'Début des compositions', detail: 'Tous niveaux · 1er trimestre' },
  { jour: '28', mois: 'NOV', titre: 'Remise des bulletins', detail: '10 h 00 · Par classe' },
  { jour: '05', mois: 'DÉC', titre: 'Fête de l’école', detail: 'Cour principale' },
];

export const ariary = (n: number) => new Intl.NumberFormat('fr-FR').format(n).replace(/ | /g, ' ') + ' Ar';
