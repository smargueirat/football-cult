// Bandera en sessionStorage: "el usuario pasó por una página de catálogo
// en esta pestaña". La escriben todas las páginas de listado (home,
// /clubes, /retro, /botas, /guantes, /pelotas, /ropa, /tickets, etc.) al
// montar. BackToCatalogLink la lee para decidir si un router.back() real
// es seguro (vuelve DENTRO del sitio) o si hay que usar el link de
// respaldo -- llegó por URL externa, pestaña nueva o link compartido, sin
// catálogo previo en el historial de ESTA pestaña, así que no hay "atrás"
// real al que volver.
const KEY = "fc-visited-catalog";

export function markCatalogVisited() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // Safari privado/cookies bloqueadas: sin sessionStorage, back a
    // secas es indistinguible de "no hay historial" -- el link de
    // respaldo sigue funcionando igual, solo se pierde la mejora.
  }
}

export function hasCatalogHistory(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
