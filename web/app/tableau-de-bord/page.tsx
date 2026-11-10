import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Deconnexion from './deconnexion';
import { Anneau, CourbeAire, Icones, Sparkline } from './composants';
import { activites, agenda, anneeScolaire, ariary, kpis, niveaux, presenceHebdo, scolarite } from '@/lib/donnees-simulees';
import './dashboard.css';

export const dynamic = 'force-dynamic';

type Profil = { id: number; login: string; nom: string; roles: string[] };

async function profilCourant(): Promise<Profil | null> {
  const token = (await cookies()).get('schoolflow_token')?.value;
  if (!token) return null;
  const api = process.env.API_INTERNAL_URL ?? 'http://localhost:3000';
  try {
    const res = await fetch(`${api}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()).data as Profil;
  } catch {
    return null;
  }
}

const menu = [
  { libelle: 'Tableau de bord', icone: Icones.accueil, actif: true },
  { libelle: 'Élèves', icone: Icones.eleves },
  { libelle: 'Classes', icone: Icones.classes },
  { libelle: 'Enseignants', icone: Icones.enseignants },
  { libelle: 'Présences', icone: Icones.presences },
  { libelle: 'Scolarité', icone: Icones.scolarite },
  { libelle: 'Paramètres', icone: Icones.parametres },
];

const iconeActivite = { inscription: Icones.plus, paiement: Icones.argent, absence: Icones.absence, note: Icones.note } as const;

export default async function TableauDeBord() {
  const profil = await profilCourant();
  // Jeton d'accès absent ou expiré : la page-relais tente un rafraîchissement silencieux
  // (le cookie de rafraîchissement n'est lisible que par /api/auth), sinon renvoie vers la connexion.
  if (!profil) redirect('/session/rafraichir?retour=/tableau-de-bord');

  const aujourdhui = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Indian/Antananarivo' }).format(new Date());
  const dateAffichee = aujourdhui.charAt(0).toUpperCase() + aujourdhui.slice(1);
  const initiales = profil.nom.split(/\s+/).map((m) => m[0]).slice(0, 2).join('').toUpperCase();
  const pct = Math.round((scolarite.encaisse / scolarite.attendu) * 100);
  const maxEleves = Math.max(...niveaux.map((n) => n.eleves));

  return (
    <div className="dash">
      <aside className="lateral">
        <div className="lateral-logo">
          <span className="logo-carre">
            <svg width="22" height="22" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <path d="M20 9 7 15.5 20 22l13-6.5L20 9Z" fill="#fff" />
              <path d="M12.5 19.5V25c0 1.9 3.4 4 7.5 4s7.5-2.1 7.5-4v-5.5L20 23.3l-7.5-3.8Z" fill="#fff" fillOpacity="0.8" />
            </svg>
          </span>
          <strong>SchoolFlow</strong>
        </div>

        <nav className="menu" aria-label="Navigation principale">
          {menu.map((m) => (
            <span key={m.libelle} className={`menu-item${m.actif ? ' actif' : ''}`} aria-current={m.actif ? 'page' : undefined}>
              {m.icone}
              <span>{m.libelle}</span>
              {!m.actif && <em>Bientôt</em>}
            </span>
          ))}
        </nav>

        <div className="lateral-bas">
          <div className="utilisateur">
            <span className="avatar">{initiales}</span>
            <div>
              <strong>{profil.nom}</strong>
              <small>{profil.roles.join(', ')}</small>
            </div>
          </div>
          <Deconnexion />
        </div>
      </aside>

      <div className="principal">
        <header className="haut">
          <div>
            <h1>Tableau de bord</h1>
            <p className="date">{dateAffichee}</p>
          </div>
          <div className="haut-actions">
            <span className="badge-simule" title="Les chiffres affichés sont fictifs">Données simulées</span>
            <div className="recherche">{Icones.recherche}<span>Rechercher…</span></div>
            <span className="icone-bouton" aria-hidden="true">{Icones.cloche}<i /></span>
          </div>
        </header>

        <section className="bienvenue">
          <div>
            <span className="annee">Année scolaire {anneeScolaire}</span>
            <h2>Bonjour {profil.nom} 👋</h2>
            <p>Voici un aperçu de la vie de l’école : effectifs, présences et scolarité en un coup d’œil.</p>
          </div>
          <div className="bienvenue-chiffres">
            <div><strong>96,2 %</strong><span>présents aujourd’hui</span></div>
            <div><strong>14 nov.</strong><span>réunion des parents</span></div>
          </div>
        </section>

        <section className="kpis" aria-label="Indicateurs clés">
          {kpis.map((k) => (
            <article key={k.cle} className="carte kpi">
              <div className="kpi-tete">
                <span className="kpi-icone">{Icones[k.cle === 'eleves' ? 'eleves' : k.cle === 'enseignants' ? 'enseignants' : k.cle === 'classes' ? 'classes' : 'presences']}</span>
                <Sparkline serie={k.serie} couleur={k.tendance === 'baisse' ? '#f59e0b' : 'var(--primary)'} />
              </div>
              <p className="kpi-libelle">{k.libelle}</p>
              <p className="kpi-valeur">{k.valeur}</p>
              <p className="kpi-note">
                <span className={`variation ${k.tendance}`}>
                  {k.tendance === 'hausse' && Icones.haut}
                  {k.tendance === 'baisse' && Icones.bas}
                  {k.variation}
                </span>
                {k.note}
              </p>
            </article>
          ))}
        </section>

        <section className="grille-2">
          <article className="carte">
            <div className="carte-tete">
              <div>
                <h3>Présence hebdomadaire</h3>
                <p>Taux moyen de présence sur les 8 dernières semaines</p>
              </div>
              <span className="legende"><i /> Présence</span>
            </div>
            <CourbeAire donnees={presenceHebdo} />
          </article>

          <article className="carte">
            <div className="carte-tete">
              <div>
                <h3>Effectifs par niveau</h3>
                <p>342 élèves · 12 classes</p>
              </div>
            </div>
            <ul className="niveaux">
              {niveaux.map((n) => (
                <li key={n.niveau}>
                  <div className="niveau-ligne">
                    <strong>{n.niveau}</strong>
                    <span>{n.eleves} élèves · {n.classes} cl.</span>
                  </div>
                  <div className="piste"><span style={{ width: `${(n.eleves / maxEleves) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="grille-3">
          <article className="carte">
            <div className="carte-tete">
              <div>
                <h3>Scolarité</h3>
                <p>Frais encaissés sur l’année</p>
              </div>
            </div>
            <div className="scolarite">
              <Anneau pourcentage={pct}>
                <strong>{pct} %</strong>
                <small>encaissé</small>
              </Anneau>
              <dl>
                <div><dt>Encaissé</dt><dd>{ariary(scolarite.encaisse)}</dd></div>
                <div><dt>Attendu</dt><dd>{ariary(scolarite.attendu)}</dd></div>
                <div><dt>Familles en retard</dt><dd className="alerte-texte">{scolarite.retards}</dd></div>
              </dl>
            </div>
          </article>

          <article className="carte">
            <div className="carte-tete">
              <div>
                <h3>Activité récente</h3>
                <p>Dernières actions dans l’école</p>
              </div>
            </div>
            <ul className="activites">
              {activites.map((a, i) => (
                <li key={i}>
                  <span className={`puce ${a.type}`}>{iconeActivite[a.type as keyof typeof iconeActivite]}</span>
                  <div>
                    <p>{a.texte}</p>
                    <small>{a.quand}</small>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="carte">
            <div className="carte-tete">
              <div>
                <h3>À venir</h3>
                <p>Agenda du trimestre</p>
              </div>
            </div>
            <ul className="agenda">
              {agenda.map((e) => (
                <li key={e.titre}>
                  <span className="date-bloc"><strong>{e.jour}</strong><small>{e.mois}</small></span>
                  <div>
                    <p>{e.titre}</p>
                    <small>{e.detail}</small>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </div>
  );
}
