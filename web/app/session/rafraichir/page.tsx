'use client';

import { useEffect } from 'react';
import { rafraichirSession } from '@/lib/api';

/** Page-relais : renouvelle la session puis revient à la page demandée (ou à la connexion). */
export default function Rafraichir() {
  useEffect(() => {
    const brut = new URLSearchParams(window.location.search).get('retour') ?? '/tableau-de-bord';
    // Uniquement un chemin interne : jamais de redirection vers un autre site.
    const retour = brut.startsWith('/') && !brut.startsWith('//') && !brut.includes('\\') ? brut : '/tableau-de-bord';

    rafraichirSession().then((ok) => {
      window.location.replace(ok ? retour : '/login');
    });
  }, []);

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>
      <p>Vérification de votre session…</p>
    </main>
  );
}
