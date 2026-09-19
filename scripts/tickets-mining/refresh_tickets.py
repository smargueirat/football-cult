#!/usr/bin/env python3
"""Refresca src/data/tickets.ts contra mine_tickets.py -- mismo patrón
que refresh_boots.py/refresh_gear.py (ids deterministas, reconstruye
entera la sección auto-generada cada corrida).

Uso: python3 scripts/tickets-mining/refresh_tickets.py
"""
import json, re, os, subprocess, sys, unicodedata

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
TICKETS_PATH = os.path.join(REPO_ROOT, "src", "data", "tickets.ts")
MINED_PATH = os.path.join(SCRIPT_DIR, "mined_tickets.json")
SENTINEL = "// ===AUTO-GENERATED-TICKETS-BELOW==="
CHUNK_SIZE = 180


def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s


def ts_string(s):
    return json.dumps(s, ensure_ascii=False)


def ts_entry(e, indent=2):
    pad = " " * indent
    lines = [pad + "{"]
    lines.append(f"{pad}  id: {ts_string(e['id'])},")
    lines.append(f"{pad}  event: {ts_string(e['event'])},")
    lines.append(f"{pad}  venue: {ts_string(e['venue'])},")
    if e.get("city"):
        lines.append(f"{pad}  city: {ts_string(e['city'])},")
    lines.append(f"{pad}  date: {ts_string(e['date'])},")
    lines.append(f"{pad}  time: {ts_string(e['time'])},")
    lines.append(f"{pad}  competition: {ts_string(e['competition'])},")
    lines.append(f"{pad}  imageUrl: {ts_string(e['imageUrl'])},")
    lines.append(f"{pad}  offers: [")
    for o in e["offers"]:
        lines.append(
            f"{pad}    {{ store: {ts_string(o['store'])}, price: {o['price']}, "
            f"currency: {ts_string(o['currency'])}, url: {ts_string(o['url'])} }},"
        )
    lines.append(f"{pad}  ],")
    lines.append(pad + "},")
    return "\n".join(lines)


def run_mine():
    print("--- running mine_tickets.py ---")
    subprocess.run([sys.executable, os.path.join(SCRIPT_DIR, "mine_tickets.py")], check=True, cwd=SCRIPT_DIR)


def split_ts():
    src = open(TICKETS_PATH, encoding="utf-8").read()
    idx = src.find(SENTINEL)
    if idx == -1:
        raise SystemExit(f"No se encontró el marcador {SENTINEL!r} en {TICKETS_PATH} -- revisar a mano.")
    marker_end = src.find("\n\n", idx)
    prefix = src[: marker_end + 2] if marker_end != -1 else src[:idx] + SENTINEL + "\n\n"
    return prefix


def load_venue_cities():
    # estadio -> ciudad real de Wikidata (resolve_venue_cities.py); los que
    # no se resolvieron quedan sin ciudad, nunca inventada.
    path = os.path.join(SCRIPT_DIR, "venue_cities.json")
    if not os.path.exists(path):
        return {}
    cities = {k: v["city"] for k, v in json.load(open(path, encoding="utf-8")).items() if v}
    # overrides manuales (venue_city_overrides.json): estadios con nombre de
    # sponsor que Wikidata no resuelve; solo ciudades verificadas a mano.
    ov = os.path.join(SCRIPT_DIR, "venue_city_overrides.json")
    if os.path.exists(ov):
        cities.update(json.load(open(ov, encoding="utf-8")))
    return cities


def build_entries(mined):
    cities = load_venue_cities()
    entries = []
    seen_ids = set()
    for d in mined:
        base = slugify(f"{d['event']}-{d['date']}")
        sid = base
        i = 2
        while sid in seen_ids:
            sid = f"{base}-{i}"
            i += 1
        seen_ids.add(sid)
        entries.append({
            "id": sid,
            "event": d["event"],
            "venue": d["venue"],
            "city": cities.get(d["venue"]),
            "date": d["date"],
            "time": d["time"],
            "competition": d["competition"],
            "imageUrl": d["imageUrl"],
            "offers": d["offers"],
        })
    return entries


def write_ts(prefix, entries):
    chunks = [entries[i:i + CHUNK_SIZE] for i in range(0, len(entries), CHUNK_SIZE)]
    out = [prefix]
    chunk_names = []
    for idx, chunk in enumerate(chunks, start=1):
        name = f"minedTicketProductsChunk{idx}"
        chunk_names.append(name)
        out.append(f"const {name}: TicketProduct[] = [\n")
        for e in chunk:
            out.append(ts_entry(e) + "\n")
        out.append("];\n\n")

    out.append("export const ticketProducts: TicketProduct[] = [\n")
    for name in chunk_names:
        out.append(f"  ...{name},\n")
    out.append("];\n")

    with open(TICKETS_PATH, "w", encoding="utf-8") as f:
        f.write("".join(out))


def main():
    run_mine()
    mined = json.load(open(MINED_PATH, encoding="utf-8"))

    prefix = split_ts()
    full_old_src = open(TICKETS_PATH, encoding="utf-8").read()
    old_ids = set(re.findall(r'id: "([^"]+)"', full_old_src[full_old_src.find(SENTINEL):]))

    entries = build_entries(mined)
    write_ts(prefix, entries)

    new_ids = {e["id"] for e in entries}
    print("\n=== refresh_tickets.py ===")
    print(f"total distinct events today: {len(entries)}")
    print(f"new events (not seen before): {len(new_ids - old_ids)}")
    print(f"events missing from today's feed (dropped -- likely already played/sold out): {len(old_ids - new_ids)}")


if __name__ == "__main__":
    main()
