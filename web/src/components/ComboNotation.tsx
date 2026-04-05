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

function tokenize(notation: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < notation.length) {
    if (notation[i] === ' ') { i++; continue; }

    if (notation[i] === '[' || notation[i] === '{') {
      const close = notation[i] === '[' ? ']' : '}';
      const end = notation.indexOf(close, i);
      if (end !== -1) {
        tokens.push(notation.slice(i, end + 1));
        i = end + 1;
        continue;
      }
    }

    let matched = false;
    for (let len = 4; len >= 1; len--) {
      const candidate = notation.slice(i, i + len);
      if (TOKEN_MAP[candidate]) {
        tokens.push(candidate);
        i += len;
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push(notation[i]);
      i++;
    }
  }
  return tokens;
}

export function ComboNotation({ notation }: { notation: string }) {
  const tokens = tokenize(notation);

  return (
    <div className="flex flex-wrap items-center gap-0.5 my-2">
      {tokens.map((token, i) => {
        const stripped = token.replace(/[\[\]{}\(\)]/g, '');
        const icon = TOKEN_MAP[stripped];
        const isHold = token.startsWith('[') || token.startsWith('{');

        if (icon) {
          return (
            <span key={i} className={`inline-flex items-center ${isHold ? 'opacity-70 ring-1 ring-white/20 rounded' : ''}`}>
              <Image src={icon} alt={stripped} width={24} height={24} className="inline-block" />
            </span>
          );
        }

        const sep = ['>','~',','].includes(token) || token.startsWith('dl') || token === 'j';
        return (
          <span
            key={i}
            className="text-xs font-mono"
            style={{ color: sep ? '#7777aa' : '#eeeef4' }}
          >
            {token}
          </span>
        );
      })}
    </div>
  );
}
