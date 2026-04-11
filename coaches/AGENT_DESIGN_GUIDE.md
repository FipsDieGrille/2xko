# Agent Design Guide

How to create a character coach agent from Discord community data. This documents the exact process used to build the Akali agent.

## Overview

Each character agent exists in two places:
1. **Claude Code CLI agent** — `~/.claude/agents/{character}.md` (for direct conversations via `claude --agent {Character}`)
2. **In-app agent** — `src/agents/{character}.ts` (for the 2XKO Hub app, registered in `src/agents/index.ts`)

Both contain the same knowledge base. The CLI version uses YAML frontmatter; the in-app version wraps the prompt in a TypeScript `AgentDefinition` object.

---

## Step 1: Source Data

### Discord Export

Export the character's discussion channel from the 2XKO Discord using DiscordChatExporter (or similar). The JSON file goes in `coaches/`.

**File naming:** `2XKO - Champion Discussion - {character} [{channel_id}].json`

### What the JSON looks like

```json
{
  "guild": { "id": "...", "name": "2XKO" },
  "channel": { "name": "akali", "category": "Champion Discussion" },
  "messages": [
    {
      "id": "...",
      "timestamp": "2026-04-08T...",
      "content": "message text",
      "author": { "name": "username", "roles": [...] },
      "attachments": [...],
      "embeds": [...]
    }
  ]
}
```

### Key fields to extract
- `content` — the message text, where all the knowledge is
- `author.name` — identify top contributors and moderators (their messages are higher signal)
- `author.roles` — moderators/mentors are usually the most reliable sources
- `timestamp` — for dating resource links
- `attachments` — video clips (.mp4) uploaded directly
- `embeds` — YouTube/Twitter/Streamable links with titles
- `isPinned` — pinned messages are curated by mods, always high value

---

## Step 2: Extract High-Signal Data

### Noise vs. Signal

Most Discord messages are noise (reactions, short banter, off-topic, memes). Filter for:

**High signal (extract):**
- Messages with combo notation (patterns like `5M`, `2H`, `jS2`, `j.2H`, etc.)
- Messages explaining mechanics (how a system works, frame advantage numbers)
- Messages with specific damage numbers or frame data
- Messages describing setups, oki, or mixups with specific inputs
- Messages discussing team synergy with reasoning
- Messages teaching execution tips (how to time something, input tricks)
- Pinned messages (always extract)
- Messages from top contributors (high message count + moderator/mentor roles)

**Low signal (skip):**
- Messages under ~30 characters (usually reactions or single words)
- Pure emoji messages
- Off-topic discussion (skins, lore, complaints about matchmaking)
- "Anyone else having trouble with X?" without an answer
- Duplicate links to the same video

### Extraction categories

Run keyword-filtered passes over the messages to bucket them:

1. **Combo routes & notation** — keywords: `combo`, `bnb`, `dmg`, `damage`, `optimal`, `ender`, `loop`, `starter`, plus regex for notation patterns like `[52346][LMHS]`, `j[\.\[]?[LMHS2]`
2. **Character mechanics** — keywords specific to the character's system (for Akali: `smoke`, `shroud`, `enhanced`, `twilight`, `stealth`)
3. **Team synergy & partners** — keywords: `team`, `partner`, `assist`, `fuse`, `freestyle`, `tag`, plus other character names
4. **Oki / mixups / setups** — keywords: `oki`, `meaty`, `mixup`, `crossup`, `wakeup`, `setup`, `teleport`, `pressure`, `plus on`, `safe`
5. **Neutral game** — keywords: `neutral`, `poke`, `approach`, `range`, `anti-air`, `whiff`
6. **Execution tips** — keywords: `timing`, `delay`, `input`, `trick`, `buffer`, `cancel`, `consistent`

### What to look for in each category

**Combos:** Extract the full notation string, damage value, meter cost, position requirement, and any tips about difficulty or timing. Note who discovered/posted it and whether it was validated by others.

**Mechanics:** Look for explanations of HOW a system works (inputs, what it does, interactions). Frame advantage numbers are gold. Look for consensus across multiple contributors.

**Team synergy:** Note which partners are discussed positively and WHY. Extract specific setups (e.g., "after forward throw, whiff 5L > Ekko assist > teleport"). Note fuse recommendations with reasoning.

**Oki/mix:** Extract specific post-knockdown or post-throw sequences with inputs. Note what they beat and what beats them.

**Execution:** These are the most valuable for a coach agent. Look for input tricks (e.g., "input j.963H to get both jump cancel and 2H"), timing cues ("wait for the second sound"), and common mistakes with fixes.

---

## Step 3: Organize Knowledge

Structure the extracted data into these sections for the agent's knowledge base:

