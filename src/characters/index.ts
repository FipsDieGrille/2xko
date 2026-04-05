import { ImageSourcePropType } from 'react-native';

export interface Character {
  id: string;
  name: string;
  icon: ImageSourcePropType | null;
  comingSoon?: boolean;
}

export const characters: Character[] = [
  {
    id: 'ahri',
    name: 'Ahri',
    icon: require('../../character icons/ahri.webp'),
  },
  {
    id: 'akali',
    name: 'Akali',
    icon: require('../../character icons/Akali.webp'),
    comingSoon: true,
  },
  {
    id: 'blitzcrank',
    name: 'Blitzcrank',
    icon: require('../../character icons/blitzcrank.webp'),
  },
  {
    id: 'braum',
    name: 'Braum',
    icon: require('../../character icons/braum.webp'),
  },
  {
    id: 'caitlyn',
    name: 'Caitlyn',
    icon: require('../../character icons/caitlyn.webp'),
  },
  {
    id: 'darius',
    name: 'Darius',
    icon: require('../../character icons/darius.webp'),
  },
  {
    id: 'ekko',
    name: 'Ekko',
    icon: require('../../character icons/ekko.webp'),
  },
  {
    id: 'illaoi',
    name: 'Illaoi',
    icon: require('../../character icons/illaoi.webp'),
  },
  {
    id: 'jinx',
    name: 'Jinx',
    icon: require('../../character icons/jinx.webp'),
  },
  {
    id: 'teemo',
    name: 'Teemo',
    icon: require('../../character icons/teemo.webp'),
  },
  {
    id: 'vi',
    name: 'Vi',
    icon: require('../../character icons/vi.webp'),
  },
  {
    id: 'warwick',
    name: 'Warwick',
    icon: require('../../character icons/warwick.webp'),
  },
  {
    id: 'yasuo',
    name: 'Yasuo',
    icon: require('../../character icons/yasuo.webp'),
  },
];

export function getCharacter(id: string): Character | undefined {
  return characters.find((c) => c.id === id);
}
