"""Backfills a `brand` field onto every existing product in products.ts by
matching each offer's URL against a fresh link->brand map built from the
store's own feed (brand_name / brand / vendor column, depending on
format) — this data was always in the feeds, we just never captured it.

Usage per store:
    python3 brand_backfill.py <csv_path> <format: google|awin|msc> <store_name> <out_map.json>

Then merge_brand_maps.py combines every store's <out_map.json> and applies
majority-vote brand assignment across all products.ts blocks.
"""
import csv, json, re, sys, os

BRAND_PATTERNS = [
    ("adidas", r"adidas"),
    ("nike", r"\bnike\b|\bjordan\b"),
    ("puma", r"\bpuma\b"),
    ("jako", r"\bjako\b"),
    ("joma", r"\bjoma\b"),
    ("errea", r"\berrea\b"),
    ("kappa", r"\bkappa\b"),
    ("hummel", r"\bhummel\b"),
    ("macron", r"\bmacron\b"),
    ("umbro", r"\bumbro\b"),
    ("newbalance", r"new\s*balance"),
    ("underarmour", r"under\s*armour"),
    ("kelme", r"\bkelme\b"),
    ("legea", r"\blegea\b"),
    ("uhlsport", r"uhlsport"),
    ("lotto", r"\blotto\b"),
    ("mizuno", r"\bmizuno\b"),
    ("score draw", r"score\s*draw|\btoffs\b|copa football"),
]
BRAND_RE = [(k, re.compile(p, re.I)) for k, p in BRAND_PATTERNS]


def normalize_brand(raw):
    if not raw:
        return None
    for key, pat in BRAND_RE:
        if pat.search(raw):
            return "scoredraw" if key == "score draw" else key
    return "other"


def build_map(csv_path, fmt, store_name):
    if fmt == "google":
        link_col, brand_col = "aw_deep_link", "brand"
    elif fmt == "awin":
        link_col, brand_col = "aw_deep_link", "brand_name"
    else:
        raise ValueError(fmt)

    link_to_brand = {}
    with open(csv_path, encoding="utf-8-sig", errors="replace") as f:
        reader = csv.DictReader(f)
        for r in reader:
            link = r.get(link_col)
            if not link:
                continue
            brand = normalize_brand(r.get(brand_col))
            if brand:
                link_to_brand[link] = brand
    print(f"{store_name}: {len(link_to_brand)} link->brand entries")
    return link_to_brand


if __name__ == "__main__":
    csv_path, fmt, store_name, out_path = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
    m = build_map(csv_path, fmt, store_name)
    json.dump(m, open(out_path, "w", encoding="utf-8"), ensure_ascii=False)
