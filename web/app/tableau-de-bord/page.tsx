import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Deconnexion from './deconnexion';

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

export default async function TableauDeBord() {
  const profil = await profilCourant();
  if (!profil) redirect('/login');

  return (
    <>
      <header className="entete">
        <strong>School<span style={{ color: 'var(--primary)' }}>Flow</span></strong>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="muted">{profil.nom} · {profil.roles.join(', ')}</span>
          <Deconnexion />
        </div>
      </header>
      <main className="contenu">
        <h1>Bonjour {profil.nom}</h1>
        <p className="muted">Connexion réussie. Les modules (élèves, classes, enseignants, scolarité) viendront ensuite.</p>
      </main>
    </>
  );
}
