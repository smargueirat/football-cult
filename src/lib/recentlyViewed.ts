const STORAGE_KEY = "football-cult-recently-viewed";
const MAX_ITEMS = 8;

export function getRecentlyViewed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(id: string) {
  if (typeof window === "undefined") return;
  const current = getRecentlyViewed().filter((existing) => existing !== id);
  const next = [id, ...current].slice(0, MAX_ITEMS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
