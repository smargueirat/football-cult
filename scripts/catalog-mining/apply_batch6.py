"""One-off: wires new_teams_batch6.py into products.ts (TeamKey union,
teamCategory, teamNames, teamFlags, teamColors) and extract.py's
TEAM_PATTERNS -- the manual steps from the README's "Adding a team"
section, done in bulk for this batch instead of by hand per team.
"""
import re

PRODUCTS_TS = "/home/piojo/football-cult/src/data/products.ts"
EXTRACT_PY = "/home/piojo/football-cult/scripts/catalog-mining/extract.py"

NATIONAL_KEYS = {
    "paraguay", "bolivia", "canada", "honduras", "elsalvador", "guatemala",
    "trinidadytobago", "romania", "chequia", "eslovaquia", "eslovenia",
    "finlandia", "bosnia", "albania", "georgia", "macedoniadelnorte",
    "israel", "bulgaria", "iraq", "uzbekistan", "jordania", "india",
    "indonesia", "vietnam", "tailandia", "mali", "burkinafaso",
    "caboverde", "zambia", "gabon",
}

FLAGS = {
    "burnley": "🟤", "heidenheim": "🔴", "auxerre": "⚪", "angers": "⚫",
    "lehavre": "🔵", "parisfc": "🔵", "cagliari": "🔴", "cremonese": "⚪",
    "hellasverona": "🟡", "lecce": "🟡", "parmacalcio": "🟡", "pisa": "🔵",
    "sassuolo": "🟢",
    "paraguay": "🇵🇾", "bolivia": "🇧🇴", "canada": "🇨🇦", "honduras": "🇭🇳",
    "elsalvador": "🇸🇻", "guatemala": "🇬🇹", "trinidadytobago": "🇹🇹",
    "romania": "🇷🇴", "chequia": "🇨🇿", "eslovaquia": "🇸🇰", "eslovenia": "🇸🇮",
    "finlandia": "🇫🇮", "bosnia": "🇧🇦", "albania": "🇦🇱", "georgia": "🇬🇪",
    "macedoniadelnorte": "🇲🇰", "israel": "🇮🇱", "bulgaria": "🇧🇬",
    "iraq": "🇮🇶", "uzbekistan": "🇺🇿", "jordania": "🇯🇴", "india": "🇮🇳",
    "indonesia": "🇮🇩", "vietnam": "🇻🇳", "tailandia": "🇹🇭", "mali": "🇲🇱",
    "burkinafaso": "🇧🇫", "caboverde": "🇨🇻", "zambia": "🇿🇲", "gabon": "🇬🇦",
}


def main():
    import sys
    sys.path.insert(0, "/home/piojo/football-cult/scripts/catalog-mining")
    from new_teams_batch6 import BATCH6

    content = open(PRODUCTS_TS, encoding="utf-8").read()

    # Dupe check against existing TeamKey union
    existing_keys = set(re.findall(r'^\s*\|\s*"([a-z]+)"', content, re.M))
    new_keys = [k for k in BATCH6 if k not in existing_keys]
    skipped = [k for k in BATCH6 if k in existing_keys]
    if skipped:
        print("Already present, skipping:", skipped)

    # 1. TeamKey union -- insert before the line ending the union
    # (the last `| "panama";` line, per the file's current ending).
    union_insert = "".join(f'\n  | "{k}"' for k in new_keys)
    content, n = re.subn(r'(\| "panama")(;)', r'\1' + union_insert.replace("\\", "\\\\") + r'\2', content, count=1)
    assert n == 1, "TeamKey union anchor not found"

    # 2. teamCategory
    cat_lines = "".join(
        f'  {k}: "{"national" if k in NATIONAL_KEYS else "club"}",\n' for k in new_keys
    )
    content, n = re.subn(
        r'(export const teamCategory: Record<TeamKey, CategoryKey> = \{\n)',
        r'\1' + cat_lines.replace("\\", "\\\\"),
        content, count=1,
    )
    assert n == 1, "teamCategory anchor not found"

    # 3. teamNames
    names_lines = "".join(
        f'  {k}: {{ es: "{BATCH6[k][0]}", en: "{BATCH6[k][1]}", pt: "{BATCH6[k][2]}" }},\n'
        for k in new_keys
    )
    content, n = re.subn(
        r'(export const teamNames: Record<TeamKey, Record<Locale, string>> = \{\n)',
        r'\1' + names_lines.replace("\\", "\\\\"),
        content, count=1,
    )
    assert n == 1, "teamNames anchor not found"

    # 4. teamFlags
    flags_lines = "".join(f'  {k}: "{FLAGS[k]}",\n' for k in new_keys)
    content, n = re.subn(
        r'(export const teamFlags: Record<TeamKey, string> = \{\n)',
        r'\1' + flags_lines.replace("\\", "\\\\"),
        content, count=1,
    )
    assert n == 1, "teamFlags anchor not found"

    # 5. teamColors
    colors_lines = "".join(
        f'  {k}: ["{BATCH6[k][3]}", "{BATCH6[k][4]}"],\n' for k in new_keys
    )
    content, n = re.subn(
        r'(export const teamColors: Record<TeamKey, \[string, string\]> = \{\n)',
        r'\1' + colors_lines.replace("\\", "\\\\"),
        content, count=1,
    )
    assert n == 1, "teamColors anchor not found"

    open(PRODUCTS_TS, "w", encoding="utf-8").write(content)
    print(f"products.ts: added {len(new_keys)} teams to all 5 tables.")

    # 6. extract.py TEAM_PATTERNS
    extract_content = open(EXTRACT_PY, encoding="utf-8").read()
    pattern_lines = "".join(
        f'    "{k}": r"{BATCH6[k][5]}",\n' for k in new_keys
    )
    extract_content, n = re.subn(
        r'(TEAM_PATTERNS = \{\n)',
        r'\1' + pattern_lines.replace("\\", "\\\\"),
        extract_content, count=1,
    )
    assert n == 1, "TEAM_PATTERNS anchor not found"
    open(EXTRACT_PY, "w", encoding="utf-8").write(extract_content)
    print(f"extract.py: added {len(new_keys)} regex entries to TEAM_PATTERNS.")


if __name__ == "__main__":
    main()
