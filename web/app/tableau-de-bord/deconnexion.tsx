'use client';

export default function Deconnexion() {
  async function sortir() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }
  return (
    <button className="secondaire" onClick={sortir}>
      Se déconnecter
    </button>
  );
}
