'use client';

import { FormEvent, useEffect, useState } from 'react';

const Logo = ({ couleur = false }: { couleur?: boolean }) => (
  <svg width="38" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    {couleur ? (
      <>
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="40" y2="40">
            <stop stopColor="#5b5bf0" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11" fill="url(#lg)" />
      </>
    ) : (
      <rect width="40" height="40" rx="11" fill="#fff" fillOpacity="0.14" stroke="#fff" strokeOpacity="0.3" />
    )}
    <path d="M20 9 7 15.5 20 22l13-6.5L20 9Z" fill="#fff" />
    <path d="M12.5 19.5V25c0 1.9 3.4 4 7.5 4s7.5-2.1 7.5-4v-5.5L20 23.3l-7.5-3.8Z" fill="#fff" fillOpacity="0.8" />
    <path d="M33 16.5V25" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

const IcUtilisateur = () => (
  <svg className="pre" width="19" height="19" viewBox="0 0 24 24" {...base}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></svg>
);
const IcCadenas = () => (
  <svg className="pre" width="19" height="19" viewBox="0 0 24 24" {...base}><rect x="4" y="11" width="16" height="10" rx="2.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);
const IcOeil = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...base}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
);
const IcOeilBarre = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...base}><path d="M3 3l18 18" /><path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.2 3.8M6.5 7.6A16.6 16.6 0 0 0 2 12s3.6 7 10 7a9.6 9.6 0 0 0 4.3-1" /><path d="M9.9 10a3 3 0 0 0 4.1 4.1" /></svg>
);
const IcAlerte = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base}><circle cx="12" cy="12" r="9.5" /><path d="M12 7.5v5M12 16.2v.1" /></svg>
);
const IcFleche = () => (
  <svg className="fleche" width="18" height="18" viewBox="0 0 24 24" {...base} strokeWidth={2.2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const IcCoche = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base} strokeWidth={2.4}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
const IcPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base} strokeWidth={2.4}><path d="M12 5v14M5 12h14" /></svg>
);
const IcBouclier = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base}><path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6l-7-3Z" /><path d="m9 12 2.2 2.2L15 10.5" /></svg>
);

const hauteurs = [38, 56, 44, 70, 52, 84, 62];

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  // Bouton inactif tant que la page n'est pas hydratée : sinon un envoi précoce
  // serait une soumission native du formulaire, avec les identifiants dans l'URL.
  const [pret, setPret] = useState(false);
  useEffect(() => setPret(true), []);

  async function soumettre(e: FormEvent) {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });
      if (res.ok) {
        window.location.href = '/tableau-de-bord';
        return;
      }
      const corps = await res.json().catch(() => null);
      setErreur(res.status === 401 ? 'Identifiant ou mot de passe incorrect.' : (corps?.message ?? 'Connexion impossible.'));
      setEnvoi(false);
    } catch {
      setErreur('Serveur injoignable. Réessayez dans un instant.');
      setEnvoi(false);
    }
  }

  return (
    <div className="auth">
      <aside className="auth-brand">
        <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
        <div className="grille" aria-hidden="true" />

        <div className="brand-logo">
          <Logo />
          <span className="brand-name">SchoolFlow</span>
        </div>

        <div className="brand-body">
          <span className="pastille"><b /> Gestion d’école primaire</span>
          <h2>
            Pilotez votre école <span className="degrade">avec clarté.</span>
          </h2>
          <p>Élèves, classes, enseignants et scolarité réunis dans une seule plateforme, simple à prendre en main.</p>

          <div className="apercu" aria-hidden="true">
            <div className="verre apercu-carte">
              <div className="apercu-tete">
                <span>Aperçu de l’année</span>
                <span className="pts"><i /><i /><i /></span>
              </div>
              <div className="stats">
                <div className="stat"><small>Élèves</small><strong>—</strong></div>
                <div className="stat"><small>Classes</small><strong>—</strong></div>
                <div className="stat"><small>Présence</small><strong>—</strong></div>
              </div>
              <div className="barres">
                {hauteurs.map((h, i) => (
                  <span key={i} style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }} />
                ))}
              </div>
            </div>

            <div className="verre flottant a">
              <span className="pt"><IcCoche /></span>
              <div>Appel du matin<small>Présences suivies en direct</small></div>
            </div>
            <div className="verre flottant b">
              <span className="pt"><IcPlus /></span>
              <div>Nouvelles inscriptions<small>Dossiers en quelques clics</small></div>
            </div>
          </div>
        </div>

        <div className="brand-foot">© {new Date().getFullYear()} SchoolFlow · Manoha Énergie</div>
      </aside>

      <main className="auth-main">
        <form className="auth-card" method="post" onSubmit={soumettre} noValidate>
          <div className="auth-mobile-logo">
            <Logo couleur />
            <span>SchoolFlow</span>
          </div>

          <h1>Bon retour</h1>
          <p className="lead">Connectez-vous pour accéder à votre espace de gestion.</p>

          {erreur && (
            <div className="alerte" role="alert">
              <IcAlerte />
              <span>{erreur}</span>
            </div>
          )}

          <div className="champ">
            <IcUtilisateur />
            <input
              id="login"
              name="login"
              autoComplete="username"
              autoFocus
              required
              placeholder=" "
              value={login}
              aria-invalid={!!erreur}
              onChange={(e) => setLogin(e.target.value)}
            />
            <label htmlFor="login">Identifiant</label>
          </div>

          <div className="champ">
            <IcCadenas />
            <input
              id="password"
              name="password"
              type={visible ? 'text' : 'password'}
              autoComplete="current-password"
              required
              placeholder=" "
              value={password}
              aria-invalid={!!erreur}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Mot de passe</label>
            <button
              type="button"
              className="oeil"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              aria-pressed={visible}
            >
              {visible ? <IcOeilBarre /> : <IcOeil />}
            </button>
          </div>

          <button className="btn-principal" type="submit" disabled={!pret || envoi || !login || !password}>
            {envoi ? <span className="spinner" aria-hidden="true" /> : null}
            {envoi ? 'Connexion en cours…' : 'Se connecter'}
            {!envoi && <IcFleche />}
          </button>

          <p className="securite"><IcBouclier /> Connexion sécurisée</p>
          <p className="aide">Mot de passe oublié ? Contactez l’administrateur de l’école.</p>
        </form>
      </main>
    </div>
  );
}
