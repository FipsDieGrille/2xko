import { ImageSourcePropType } from 'react-native';
import { getIcon } from './icons';

export interface ComboToken {
  type: 'icon' | 'text';
  value: string;
  icon?: ImageSourcePropType;
}

// Matches hold notation [X] or {X}, direction+button combos, double inputs, keywords, etc.
// Order matters: longest/most specific patterns first.
const TOKEN_PATTERNS: Array<{ regex: RegExp; handler: (match: string[]) => ComboToken[] }> = [
  // Hold notation: [S1], [S2], [H], [M], [L]
  {
    regex: /^\[S([12])\]/,
    handler: (m) => {
      const key = `S${m[1]}S${m[1]}`;
      const icon = getIcon(key);
      return icon ? [{ type: 'icon', value: key, icon }] : [{ type: 'text', value: m[0] }];
    },
  },
  {
    regex: /^\[([LMHT])\]/,
    handler: (m) => {
      const key = `${m[1]}${m[1]}`;
      const icon = getIcon(key);
      return icon ? [{ type: 'icon', value: key, icon }] : [{ type: 'text', value: m[0] }];
    },
  },
  // Partial charge notation: {S1}, {S2}, {H}, {M}, {L} -- use hold icon
  {
    regex: /^\{S([12])\}/,
    handler: (m) => {
      const key = `S${m[1]}S${m[1]}`;
      const icon = getIcon(key);
      return icon ? [{ type: 'icon', value: key, icon }] : [{ type: 'text', value: m[0] }];
    },
  },
  {
    regex: /^\{([LMHT])\}/,
    handler: (m) => {
      const key = `${m[1]}${m[1]}`;
      const icon = getIcon(key);
      return icon ? [{ type: 'icon', value: key, icon }] : [{ type: 'text', value: m[0] }];
    },
  },
  // Dash cancel >>
  {
    regex: /^>>/,
    handler: () => {
      const icon = getIcon('D');
      return icon ? [{ type: 'icon', value: 'D', icon }] : [{ type: 'text', value: '>>' }];
    },
  },
  // Double directions (dash): 66, 44, 88, etc.
  {
    regex: /^(66|44|22|88|99|77)/,
    handler: (m) => {
      const icon = getIcon(m[1]);
      return icon ? [{ type: 'icon', value: m[1], icon }] : [{ type: 'text', value: m[1] }];
    },
  },
  // Super notation: Super 1 = S1+L, Super 2 = S2+M
  {
    regex: /^Super\s*1/,
    handler: () => {
      const s1 = getIcon('S1');
      const plus = getIcon('Plus');
      const l = getIcon('L');
      const tokens: ComboToken[] = [];
      if (s1) tokens.push({ type: 'icon', value: 'S1', icon: s1 });
      if (plus) tokens.push({ type: 'icon', value: 'Plus', icon: plus });
      if (l) tokens.push({ type: 'icon', value: 'L', icon: l });
      return tokens.length > 0 ? tokens : [{ type: 'text', value: 'Super 1' }];
    },
  },
  {
    regex: /^Super\s*2/,
    handler: () => {
      const s2 = getIcon('S2');
      const plus = getIcon('Plus');
      const m = getIcon('M');
      const tokens: ComboToken[] = [];
      if (s2) tokens.push({ type: 'icon', value: 'S2', icon: s2 });
      if (plus) tokens.push({ type: 'icon', value: 'Plus', icon: plus });
      if (m) tokens.push({ type: 'icon', value: 'M', icon: m });
      return tokens.length > 0 ? tokens : [{ type: 'text', value: 'Super 2' }];
    },
  },
  // Skip "dash" word (the D icon from >> already conveys this)
  {
    regex: /^dash/i,
    handler: () => [],
  },
  // jc (jump cancel) -- skip entirely, the jump direction icon is enough
  {
    regex: /^jc/,
    handler: () => [],
  },
  // j. prefix (jumping)
  {
    regex: /^j\./,
    handler: () => [{ type: 'text', value: 'j.' }],
  },
  // j prefix before a button (jM, jH, jL, jS1, jS2)
  {
    regex: /^j(?=S[12]|[LMHT])/,
    handler: () => [{ type: 'text', value: 'j.' }],
  },
  // dl. (delay)
  {
    regex: /^dl\./,
    handler: () => [{ type: 'text', value: 'dl.' }],
  },
  // Direction + S1/S2 (e.g., 2S1, 6S2, 4S1)
  {
    regex: /^([24689])S([12])/,
    handler: (m) => {
      const dir = m[1];
      const btn = `S${m[2]}`;
      const tokens: ComboToken[] = [];
      if (dir !== '5') {
        const dirIcon = getIcon(dir);
        if (dirIcon) tokens.push({ type: 'icon', value: dir, icon: dirIcon });
      }
      const btnIcon = getIcon(btn);
      if (btnIcon) tokens.push({ type: 'icon', value: btn, icon: btnIcon });
      return tokens.length > 0 ? tokens : [{ type: 'text', value: m[0] }];
    },
  },
  // Direction + button (e.g., 2H, 5M, 6L, 4H)
  {
    regex: /^([245689])([LMHT])/,
    handler: (m) => {
      const dir = m[1];
      const btn = m[2];
      const tokens: ComboToken[] = [];
      if (dir !== '5') {
        const dirIcon = getIcon(dir);
        if (dirIcon) tokens.push({ type: 'icon', value: dir, icon: dirIcon });
      }
      const btnIcon = getIcon(btn);
      if (btnIcon) tokens.push({ type: 'icon', value: btn, icon: btnIcon });
      return tokens.length > 0 ? tokens : [{ type: 'text', value: m[0] }];
    },
  },
  // Standalone S1/S2 (must be before single-char buttons)
  {
    regex: /^S([12])/,
    handler: (m) => {
      const key = `S${m[1]}`;
      const icon = getIcon(key);
      return icon ? [{ type: 'icon', value: key, icon }] : [{ type: 'text', value: key }];
    },
  },
  // Standalone buttons: L, M, H, T
  {
    regex: /^([LMHT])(?![a-z])/,
    handler: (m) => {
      const icon = getIcon(m[1]);
      return icon ? [{ type: 'icon', value: m[1], icon }] : [{ type: 'text', value: m[1] }];
    },
  },
  // Standalone single directions
  {
    regex: /^([2456789])(?![0-9LMHST])/,
    handler: (m) => {
      if (m[1] === '5') return []; // hide neutral
      const icon = getIcon(m[1]);
      return icon ? [{ type: 'icon', value: m[1], icon }] : [{ type: 'text', value: m[1] }];
    },
  },
  // Plus sign for button combinations like (M+H)
  {
    regex: /^\+/,
    handler: () => {
      const icon = getIcon('Plus');
      return icon ? [{ type: 'icon', value: 'Plus', icon }] : [{ type: 'text', value: '+' }];
    },
  },
  // > separator
  {
    regex: /^>/,
    handler: () => [{ type: 'text', value: ' > ' }],
  },
  // ~ cancel
  {
    regex: /^~/,
    handler: () => [{ type: 'text', value: '~' }],
  },
  // / option separator (L/M/H means "any of these")
  {
    regex: /^\//,
    handler: () => [{ type: 'text', value: '/' }],
  },
  // Parentheses (for throw notation etc.)
  {
    regex: /^[()]/,
    handler: (m) => [{ type: 'text', value: m[0] }],
  },
];

