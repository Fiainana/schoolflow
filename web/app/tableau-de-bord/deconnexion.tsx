'use client';

export default function Deconnexion() {
  async function sortir() {
    // Révoque la session côté serveur (jeton de rafraîchissement) et efface les cookies.
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    window.location.href = '/login';
  }
  return (
    <button className="secondaire" onClick={sortir}>
      Se déconnecter
    </button>
  );
}
