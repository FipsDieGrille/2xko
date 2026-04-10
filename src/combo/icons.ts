import { ImageSourcePropType } from 'react-native';

const iconMap: Record<string, ImageSourcePropType> = {
  // Directions
  '2': require('../../icons/2.png'),
  '4': require('../../icons/4.png'),
  '6': require('../../icons/6.png'),
  '7': require('../../icons/7.png'),
  '8': require('../../icons/8.png'),
  '9': require('../../icons/9.png'),
  // Hold / double-tap directions
  '22': require('../../icons/22.png'),
  '44': require('../../icons/44.png'),
  '66': require('../../icons/66.png'),
  '77': require('../../icons/77.png'),
  '88': require('../../icons/88.png'),
  '99': require('../../icons/99.png'),
  // Buttons
  'L': require('../../icons/L.png'),
  'M': require('../../icons/M.png'),
  'H': require('../../icons/H.png'),
  'S1': require('../../icons/S1.png'),
  'S2': require('../../icons/S2.png'),
  'T': require('../../icons/T.png'),
  // Hold buttons
  'LL': require('../../icons/LL.png'),
  'MM': require('../../icons/MM.png'),
  'HH': require('../../icons/HH.png'),
  'S1S1': require('../../icons/S1S1.png'),
  'S2S2': require('../../icons/S2S2.png'),
  // Other
  'D': require('../../icons/D.png'),
  'JC': require('../../icons/JC.png'),
  'Plus': require('../../icons/Plus.png'),
  'air': require('../../icons/air.png'),
  '1hits': require('../../icons/1hits.png'),
  '2hits': require('../../icons/2hits.png'),
  // Super meter bars
  '1-0': require('../../icons/1-0.png'),
  '1-1': require('../../icons/1-1.png'),
  '1-2': require('../../icons/1-2.png'),
  '1-3': require('../../icons/1-3.png'),
  '2-0': require('../../icons/2-0.png'),
  '2-1': require('../../icons/2-1.png'),
  '2-2': require('../../icons/2-2.png'),
  '2-3': require('../../icons/2-3.png'),
  '3-0': require('../../icons/3-0.png'),
  '3-1': require('../../icons/3-1.png'),
  '3-2': require('../../icons/3-2.png'),
  '3-3': require('../../icons/3-3.png'),
  // Number icons (for super levels)
  '1': require('../../icons/1.png'),
  '11': require('../../icons/11.png'),
  '3': require('../../icons/3.png'),
  '33': require('../../icons/33.png'),
};

export function getIcon(token: string): ImageSourcePropType | null {
  return iconMap[token] ?? null;
}
