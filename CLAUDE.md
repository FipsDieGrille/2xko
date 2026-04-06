# 2XKO Hub

Community companion app + website for 2XKO (Riot Games 2v2 tag-team fighting game). Combo lists, matchups, frame data, and tools for the FGC community.

## Project Structure

This is a **monorepo** with two frontends sharing data:

```
/                          # Root — Expo/React Native mobile app
├── app/                   # Expo Router file-based routes
├── src/                   # Shared code (used by BOTH app and web)
│   ├── combos/            # Combo data per character (TypeScript)
│   ├── characters/        # Character registry (RN version, uses require())
│   ├── components/        # RN components (ComboNotation, etc.)
│   ├── theme.ts           # App color palette
│   └── package.json       # { "type": "module" } — CRITICAL for ESM/CJS compat
├── web/                   # Next.js website (deployed on Vercel)
│   ├── src/app/           # App Router pages
│   ├── src/components/    # Web components (Nav, Footer, ComboCard, etc.)
│   ├── src/lib/           # Web character registry (uses imagePath strings)
│   └── public/            # Static assets (icons, character images, logo)
├── characters/            # Source character images (not deployed)
├── 2xko_combo_sources/    # CSV combo data from spreadsheets (not deployed)
└── other images/          # Logo, hero bg, etc. source files
```

### How web and app share data

Both import from `src/combos/` for combo data. The web uses relative imports (`../../../../src/combos`) enabled by:

- `web/next.config.ts`: `externalDir: true` + `turbopack.root` set to parent dir
- `src/package.json`: `{ "type": "module" }` — fixes ESM/CJS conflict (root package.json is CommonJS for Expo)

Character registries are separate: `src/characters/index.ts` (RN with `require()`) vs `web/src/lib/characters.ts` (web with string paths).

## Characters

13 characters: Ahri, Akali (coming soon), Blitzcrank, Braum, Caitlyn, Darius, Ekko, Illaoi, Jinx, Teemo, Vi, Warwick, Yasuo.

Only Caitlyn and Ekko have combo data so far. Others have empty arrays.

## Combo Data Model

Defined in `src/combos/types.ts`:

```typescript
interface ComboEntry {
  id: string;
  name: string;
  notation: string;           // e.g. 'M > 2H > 9M > H > S2'
  difficulty?: 'beginner' | 'intermediate' | 'advanced';  // optional
  position: 'anywhere' | 'corner' | 'midscreen';
  damage: number | null;
  damageMax?: number;
  meter: number;              // bars required
  meterGain?: number;
  starter: string;            // first input (e.g. 'M', '2L')
  hasAssist: boolean;
  partner?: string;           // tag partner name (e.g. 'Jinx')
  fuse?: string;              // required fuse (e.g. 'Double Down')
  notes?: string;
}
```

Each character has a file in `src/combos/{character}.ts` exporting an array. These are registered in `src/combos/index.ts`.

### Adding a new character's combos

1. Add the TS file: `src/combos/{name}.ts`
2. Import and register in `src/combos/index.ts`

## Converting Combos from CSV

The user provides combo data as semicolon-delimited CSV files in `2xko_combo_sources/`. CSV columns:

```
Character; Notation; Position; Bar Use Point Char; Damage; Difficulty; Assist Character; Fuse; Bar Use Assist Char; Bar Use Total
```

### Conversion rules

- **Notation**: Uppercase the entire string, replace commas with ` > ` separators. CSV `m, 2h, 9m,h,s2` becomes `M > 2H > 9M > H > S2`
- **Position**: Empty or missing = `'anywhere'`, "Corner" = `'corner'`
- **Meter**: Use "Bar Use Total" column (last column)
- **Difficulty**: Leave undefined if empty in CSV — do NOT auto-generate
- **Assist**: If "Assist Character" column has a value, set `hasAssist: true` and `partner` to that value
- **Fuse**: If "Fuse" column has a value, set `fuse` to that value
- **Damage**: Use as-is, null if empty
- **Name**: Auto-generate from context: "0-Bar BnB", "1-Bar Route", "Corner Route", "{Char} + {Partner}", etc.
- **Starter**: First token of the converted notation
- **Duplicates**: Remove exact notation duplicates

### CSV quirks

- Files may use `\r` line endings (Mac Excel export) — split on `\r` not `\n`
- All data may appear on one line when read naively

## Combo Notation System

Visual notation renders fighting game inputs as icons. The tokenizer in `ComboNotation.tsx` maps tokens to icon images in `/public/icons/` (web) or inline (RN).

Available tokens: `1-9`, `11-99` (doubles), `L M H S1 S2 T D JC Plus`, `LL MM HH S1S1 S2S2`

Separators rendered as text: `> ~ , dl. j`

Brackets `[X]` and `{X}` indicate held inputs (rendered with reduced opacity + ring).

## Filters

Both web and mobile have these filter groups:

- **Meter**: Any / 0 bars / 1 bar / 2+ bars
- **Assist**: Any / Solo / {dynamic partner names}
- **Position**: Any / Corner / Midscreen (combos with position `'anywhere'` show in ALL filters)
- **Difficulty**: Any / BEG / INT / ADV (combos without difficulty show only in "Any")
- **Fuse**: Only appears when fuses exist in the combo list. Any / {dynamic fuse names}
- **Starter**: (mobile only) Any / {dynamic starter values}

## Tech Stack

### Mobile App
- **Expo** with **Expo Router** (file-based routing)
- React Native Animated API for carousel
- Root package.json: `"type": "commonjs"`

### Website
- **Next.js 16** with App Router and Turbopack
- **Tailwind CSS v4** (uses `@theme inline` in CSS, no tailwind.config.js)
- **Fonts**: Exo 2 (headings) + Inter (body) via `next/font/google`
- Deployed on **Vercel** (auto-deploys from GitHub on push, root dir = `web/`)
- Production URL: `2xko-jet.vercel.app`

### Important Next.js notes
- Always check `web/node_modules/next/dist/docs/01-app/` for current API docs before writing Next.js code
- `generateStaticParams()` is used for character pages (SSG)
- Tailwind v4 theme colors defined in `web/src/app/globals.css` with `@theme inline`

## Git & Deployment

- GitHub repo: `FipsDieGrille/2xko` (HTTPS remote, not SSH)
- Push to main triggers Vercel deploy automatically
- Push with: `GH_TOKEN=$(gh auth token) git push origin main`

## Feature Roadmap

### Currently implemented
- Combo lists with rich filtering (web + mobile)
- Visual combo notation with icons
- Character roster with images
- Site navigation: Roster, Match Prep (placeholder), Reference (placeholder)
- Visual design: glassmorphism nav, hero section, Exo 2 + Inter fonts

### Planned standalone features
- Frame data browser
- Punish finder
- Team builder
- Matchups
- Okizeme

### Planned combo-section features
- Combo builder (user creates own combos)
- Combo challenge (rate consistency 1-5 stars, track progress)
- Lab checklist (flag combos to practice)

## Design Notes

- Dark gaming aesthetic, not flashy — between Linear and Dustloop
- Background: `#080810`, Surface: `#12121e`, Accent: `#6c5ce7`
- Glass effects with `backdrop-filter: blur(16px)`
- The official 2XKO game logo (lime green `#cdf564`) is used in nav, hero, footer
- Character images are placeholders from the wiki — will be replaced with own screenshots
