// La caché ISR de Next (FileSystemCache) guardaba en disco TAMBIÉN las 404:
// cada URL inexistente distinta (/x.php, /es/camiseta/lo-que-sea) dejaba
// ~141 KB (.html + .rsc + .meta + segments/) en .next/server, y cualquier
// escáner podía llenar el disco (informe fiabilidad-seguridad 2026-10-08,
// hallazgo 8). Esto es la caché de siempre, salvo que una respuesta 404 no
// se guarda (ni en disco ni en memoria): se vuelve a renderizar si la piden
// otra vez, y sigue saliendo con status 404 real.
//
// Seguro porque los datos solo cambian con un build nuevo (deploy_local.sh
// compila en un .next limpio): una ficha que existía no puede pasar a 404
// dentro del mismo build y quedarse servida vieja.
//
// Comprobación: node scripts/check_cache_handler.mjs
import fsc from "next/dist/server/lib/incremental-cache/file-system-cache.js";

const FileSystemCache = fsc.default ?? fsc; // es CJS compilado

export default class NoCache404 extends FileSystemCache {
  async set(key, data, ctx) {
    if (data?.status === 404) return;
    return super.set(key, data, ctx);
  }
}
