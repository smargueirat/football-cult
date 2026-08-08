"""Generic version of apply_batch6.py: wires any new_teams_batchN.py into
products.ts (TeamKey union, teamCategory, teamNames, teamFlags,
teamColors) and extract.py's TEAM_PATTERNS -- the manual steps from the
README's "Adding a team" section, done in bulk.

Usage: python3 apply_batch.py <batch_module_name e.g. new_teams_batch7>
       <BATCH_DICT_NAME e.g. BATCH7> <national_key1,national_key2,...>
       <flag1=emoji,flag2=emoji,...>

Anchors on the actual end of the TeamKey union type (whatever it
currently is), not a hardcoded key -- apply_batch6.py's `| "panama"`
anchor broke the moment batch6 itself ran, since "panama" was no longer
immediately followed by `;` afterwards.
"""
import re, sys, importlib

PRODUCTS_TS = "/home/piojo/football-cult/src/data/products.ts"
EXTRACT_PY = "/home/piojo/football-cult/scripts/catalog-mining/extract.py"


def main():
    module_name, dict_name, national_csv, flags_csv = sys.argv[1:5]
    sys.path.insert(0, "/home/piojo/football-cult/scripts/catalog-mining")
    mod = importlib.import_module(module_name)
    batch = getattr(mod, dict_name)

    national_keys = set(k for k in national_csv.split(",") if k)
    flags = dict(pair.split("=") for pair in flags_csv.split(",") if pair)

    content = open(PRODUCTS_TS, encoding="utf-8").read()

    existing_keys = set(re.findall(r'^\s*\|\s*"([a-z]+)"', content, re.M))
    new_keys = [k for k in batch if k not in existing_keys]
    skipped = [k for k in batch if k in existing_keys]
    if skipped:
        print("Already present, skipping:", skipped)
    if not new_keys:
        print("Nothing new to add.")
        return

    def esc(s):
        return s.replace("\\", "\\\\")

    # 1. TeamKey union -- anchor on the union's own closing `;`, not a
    # specific hardcoded last member (that member changes every batch).
    union_insert = "".join(f'\n  | "{k}"' for k in new_keys)
    content, n = re.subn(
        r'(export type TeamKey =.*?)(;)',
        lambda m: m.group(1) + esc(union_insert) + m.group(2),
        content, count=1, flags=re.S,
    )
    assert n == 1, "TeamKey union anchor not found"

    # 2. teamCategory
    cat_lines = "".join(
        f'  {k}: "{"national" if k in national_keys else "club"}",\n' for k in new_keys
    )
    content, n = re.subn(
        r'(export const teamCategory: Record<TeamKey, CategoryKey> = \{\n)',
        r'\1' + esc(cat_lines),
        content, count=1,
    )
    assert n == 1, "teamCategory anchor not found"

    # 3. teamNames
    names_lines = "".join(
        f'  {k}: {{ es: "{batch[k][0]}", en: "{batch[k][1]}", pt: "{batch[k][2]}" }},\n'
        for k in new_keys
    )
    content, n = re.subn(
        r'(export const teamNames: Record<TeamKey, Record<Locale, string>> = \{\n)',
        r'\1' + esc(names_lines),
        content, count=1,
    )
    assert n == 1, "teamNames anchor not found"

    # 4. teamFlags
    flags_lines = "".join(f'  {k}: "{flags[k]}",\n' for k in new_keys)
    content, n = re.subn(
        r'(export const teamFlags: Record<TeamKey, string> = \{\n)',
        r'\1' + esc(flags_lines),
        content, count=1,
    )
    assert n == 1, "teamFlags anchor not found"

    # 5. teamColors
    colors_lines = "".join(
        f'  {k}: ["{batch[k][3]}", "{batch[k][4]}"],\n' for k in new_keys
    )
    content, n = re.subn(
        r'(export const teamColors: Record<TeamKey, \[string, string\]> = \{\n)',
        r'\1' + esc(colors_lines),
        content, count=1,
    )
    assert n == 1, "teamColors anchor not found"

    open(PRODUCTS_TS, "w", encoding="utf-8").write(content)
    print(f"products.ts: added {len(new_keys)} teams to all 5 tables.")

    # 6. extract.py TEAM_PATTERNS
    extract_content = open(EXTRACT_PY, encoding="utf-8").read()
    pattern_lines = "".join(f'    "{k}": r"{batch[k][5]}",\n' for k in new_keys)
    extract_content, n = re.subn(
        r'(TEAM_PATTERNS = \{\n)',
        r'\1' + esc(pattern_lines),
        extract_content, count=1,
    )
    assert n == 1, "TEAM_PATTERNS anchor not found"
    open(EXTRACT_PY, "w", encoding="utf-8").write(extract_content)
    print(f"extract.py: added {len(new_keys)} regex entries to TEAM_PATTERNS.")


if __name__ == "__main__":
    main()
