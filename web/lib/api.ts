/**
 * Client HTTP du navigateur. Les jetons sont dans des cookies httpOnly : le JavaScript ne les
 * voit jamais. Sur un 401, on tente UN rafraîchissement silencieux puis on rejoue la requête ;
 * si le rafraîchissement échoue, on renvoie vers la connexion.
 */

let rafraichissement: Promise<boolean> | null = null;

/** Un seul rafraîchissement à la fois : le jeton est à usage unique (rotation côté API). */
export function rafraichirSession(): Promise<boolean> {
  rafraichissement ??= fetch('/api/auth/refresh', { method: 'POST' })
    .then((r) => r.ok)
    .catch(() => false)
    .finally(() => {
      rafraichissement = null;
    });
  return rafraichissement;
}

export async function apiFetch(chemin: string, init: RequestInit = {}): Promise<Response> {
  let res = await fetch(chemin, init);
  if (res.status === 401 && !chemin.startsWith('/api/auth/')) {
    if (await rafraichirSession()) {
      res = await fetch(chemin, init);
    } else if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
  return res;
}
