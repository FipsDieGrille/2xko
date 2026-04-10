'use client';

import Image from 'next/image';

const TOKEN_MAP: Record<string, string> = {
  '2': '/icons/2.png', '4': '/icons/4.png', '6': '/icons/6.png',
  '7': '/icons/7.png', '8': '/icons/8.png', '9': '/icons/9.png',
  '22': '/icons/22.png', '44': '/icons/44.png', '66': '/icons/66.png',
  '77': '/icons/77.png', '88': '/icons/88.png', '99': '/icons/99.png',
  'L': '/icons/L.png', 'M': '/icons/M.png', 'H': '/icons/H.png',
  'S1': '/icons/S1.png', 'S2': '/icons/S2.png', 'T': '/icons/T.png',
  'LL': '/icons/LL.png', 'MM': '/icons/MM.png', 'HH': '/icons/HH.png',
  'S1S1': '/icons/S1S1.png', 'S2S2': '/icons/S2S2.png',
  'D': '/icons/D.png', 'JC': '/icons/JC.png', 'Plus': '/icons/Plus.png',
  '1': '/icons/1.png', '11': '/icons/11.png', '3': '/icons/3.png', '33': '/icons/33.png',
};

const HITS_MAP: Record<string, string> = {
  '(1)': '/icons/1hits.png',
  '(2)': '/icons/2hits.png',
};

interface Token {
  type: 'icon' | 'hits' | 'separator' | 'text';
  value: string;
  icon?: string;
}

function tokenize(notation: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < notation.length) {
    if (notation[i] === ' ') { i++; continue; }

    // Hold notation: [X] or {X} — use hold icon (e.g. [H] → HH.png, [9] → 99.png)
    if (notation[i] === '[' || notation[i] === '{') {
      const close = notation[i] === '[' ? ']' : '}';
      const end = notation.indexOf(close, i);
      if (end !== -1) {
        const inner = notation.slice(i + 1, end);
        const holdKey = inner + inner; // H→HH, S1→S1S1, 9→99, etc.
        const icon = TOKEN_MAP[holdKey] ?? TOKEN_MAP[inner];
        tokens.push({ type: icon ? 'icon' : 'text', value: notation.slice(i, end + 1), icon });
        i = end + 1;
        continue;
      }
    }

    // Hit confirmation: (1) or (2)
    if (notation[i] === '(') {
      const hitMatch = notation.slice(i).match(/^\([12]\)/);
      if (hitMatch) {
        tokens.push({ type: 'hits', value: hitMatch[0], icon: HITS_MAP[hitMatch[0]] });
        i += hitMatch[0].length;
        continue;
      }
    }

    // J prefix (aerial) — must be followed by a token (not standalone J)
    if ((notation[i] === 'J' || notation[i] === 'j') && i + 1 < notation.length) {
      const next = notation[i + 1];
      // J followed by a letter (move) or [ or { or digit (like J2H)
      if (next && next !== ' ' && next !== '>' && next !== '~' && next !== ',' && next !== 'C') {
        tokens.push({ type: 'icon', value: 'air', icon: '/icons/air.png' });
        i += 1;
        continue;
      }
    }

    // Standard token matching (longest first)
    let matched = false;
    for (let len = 4; len >= 1; len--) {
      const candidate = notation.slice(i, i + len);
      if (TOKEN_MAP[candidate]) {
        tokens.push({ type: 'icon', value: candidate, icon: TOKEN_MAP[candidate] });
        i += len;
        matched = true;
        break;
      }
    }
    if (!matched) {
      const ch = notation[i];
      const isSep = ['>','~',','].includes(ch) || notation.slice(i).startsWith('dl');
      tokens.push({ type: isSep ? 'separator' : 'text', value: ch });
      i++;
    }
  }
  return tokens;
}

export function ComboNotation({ notation, compact }: { notation: string; compact?: boolean }) {
  const tokens = tokenize(notation);
  const size = compact ? 16 : 24;

  return (
    <div className={`flex flex-wrap items-center gap-0.5 ${compact ? '' : 'my-2'}`}>
      {tokens.map((token, i) => {
        // Hit confirmation overlay — merge with previous icon
        if (token.type === 'hits' && token.icon && !compact) {
          return (
            <span key={i} className="relative inline-flex items-center" style={{ marginLeft: -10 }}>
              <Image src={token.icon} alt={token.value} width={16} height={16} className="inline-block" style={{ position: 'relative', top: 9 }} />
            </span>
          );
        }

        if (token.type === 'icon' && token.icon) {
          const isAir = token.value === 'air';
          return (
            <span key={i} className="inline-flex items-center" style={isAir ? { marginRight: compact ? -2 : -4 } : undefined}>
              <Image src={token.icon} alt={token.value} width={size} height={size} className="inline-block" />
            </span>
          );
        }

        return (
          <span
            key={i}
            className="text-xs font-mono"
            style={{ color: token.type === 'separator' ? '#7777aa' : '#eeeef4' }}
          >
            {token.value}
          </span>
        );
      })}
    </div>
  );
}
