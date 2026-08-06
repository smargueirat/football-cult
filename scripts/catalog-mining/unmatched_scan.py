"""Finds jersey-titled rows in a feed that don't match any known team in
TEAM_PATTERNS — candidates for teams/clubs we don't track yet. Clusters
by a normalized title key so repeated products (different sizes) collapse
into one line, sorted by frequency (most-common unmatched title first).

Usage:
    python3 unmatched_scan.py <csv> <google|awin> <out.json> [min_count]

Output: {normalized_title: {"count": N, "sample_title": "...", "sample_row": {...}}}
Only rows that pass JERSEY_RE and fail EXCLUDE_RE are considered (so kids/
rugby/retro/other-sport junk is already filtered out — same discipline as
the mainline pipeline), and team-pattern matching uses the same
TEAM_PATTERNS as extract.py.
"""
import csv, json, re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract import JERSEY_RE, EXCLUDE_RE, team_re_all

def normalize(title):
    # Colapsa variantes de talle/temporada menores para agrupar el mismo
    # producto repetido fila por fila.
    t = re.sub(r"\s*-\s*(XXS|XS|S|M|L|XL|2XL|XXL|3XL|4XL)\s*$", "", title, flags=re.I)
    t = re.sub(r"\s+", " ", t).strip().lower()
    return t

def scan(csv_path, fmt, min_count=1):
    title_col = "title" if fmt == "google" else "product_name"
    teams = team_re_all()

    clusters = {}
    seen_rows = 0
    jersey_rows = 0
    with open(csv_path, encoding="utf-8-sig", errors="replace") as f:
        reader = csv.DictReader(f)
        for r in reader:
            seen_rows += 1
            title = r.get(title_col) or ""
            if not title:
                continue
            if not JERSEY_RE.search(title):
                continue
            if EXCLUDE_RE.search(title):
                continue
            jersey_rows += 1
            matched = any(pat.search(title) for pat in teams.values())
            if matched:
                continue
            key = normalize(title)
            if key not in clusters:
                clusters[key] = {"count": 0, "sample_title": title, "sample_row": r}
            clusters[key]["count"] += 1

    result = {k: v for k, v in clusters.items() if v["count"] >= min_count}
    print(f"{csv_path}: {seen_rows} rows, {jersey_rows} jersey rows, "
          f"{len(clusters)} unmatched clusters ({len(result)} with count>={min_count})")
    return result

if __name__ == "__main__":
    csv_path, fmt, out_json = sys.argv[1], sys.argv[2], sys.argv[3]
    min_count = int(sys.argv[4]) if len(sys.argv) > 4 else 1
    result = scan(csv_path, fmt, min_count)
    json.dump(result, open(out_json, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
