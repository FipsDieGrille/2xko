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
    icon: require('../../character icons/Ahri_Basic_profile.png'),
  },
  {
    id: 'blitzcrank',
    name: 'Blitzcrank',
    icon: require('../../character icons/Blitzcrank_Basic_profile.png'),
  },
  {
    id: 'braum',
    name: 'Braum',
    icon: require('../../character icons/Braum_Basic_profile.png'),
  },
  {
    id: 'caitlyn',
    name: 'Caitlyn',
    icon: require('../../character icons/Caitlyn_Basic_profile.png'),
  },
  {
    id: 'darius',
    name: 'Darius',
    icon: require('../../character icons/Darius_Basic_profile.png'),
  },
  {
    id: 'ekko',
    name: 'Ekko',
    icon: require('../../character icons/Ekko_Basic_profile.png'),
  },
  {
    id: 'illaoi',
    name: 'Illaoi',
    icon: require('../../character icons/Illaoi_Basic_profile.png'),
  },
  {
    id: 'jinx',
    name: 'Jinx',
    icon: require('../../character icons/Jinx_Basic_profile.png'),
  },
  {
    id: 'teemo',
    name: 'Teemo',
    icon: require('../../character icons/Teemo_Basic_profile.png'),
  },
  {
    id: 'vi',
    name: 'Vi',
    icon: require('../../character icons/Vi_Basic_profile.png'),
  },
  {
    id: 'warwick',
    name: 'Warwick',
    icon: require('../../character icons/Warwick_Basic_profile.png'),
  },
  {
    id: 'yasuo',
    name: 'Yasuo',
    icon: require('../../character icons/Yasuo_Basic_profile.png'),
  },
];

export function getCharacter(id: string): Character | undefined {
  return characters.find((c) => c.id === id);
}
