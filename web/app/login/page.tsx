'use client';

import { FormEvent, useState } from 'react';

const Logo = ({ taille = 40 }: { taille?: number }) => (
  <svg width={taille} height={taille} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect width="40" height="40" rx="11" fill="#fff" fillOpacity="0.16" stroke="#fff" strokeOpacity="0.3" />
    <path d="M20 9 7 15.5 20 22l13-6.5L20 9Z" fill="#fff" />
    <path d="M12.5 19.5V25c0 1.9 3.4 4 7.5 4s7.5-2.1 7.5-4v-5.5L20 23.3l-7.5-3.8Z" fill="#fff" fillOpacity="0.8" />
    <path d="M33 16.5V25" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const LogoCouleur = () => (
  <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect width="40" height="40" rx="11" fill="var(--primary)" />
    <path d="M20 9 7 15.5 20 22l13-6.5L20 9Z" fill="#fff" />
    <path d="M12.5 19.5V25c0 1.9 3.4 4 7.5 4s7.5-2.1 7.5-4v-5.5L20 23.3l-7.5-3.8Z" fill="#fff" fillOpacity="0.8" />
    <path d="M33 16.5V25" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const icone = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

const IcUtilisateur = (p: { className?: string }) => (
  <svg {...icone} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></svg>
);
const IcCadenas = (p: { className?: string }) => (
  <svg {...icone} {...p}><rect x="4" y="11" width="16" height="10" rx="2.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);
const IcOeil = () => (
  <svg {...icone}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
);
const IcOeilBarre = () => (
  <svg {...icone}><path d="M3 3l18 18" /><path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.2 3.8M6.5 7.6A16.6 16.6 0 0 0 2 12s3.6 7 10 7a9.6 9.6 0 0 0 4.3-1" /><path d="M9.9 10a3 3 0 0 0 4.1 4.1" /></svg>
);
const IcAlerte = () => (
  <svg {...icone} width={17} height={17}><circle cx="12" cy="12" r="9.5" /><path d="M12 7.5v5M12 16.2v.1" /></svg>
);

const atouts = [
  { titre: 'Élèves et classes', texte: 'Inscriptions, effectifs et dossiers réunis au même endroit.', d: <path d="M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM21 20v-2a4 4 0 0 0-3-3.9M16 2.1a4 4 0 0 1 0 7.8" /> },
  { titre: 'Suivi pédagogique', texte: 'Notes, bulletins et présences suivis tout au long de l’année.', d: <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14ZM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" /> },
  { titre: 'Scolarité et paiements', texte: 'Frais de scolarité, échéances et reçus sans paperasse.', d: <path d="M3 7h18v12H3zM3 11h18M7 15h3" /> },
];

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

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
        <div className="brand-logo">
          <Logo />
          <span className="brand-name">SchoolFlow</span>
        </div>

        <div className="brand-body">
          <h2>La gestion de votre école, simplifiée.</h2>
          <p>Une plateforme claire pour piloter l’école primaire au quotidien : direction, enseignants et secrétariat.</p>
          <ul className="features">
            {atouts.map((a) => (
              <li key={a.titre}>
                <span className="ico">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{a.d}</svg>
                </span>
                <div>
                  <strong>{a.titre}</strong>
                  <span className="d">{a.texte}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="brand-foot">© {new Date().getFullYear()} SchoolFlow · Manoha Énergie</div>
      </aside>

      <main className="auth-main">
        <form className="auth-card" onSubmit={soumettre} noValidate>
          <div className="auth-mobile-logo">
            <LogoCouleur />
            <span>SchoolFlow</span>
          </div>

          <h1>Bon retour 👋</h1>
          <p className="lead">Connectez-vous à votre espace pour continuer.</p>

          {erreur && (
            <div className="alerte" role="alert">
              <IcAlerte />
              <span>{erreur}</span>
            </div>
          )}

          <div className="champ">
            <label htmlFor="login">Identifiant</label>
            <div className="saisie">
              <IcUtilisateur className="pre" />
              <input
                id="login"
                name="login"
                autoComplete="username"
                autoFocus
                required
                placeholder="Votre identifiant"
                value={login}
                aria-invalid={!!erreur}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
          </div>

          <div className="champ">
            <label htmlFor="password">Mot de passe</label>
            <div className="saisie">
              <IcCadenas className="pre" />
              <input
                id="password"
                name="password"
                type={visible ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="Votre mot de passe"
                value={password}
                aria-invalid={!!erreur}
                onChange={(e) => setPassword(e.target.value)}
              />
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
          </div>

          <button className="btn-principal" type="submit" disabled={envoi || !login || !password}>
            {envoi && <span className="spinner" aria-hidden="true" />}
            {envoi ? 'Connexion en cours…' : 'Se connecter'}
          </button>

          <p className="auth-note">Mot de passe oublié ? Contactez l’administrateur de l’école.</p>
        </form>
      </main>
    </div>
  );
}
