# Combo Source File Notation Reference

This documents the format used in combo source files (e.g., `Akali/1. Akali.md`) and how to convert them into TypeScript combo data.

---

## Source File Structure

### Headers define position and fuse context

```
# /[1. Any location]/       → position: 'anywhere'
# /[2. Corner]/              → position: 'corner'
## /[1.1 Normal]/            → no fuse required
## /[1.2 Twilight Shroud]/   → fuse: 'Twilight Shroud'
```

- `#` = position section
- `##` = sub-section for fuse/special requirement
- "Any location" = `'anywhere'`, "Corner" = `'corner'`
- "Normal" = no fuse, any other name = fuse value

### Starters

A bare line (no `~`, no `-`) defines a starter sequence:

```
m                → starter: 'M'
l,l,2l           → starter: 'L > L > 2L'
2h               → starter: '2H'
```

All combos listed below a starter use that starter until a new starter appears.

### Combo lines

Bullet lines starting with `~ ` connect to the starter:

```
m
- ~ 2m,h(2),3h,9,jh,js2 /438 .27 /[Name: Huey BnB]/
```

Full combo = starter + combo body: `M > 2M > H(2) > 3H > 9 > JH > JS2`

### Branching (variants)

When a combo body appears on its own `~ ` line followed by indented `~` lines, those are **variant endings** of a single combo:

```
l,l,2l
- ~ s1,s1,m,2m,h(2),2h
    ~9,jm,jh,jm,jh,js2 /283 .18
    ~h(2),s2,s2+m /364 .14  1-0
    ~h(2),s2 /244 .14 TW
```

- Shared combo body: `S1 > S1 > M > 2M > H(2) > 2H`
- Variant 1 ending: `9 > JM > JH > JM > JH > JS2`
- Variant 2 ending: `H(2) > S2 > S2+M`
- Variant 3 ending: `H(2) > S2`

**Separate combos vs variants**: Direct bullet points under a starter = separate combos. Indented continuations under a shared body line = variants of one combo.

---

## Metadata Format

After the notation on each combo/variant line:

```
/DAMAGE .HITS [BAR_POINT-BAR_ASSIST] [TW] /[Name: COMBO_NAME]/
```

| Token | Meaning | Example |
|-------|---------|---------|
| `/438` | Damage | 438 damage |
| `.27` | Hit count | 27 hits |
| `1-0` | Bar cost: point char - assist char | 1 bar point, 0 bar assist (total: 1) |
| `TW` | Twilight Shroud requirement (Akali-specific, ignore for now) | — |
| `/[Name: Huey BnB]/` | Explicit combo name | — |

- If no bar cost is listed, meter = 0
- Total meter = bar_point + bar_assist
- Damage and hits are always present on variant/combo lines

---

## Notation Tokens

### Directional inputs (numpad notation)

```
7 8 9      ↖ ↑ ↗
4 5 6  =   ← N →
1 2 3      ↙ ↓ ↘
```

- `2` = down, `6` = forward, `8` = up, `9` = up-forward, etc.
- `3` = down-forward (used in Akali data: `3h` = down-forward heavy)

### Buttons

| Token | Meaning |
|-------|---------|
| `L` | Light attack |
| `M` | Medium attack |
| `H` | Heavy attack |
| `S1` | Special 1 |
| `S2` | Special 2 |
| `T` | Tag / assist call |
| `D` | Dash |

### Modifiers

| Notation | Meaning | Example |
|----------|---------|---------|
| `j` prefix | Jump/aerial move | `jh` = jump heavy, `j2h` = jump down-heavy |
| `(N)` after move | Hit confirmation — cancel from Nth hit of a multi-hit move | `h(2)` = cancel from 2nd hit of heavy |
| `[X]` brackets | Hold input | `[h]` = hold heavy, `j[h]` = jump hold heavy |
| `{X}` braces | Partial charge | `{s1}` = partially charged special 1 |
| `+` between moves | Simultaneous press | `s2+m` = special 2 + medium together |

### Separators

| Source | Converted | Meaning |
|--------|-----------|---------|
| `,` | ` > ` | Sequential input separator |
| `~` | ` > ` | Connects starter to combo body (or combo to ending) |
| `dl.` | `dl.` | Delay before next input |

---

## Conversion Rules

1. **Uppercase** the entire notation string: `m,2h,jm` → `M > 2H > JM`
2. **Commas → ` > `**: `m,2h,9,jh` → `M > 2H > 9 > JH`
3. **Tilde joins**: starter `~` combo body and combo body `~` ending are joined with ` > `
4. **Preserve modifiers**: `h(2)` → `H(2)`, `j[h]` → `J[H]`, `s2+m` → `S2+M`
5. **Remove spaces** around commas/tildes before converting
6. **Split branching**: shared body + indented endings = one ComboEntry with variants
7. **Direct bullets** under same starter = separate ComboEntry objects
