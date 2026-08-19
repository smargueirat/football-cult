# Found 2026-08-19 via a manual unmatched-title scan across AdidasES/PT's
# feeds (Awin), run specifically to broaden long-tail/obscure-team
# coverage beyond the daily automated pass (which only refreshes teams
# already in TEAM_PATTERNS, never expands it). Both verified genuine by
# downloading and looking at the actual product photo before adding, per
# the standing rule: 1. FC Nürnberg's 2025/26 home jersey shows the real
# "1. FCN 1900-2025" crest, adidas branding, toolcraft/Helmsauer sponsors;
# FC Schalke 04's shows the real "S04" crest, adidas branding, "SUN
# MINIMEAL" sponsor. Both real German clubs (2. Bundesliga) with zero
# prior coverage in the catalog.
BATCH16 = {
    "nurnberg": ("1. FC Nürnberg", "1. FC Nürnberg", "1. FC Nürnberg", "#9E1B32", "#000000", r"1\.?\s*fc\s*n[uü]rnberg"),
    "schalke04": ("FC Schalke 04", "FC Schalke 04", "FC Schalke 04", "#004D9D", "#FFFFFF", r"schalke\s*0?4\b|fc schalke"),
}
