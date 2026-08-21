"""Rotates through TEAM_PATTERNS in daily batches so the full ~385-team
eBay mining sweep completes over several days instead of blowing the
whole day's Browse API quota in one run.

Why this exists: a single `ebay_mine_full.py all` pass issues roughly
one API call per team per query type (~12/team, ~4600+ calls total for
the full team list) -- confirmed close to or over the daily quota on
its own (near-total 429 "Too many requests" runs on 2026-08-14 and
2026-08-20, the second one made worse by multiple same-day cloud test
runs sharing the same EBAY_CLIENT_ID). Running the full list every
single day meant most days captured nothing at all.

Usage:
    python3 ebay_mine_cycle.py <out_dir> [batch_size]

State persists in ebay_full_cycle_state.json (next to this script, NOT
in the ephemeral <out_dir> scratch path) so progress survives across
days/runs. This file should be committed to the repo alongside
products.ts so the cycle position isn't lost.

Each run:
  - Picks the next `batch_size` teams (default 60) not yet marked done
    in the current cycle, in TEAM_PATTERNS order.
  - Mines each with the same mine_current/mine_kids/mine_retro logic as
    ebay_mine_full.py (imported directly, not reimplemented).
  - Marks a team done for this cycle only if NONE of its queries hit a
    429 -- a team that genuinely has zero real listings still gets a
    clean 200 and counts as done; a team that got rate-limited stays
    pending and is retried in a future batch.
  - Stops early if 3 consecutive teams in the batch get rate-limited
    (quota's clearly gone for today -- no point burning through the
    rest of the batch on doomed requests).
  - Once every team in TEAM_PATTERNS is done, starts a new cycle
    (clears the done list, bumps the cycle counter) so the sweep keeps
    repeating indefinitely rather than stalling after the first pass.

Output files (current_picks.json / kids_picks.json / retro_picks.json
in <out_dir>) accumulate picks the same way ebay_mine_full.py's own
resume support does -- safe to call this repeatedly against the same
out_dir within one day if a run gets interrupted.
"""
import json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract import TEAM_PATTERNS
import ebay_mine_full as emf
from ebay_mine import EbayClient

STATE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ebay_full_cycle_state.json")

DEFAULT_BATCH_SIZE = 60
MAX_CONSECUTIVE_RATE_LIMITED = 3


def load_state():
    if os.path.exists(STATE_PATH):
        with open(STATE_PATH) as f:
            return json.load(f)
    return {"cycle": 1, "done_teams": []}


def save_state(state):
    with open(STATE_PATH, "w") as f:
        json.dump(state, f, indent=2, sort_keys=True)
        f.write("\n")


def mine_batch(out_dir, batch_size=DEFAULT_BATCH_SIZE):
    state = load_state()
    all_teams = list(TEAM_PATTERNS.keys())
    done = set(state["done_teams"])
    pending = [t for t in all_teams if t not in done]

    if not pending:
        print(f"Cycle {state['cycle']} complete ({len(all_teams)} teams) -- starting cycle {state['cycle'] + 1}")
        state = {"cycle": state["cycle"] + 1, "done_teams": []}
        done = set()
        pending = all_teams

    batch = pending[:batch_size]
    print(f"Cycle {state['cycle']}: {len(done)}/{len(all_teams)} teams already done this cycle, "
          f"mining next {len(batch)} ({len(pending) - len(batch)} left after this batch)")

    os.makedirs(out_dir, exist_ok=True)
    client = EbayClient()
    team_en = emf.get_team_en_names()
    teams_re = emf.team_re_all()
    types_re = emf.type_re_all()

    paths = {
        "current": os.path.join(out_dir, "current_picks.json"),
        "kids": os.path.join(out_dir, "kids_picks.json"),
        "retro": os.path.join(out_dir, "retro_picks.json"),
    }
    picks = {k: emf.load(p) for k, p in paths.items()}

    consecutive_rate_limited = 0
    newly_done = []

    for team_key in batch:
        if team_key not in team_en:
            print(f"SKIP {team_key}: no English name found in products.ts")
            newly_done.append(team_key)  # would never resolve -- don't retry forever
            continue
        en = team_en[team_key]
        client.rate_limited = False

        found = emf.mine_current(client, team_key, en, teams_re, types_re)
        picks["current"].update(found)
        for k, v in found.items():
            print(f"[current] {k}: {v['title'][:65]} ${v['price']}")

        found = emf.mine_kids(client, team_key, en, teams_re, types_re)
        picks["kids"].update(found)
        for k, v in found.items():
            print(f"[kids] {k}: {v['title'][:65]} ${v['price']}")

        found = emf.mine_retro(client, team_key, en, teams_re, types_re)
        picks["retro"].update(found)
        for k, v in found.items():
            print(f"[retro] {k}: {v['title'][:65]} ${v['price']}")

        for k, p in paths.items():
            emf.save(picks[k], p)

        if client.rate_limited:
            consecutive_rate_limited += 1
            print(f"  {team_key}: hit a 429 this round -- stays pending, will retry in a future batch")
        else:
            consecutive_rate_limited = 0
            newly_done.append(team_key)

        if consecutive_rate_limited >= MAX_CONSECUTIVE_RATE_LIMITED:
            print(f"{MAX_CONSECUTIVE_RATE_LIMITED} consecutive teams rate-limited -- quota's exhausted "
                  f"for today, stopping early ({len(newly_done)}/{len(batch)} of this batch completed)")
            break

    state["done_teams"] = sorted(done | set(newly_done))
    save_state(state)
    print(f"\nDone. current={len(picks['current'])} kids={len(picks['kids'])} retro={len(picks['retro'])} "
          f"-- {len(newly_done)} teams newly completed this run, "
          f"{len(state['done_teams'])}/{len(all_teams)} done in cycle {state['cycle']}")


if __name__ == "__main__":
    out_dir = sys.argv[1]
    batch_size = int(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_BATCH_SIZE
    mine_batch(out_dir, batch_size)