const JUMP_DIRECTIONS = new Set(['7', '8', '9']);

/**
 * Merge jump direction + first aerial move:
 * [9] [' > '] ['j.'] [M] → [9] [M]
 * Subsequent j. moves are left as-is.
 */
function mergeJumpDirection(tokens: ComboToken[]): ComboToken[] {
  const result: ComboToken[] = [];
  let i = 0;
  while (i < tokens.length) {
    const tok = tokens[i];
    // Look for a jump direction icon followed by ' > ' separator followed by 'j.' text
    if (
      tok.type === 'icon' &&
      JUMP_DIRECTIONS.has(tok.value) &&
      tokens[i + 1]?.type === 'text' &&
      tokens[i + 1]?.value === ' > ' &&
      tokens[i + 2]?.type === 'text' &&
      tokens[i + 2]?.value === 'j.' &&
      tokens[i + 3]?.type === 'icon'
    ) {
      // Keep direction icon, skip the separator and j. prefix, keep button icon
      result.push(tok);           // [9]
      result.push(tokens[i + 3]); // [button] -- no separator, no j.
      i += 4;
    } else {
      result.push(tok);
      i++;
    }
  }
  return result;
}

export function parseCombo(notation: string): ComboToken[] {
  const tokens: ComboToken[] = [];
  let remaining = notation.trim();

  while (remaining.length > 0) {
    // Skip whitespace
    const wsMatch = remaining.match(/^\s+/);
    if (wsMatch) {
      remaining = remaining.slice(wsMatch[0].length);
      continue;
    }

    let matched = false;
    for (const { regex, handler } of TOKEN_PATTERNS) {
      const m = remaining.match(regex);
      if (m) {
        tokens.push(...handler(m));
        remaining = remaining.slice(m[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Consume one character as text
      tokens.push({ type: 'text', value: remaining[0] });
      remaining = remaining.slice(1);
    }
  }

  return mergeJumpDirection(tokens);
}

/** Check if a backtick string looks like combo notation */
export function isComboNotation(text: string): boolean {
  // Must contain at least one FG notation pattern
  return /[2456789]?[LMHST][12]?|jc|j\.|Super|>|~/.test(text) && text.length > 2;
}
