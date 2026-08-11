// Maps an old product id to whatever it became when a catalog maintenance
// pass renamed, merged, or split it. Without this, a saved favorite
// pointing at the old id would just silently vanish from the user's list
// the next time the catalog updates (findProduct returns undefined, and
// the favorites page quietly filters it out -- no error, no notice).
//
// Add an entry here any time a product id changes for a reason OTHER than
// "this product shouldn't exist at all" (wrong team, fake/unlicensed item,
// etc. -- those should just disappear, redirecting them would be wrong).
// Point every entry at the CURRENT id directly, not at another alias, so a
// single lookup always resolves (see resolveProductId below).
export const PRODUCT_ID_ALIASES: Record<string, string> = {
  // 2026-08-11: retro id-generation bug -- an id's embedded "season" digits
  // were actually a mis-captured kids age-range or size suffix, not a real
  // season. Renamed to match the real season field.
  "escocia-retro-201314-away": "escocia-retro-2007-away",
  "sunderland-retro-201112-away": "sunderland-retro-2015-away",
  "ajax-retro-201112-away": "ajax-retro-1998-away-kids",
  "dinamarca-retro-201516-away": "dinamarca-retro-2010-away-kids",
  "newcastle-retro-201314-away": "newcastle-retro-202425-away-kids",
  "newcastle-retro-2024-away": "newcastle-retro-202425-away-kids",

  // 2026-08-11: exact-duplicate-offer-URL cleanup -- a bare-year id and a
  // season-span id for the same real product got merged into one (the
  // season-span id kept, confirmed identical by photo in every case).
  "alemania-retro-2020-home": "alemania-retro-202021-home",
  "argentina-retro-2024-training": "argentina-retro-202425-training",
  "barcelona-retro-1974-away": "barcelona-retro-197475-away",
  "manutd-retro-2023-training": "manutd-retro-202324-training",
  "nottinghamforest-retro-1995-away": "nottinghamforest-retro-199597-away",
  "nottinghamforest-retro-1976-home": "nottinghamforest-retro-197677-home",
  "roma-retro-1978-away": "roma-retro-197879-away",
  "roma-retro-1980-away": "roma-retro-198081-away",
  "roma-retro-1978-home": "roma-retro-197879-home",
  "alemania-retro-2014-away": "alemania-retro-201415-away",
  "bayern-retro-1995-home": "bayern-retro-199597-home",
  "brasil-retro-1994-away": "brasil-retro-199496-away",
  "estadosunidos-retro-1994-home": "estadosunidos-retro-199495-home",
  "irlanda-retro-1990-home": "irlanda-retro-199092-home",
  "lazio-retro-199800-away": "lazio-retro-199899-away",
  "liverpool-retro-1989-away": "liverpool-retro-198991-away",
  "manutd-retro-1992-away": "manutd-retro-199294-away",
  "manutd-retro-2006-away": "manutd-retro-200608-away",
  "manutd-retro-1992-home": "manutd-retro-199294-home",
  "manutd-retro-1994-home": "manutd-retro-199496-home",
  "manutd-retro-1996-home": "manutd-retro-199698-home",
  "portugal-retro-2014-home": "portugal-retro-201415-home",
  "santos-retro-2012-home": "santos-retro-201213-home",
  "turquia-retro-2008-home": "turquia-retro-200809-home",
  "alemania-retro-2022-home": "alemania-retro-202223-home",
  "chelsea-retro-200305-away": "chelsea-retro-200304-away",
  "barcelona-retro-2019-away": "barcelona-retro-201920-away",
  "roma-retro-2022-away": "roma-retro-202223-away",
  "roma-retro-1998-home": "roma-retro-199899-home",
  "mancity-retro-2022-third": "mancity-retro-202223-third",
  "belgica-retro-2022-away": "belgica-retro-202224-away",
  "everton-retro-2023-third": "everton-retro-202324-third",
  "intermilan-retro-2011-home": "intermilan-retro-201112-home",
  "strasbourg-retro-2024-third": "strasbourg-retro-202425-third",
  "irlanda-retro-1998-home": "irlanda-retro-199899-home",
  "chelsea-retro-2016-home": "chelsea-retro-201617-home",
  "everton-retro-2017-home": "everton-retro-201718-home",
  "francia-retro-2022-home": "francia-retro-202223-home",
  "intermilan-retro-2022-home": "intermilan-retro-202223-home",
  "manutd-retro-2015-third": "manutd-retro-201516-third",
  "newcastle-retro-2024-third": "newcastle-retro-202425-third",
  "nigeria-retro-2022-home": "nigeria-retro-202223-home",
  "polonia-retro-2022-home": "polonia-retro-202223-home",
  "unionberlin-retro-2020-home": "unionberlin-retro-202021-home",
  "werderbremen-retro-2018-home": "werderbremen-retro-201819-home",
  "wolfsburg-retro-2017-away": "wolfsburg-retro-201718-away",

  // 2026-08-11: earlier duplicate cleanup this same session.
  "espana-training-2026": "espana-training-202526",
  "acmilan-prematch-2026": "acmilan-prematch-202526",
  "chelsea-prematch-2026": "chelsea-prematch-202526",
  "benfica-prematch-202526": "benfica-prematch-202627",
};

// Resolves an id through the alias map (one hop -- every alias points at a
// real current id, never at another alias, so this never needs to loop).
export function resolveProductId(id: string): string {
  return PRODUCT_ID_ALIASES[id] ?? id;
}
