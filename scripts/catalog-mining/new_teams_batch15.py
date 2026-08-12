# Found in daily full mining pass (2026-08-12): PlanetFoot had a real
# Portland Timbers (MLS) jersey ("Maillot Portland Timbers Domicile Homme
# 2025/26 Vert") that matched no TEAM_PATTERNS entry at all -- genuinely
# missing team, not a title-format gap like the RB Leipzig/San Diego FC/
# LA Galaxy/Girona/Rennes abbreviation gaps fixed the same day (those were
# already-tracked teams, just needed looser regexes for punctuation/
# abbreviation variants like "RedBull Leipzig", "San Diego F.C.",
# "L.A. Galaxy", "GFC", "SRFC").
BATCH15 = {
    "portlandtimbers": ("Portland Timbers", "Portland Timbers", "Portland Timbers", "#0B4823", "#B7A036", r"\bportland timbers\b"),
    # Rest found the same day via FansJerseyHub's unmatched-title scan --
    # all verified genuine by photo (real crest/sponsor visible) before
    # adding: Vancouver Whitecaps FC and Orlando City SC (MLS), Málaga CF
    # (Spain, Segunda División), Club León (Liga MX, Mexico), Olympiacos FC
    # (Greek Super League), Guinea (national team, red/yellow/green kit).
    "vancouverwhitecaps": ("Vancouver Whitecaps FC", "Vancouver Whitecaps FC", "Vancouver Whitecaps FC", "#00245D", "#9BCBEB", r"vancouver whitecaps"),
    "orlandocity": ("Orlando City SC", "Orlando City SC", "Orlando City SC", "#61259E", "#FFFFFF", r"orlando city"),
    "malaga": ("Málaga CF", "Málaga CF", "Málaga CF", "#0E56A6", "#FFFFFF", r"\bm[aá]laga\b"),
    "leon": ("Club León", "Club León", "Club León", "#00693E", "#FFFFFF", r"club le[oó]n\b"),
    "olympiacos": ("Olympiacos FC", "Olympiacos FC", "Olympiacos FC", "#D2122E", "#FFFFFF", r"olympiacos|olympiakos"),
    "guinea": ("Guinea", "Guinea", "Guiné", "#CE1126", "#009460", r"\bguinea\b(?! bissau| ecuatorial| bisáu)|\bguin[ée]e\b(?! bissau| équatoriale| equatoriale)|\bguin[ée]\b(?! bissau| equatorial)"),
}
