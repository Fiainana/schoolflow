'use client';

import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
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
    } catch {
      setErreur('Serveur injoignable. Réessayez dans un instant.');
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <main className="centre">
      <form className="carte" onSubmit={soumettre}>
        <h1 className="marque">School<span>Flow</span></h1>
        <p className="sous-titre">Connectez-vous pour continuer.</p>

        <label htmlFor="login">Identifiant</label>
        <input id="login" autoComplete="username" required value={login} onChange={(e) => setLogin(e.target.value)} />

        <label htmlFor="password">Mot de passe</label>
        <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />

        {erreur && <p className="erreur" role="alert">{erreur}</p>}

        <button className="pleine" type="submit" disabled={envoi}>
          {envoi ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </main>
  );
}
