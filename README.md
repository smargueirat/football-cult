# Football Cult

Comparador de precios de camisetas de fútbol. MVP con datos de ejemplo en
`src/data/products.ts` — se reemplaza por feeds reales una vez aprobadas las
afiliaciones (Awin, CJ Affiliate, Rakuten Advertising, etc).

## Correr en local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Estructura

- `src/app/page.tsx` — home con buscador
- `src/components/SearchExplorer.tsx` — lógica de búsqueda y orden por precio (client component)
- `src/components/ProductCard.tsx` — tarjeta de producto con ofertas por tienda
- `src/data/products.ts` — catálogo de ejemplo (reemplazar por feeds reales)
- `src/app/sobre-nosotros`, `/contacto`, `/privacidad`, `/terminos` — páginas
  requeridas por las redes de afiliados para aprobar la cuenta

## Antes de publicar

1. Completar email real en `src/app/contacto/page.tsx`
2. Revisar `privacidad` y `terminos` con asesoría legal
3. Comprar un dominio y actualizar `metadata` en `src/app/layout.tsx`

## Deploy gratis en Vercel

1. Subir este proyecto a un repo de GitHub (`git init`, `git add .`, `git commit`, push)
2. Entrar a [vercel.com](https://vercel.com/new), conectar la cuenta de GitHub
3. Importar el repo — Vercel detecta Next.js automáticamente, no requiere configuración
4. Deploy. Vercel te da una URL gratis (`football-cult.vercel.app`) al instante
5. (Opcional) conectar un dominio propio en Project Settings → Domains

## Después: sumar datos reales

Reemplazar `src/data/products.ts` por un proceso que:
1. Descarga los feeds de producto de cada red de afiliados aprobada
2. Normaliza nombres de producto (equipo, tipo, temporada) entre tiendas
3. Guarda todo en una base de datos (ej. Postgres)
4. La página consulta esa base en vez del archivo estático