```
IDENTITY & PLAYSTYLE
  - Archetype, release date, difficulty, core gameplan philosophy

NOTATION KEY
  - Numpad directions, buttons, modifiers specific to this character

KEY NORMALS & PROPERTIES
  - Standing, crouching, air normals with notable properties
  - Command normals and movement options

CHARACTER-SPECIFIC SYSTEM
  - The character's unique mechanic (Akali = Smoke, Caitlyn = Traps/Rifle)
  - How to activate, what it does, frame advantage values

COMBO ROUTES
  - Beginner (simple, no execution barrier)
  - Intermediate (core BnBs with the character's main loops/routes)
  - Advanced (optimized, high execution)
  - Damage benchmarks at each level
  - Ender philosophy (when to use which ender)

EXECUTION TIPS
  - The hard parts and how to do them
  - Input tricks and shortcuts
  - Common mistakes and fixes

BLOCK STRINGS & PRESSURE
  - Basic block strings
  - How to open people up
  - Mix options

OKI & SETUPS
  - After throw
  - After super
  - After specific enders
  - Character-system-specific oki (e.g., smoke oki)
  - Sandwich/tag setups

TEAM SYNERGY & PARTNERS
  - Tier 1 and Tier 2 partners with reasoning
  - Fuse recommendations
  - Character's assist quality assessment

NEUTRAL GAME
  - Primary tools
  - Gameplan and philosophy
  - Weaknesses in neutral

SUPERS
  - Each super with properties and when to use

COMPETITIVE STATUS
  - Community perception, tier placement, ongoing meta developments

COMMUNITY RESOURCES (dated)
  - Video links with [YYYY-MM-DD] dates
  - Organized by: Official, Combo Guides, Optimal Combos, Tech & Setups, Lab Clips
```

---

## Step 4: Write the Agent

### Voice & Personality

The agent IS the character. First person throughout:
- "I" when referring to the character's moves, kit, playstyle
- "my" normals, "my" smoke, "my" combos
- Confident and direct -- like a coach who mains this character
- Match the character's personality loosely (Akali = deadly confident ninja, Caitlyn = precise and calculated)

### CLI Agent Format (`~/.claude/agents/{character}.md`)

```yaml
---
name: {Character}
description: 2XKO {Character} expert coach. Use when the user asks about {Character} gameplay, combos, matchups, strategy, {unique mechanic}, or team compositions in 2XKO.
model: sonnet
color: {color}
---

{System prompt with personality instructions}
{Formatting rules}
{Resource expiration rule}
{Full knowledge base}
{Community resources with dates}
```

**Color options:** red, orange, yellow, green, blue, purple, pink

### In-App Agent Format (`src/agents/{character}.ts`)

```typescript
import { AgentDefinition } from './types';

export const {character}: AgentDefinition = {
  id: '{character}',
  name: '{Character} Coach',
  description: '{Short flavorful description}',
  character: '{Character}',
  color: '{hex color}',
  avatar: '{emoji}',
  systemPrompt: `{Same system prompt as CLI, with backticks escaped as \\\`}`,
};
```

**Important:** In the TypeScript file, all backticks inside the template literal must be escaped as `\\\``. The CLI markdown version uses raw backticks.

### Registration

Add the agent to `src/agents/index.ts`:

```typescript
import { akali } from './akali';
import { caitlyn } from './caitlyn';
import { newCharacter } from './newCharacter';

export const agents: AgentDefinition[] = [akali, caitlyn, newCharacter];
```

---

## Step 5: Resource Expiration System

All video/resource links include a date tag:

```
- [2026-04-08] Description -- https://url.com
```

The agent has this instruction:

> Do NOT reference or recommend any link whose date is more than 4 months before today's date. Expired links may show outdated tech, nerfed combos, or removed content. If all links for a topic are expired, teach from the knowledge base and say "check the community Discord for the latest videos."

The agent always knows today's date from the system context, so it can compare. When updating the agent with new resources, just add new dated entries. Old ones age out naturally.

---

## Step 6: Validation

1. **Type-check:** Run `cd web && npx tsc --noEmit` to verify the in-app agent compiles
2. **CLI test:** Run `claude --agent {Character}` and ask a few questions:
   - "What's a good beginner combo?"
   - "How does {unique mechanic} work?"
   - "Who should I pair with?"
   - "How do I do {hard execution thing}?"
3. **Verify first-person voice:** The agent should say "my normals" not "Akali's normals"
4. **Verify notation formatting:** Combo strings should be wrapped in backticks

---

## Reference: Existing Agents

| Character | CLI Agent | In-App Agent | Color | Avatar |
|-----------|-----------|--------------|-------|--------|
| Akali | `~/.claude/agents/akali.md` | `src/agents/akali.ts` | green / #84c441 | ninja |
| Caitlyn | `~/.claude/agents/caitlyn.md` | `src/agents/caitlyn.ts` | purple / #7c5cbf | gun |

---

## Rules

1. **Don't follow other agents' patterns.** Every champion is different. Do not assume that because Caitlyn's Super 1 is X, another character's Super 1 works the same way. Moveset numbering, button mappings, and system mechanics vary per character. Treat each agent as independent.
2. **If ANYTHING is unclear, ask the user.** Do not infer or guess mappings, mechanics, or terminology from context when the source data is ambiguous. The user likely knows the answer. Flag uncertainty and ask before writing it into the agent.

---

## Tips from Building Akali

- **Top contributors are your best source.** In Akali's channel, lapistto (337 msgs, moderator) and inahk (296 msgs) provided ~90% of the actionable knowledge. Identify these people early.
- **Pinned messages are curated gold.** Always extract these first.
- **Execution tips are the most coach-like content.** Frame data and combos are available on wikis, but "wait for the second sound of 3H before inputting jump cancel" is coaching.
- **Don't chase every combo.** The Discord had dozens of slight variations. Pick the community-validated BnBs at each difficulty tier, not every experiment.
- **Damage benchmarks help players gauge progress.** Knowing "beginner = ~280, intermediate = ~438, advanced = ~600" is more useful than listing 20 combos.
- **Team synergy needs reasoning, not just names.** "Ekko is good" is useless. "Ekko enables gapless smokebomb pressure at +7 because of sandwich tag sequences" is coaching.
- **The agent will be wrong sometimes.** Game patches change things. The knowledge base is a snapshot. Plan to update it when new Discord exports are available or patches drop.
