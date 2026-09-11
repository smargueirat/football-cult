"""Flag eBay picks whose title names a MORE SPECIFIC team than the one queried.

eBay's Browse search is keyword-relevance, so a "Germany third soccer jersey"
query happily returns "FC Schalke 04 Germany 2021/22 ... Third Kit" -- and
mine_*() only checks that the QUERIED team's pattern matches the title, never
that some other team's pattern matches it better. Heuristic: if another
TEAM_PATTERNS entry matches a substring at least as long in the same title, that other
team is the real subject. Comparing match lengths keeps legitimate nesting
("Inter Miami" beats "Inter") from tripping this.
"""
import json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract import team_re_all

teams = team_re_all()

def flag(path):
    if not os.path.exists(path):
        return []
    out = []
    for key, d in json.load(open(path, encoding='utf-8')).items():
        team = key.split('|')[0]
        title = d.get('title') or ''
        mine = teams[team].search(title) if team in teams else None
        if not mine:
            continue
        mine_len = len(mine.group(0))
        for other, pat in teams.items():
            if other == team:
                continue
            m = pat.search(title)
            if m and len(m.group(0)) >= mine_len:
                out.append((key, other, m.group(0), d))
                break
    return out

for name in ('current', 'kids', 'retro'):
    hits = flag(f"{sys.argv[1]}/{name}_picks.json")
    print(f"== {name}: {len(hits)} flagged")
    for key, other, txt, d in hits:
        print(f"   {key:42s} -> {other} ({txt!r}) | {d['title'][:70]}")
