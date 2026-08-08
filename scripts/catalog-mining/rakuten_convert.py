"""Converts a Rakuten Advertising "Complete product file" (pipe-delimited,
no header row, 38 fields -- see FTP download in README) into a synthetic
CSV with the same column names pick.py/extract.py already expect for
Awin-format feeds, so the REST of the mining pipeline (pick.py ->
split_picks.py -> gen_new_teams.py -> refresh.py) runs completely
unchanged. Field positions reverse-engineered from real downloaded data
(Rakuten's own field-definition doc is behind a login wall) and cross-
checked across dozens of rows -- see README for the confirmed mapping.

Also does one Rakuten-specific, scoped fix: these stores' real product
titles use Portuguese roman numerals for kit type ("Camisa Santos I
22/23" = home, "II" = away, "III" = third) instead of any word our
shared TYPE_PATTERNS recognizes. Rewriting "I"/"II"/"III" globally in
TYPE_PATTERNS would be too risky (a bare "I" collides with all sorts of
unrelated things in other languages/stores) -- scoped to just this
converter, applied only to titles that already matched a real team name,
it's safe.

Usage:
    python3 rakuten_convert.py <input.txt.gz> <out.csv>
"""
import csv, gzip, re, sys, os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract import team_re_all

ROMAN_TYPE = {"I": "Home", "II": "Away", "III": "Third"}
ROMAN_RE = re.compile(r"\b(III|II|I)\b")


def rewrite_roman_type(title, teams_re):
    if not any(pat.search(title) for pat in teams_re.values()):
        return title
    m = ROMAN_RE.search(title)
    if not m:
        return title
    return title[: m.start()] + ROMAN_TYPE[m.group(1)] + title[m.end() :]


def convert(in_path, out_path, team_hint=None):
    """team_hint: for a known single-club store whose titles sometimes
    drop the full club name (e.g. Loja PST/Sport Recife titled just
    "Camisa Sport I 25/26..."), prepend the real name to any title that
    doesn't already match a team, BEFORE roman-numeral rewriting runs --
    doing this after conversion (post-hoc string patch on the CSV) skips
    rewrite_roman_type() entirely, since at generation time no team
    matched yet and it silently no-ops. Real bug hit building this."""
    teams_re = team_re_all()
    rows_out = []
    with gzip.open(in_path, "rt", encoding="utf-8", errors="replace") as f:
        for line in f:
            fields = line.rstrip("\n").split("|")
            if len(fields) < 28 or fields[0] == "HDR" or fields[0].startswith("TRL"):
                continue
            name = fields[1]
            sale_price = fields[12]
            in_stock = fields[22]
            if not name or not sale_price:
                continue
            if team_hint and not any(pat.search(name) for pat in teams_re.values()):
                name = f"{team_hint} " + name
            name = rewrite_roman_type(name, teams_re)
            rows_out.append(
                {
                    "product_name": name,
                    "search_price": sale_price,
                    "aw_deep_link": fields[5],
                    "aw_image_url": fields[6],
                    "brand_name": fields[16],
                    "in_stock": "1" if in_stock == "in-stock" else "0",
                    # No decodable size field in this feed -- the SKU's
                    # trailing numeric suffix (e.g. "-158", "-02") looked
                    # promising but doesn't cleanly map to S/M/L/XL across
                    # samples checked (2-9 variants per product, no
                    # consistent scale). Placeholder "M" so pick_best()
                    # doesn't skip every real product for having no
                    # recognized size at all -- same conservative fallback
                    # ebay_mine.py uses when it can't read real sizes.
                    "custom_1": "M",
                }
            )

    with open(out_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "product_name",
                "search_price",
                "aw_deep_link",
                "aw_image_url",
                "brand_name",
                "in_stock",
                "custom_1",
            ],
        )
        writer.writeheader()
        writer.writerows(rows_out)
    print(f"{len(rows_out)} rows -> {out_path}")


if __name__ == "__main__":
    hint = sys.argv[3] if len(sys.argv) > 3 else None
    convert(sys.argv[1], sys.argv[2], team_hint=hint)
