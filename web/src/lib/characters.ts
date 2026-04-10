export interface WebCharacter {
  id: string;
  name: string;
  imagePath: string | null;
  comingSoon?: boolean;
}

export const characters: WebCharacter[] = [
  { id: 'ahri', name: 'Ahri', imagePath: '/characters/Ahri_Basic.png' },
  { id: 'akali', name: 'Akali', imagePath: '/characters/Akali_Basic.png' },
  { id: 'blitzcrank', name: 'Blitzcrank', imagePath: '/characters/Blitzcrank_Basic.png' },
  { id: 'braum', name: 'Braum', imagePath: '/characters/Braum_Basic.png' },
  { id: 'caitlyn', name: 'Caitlyn', imagePath: '/characters/Caitlyn_Basic.png' },
  { id: 'darius', name: 'Darius', imagePath: '/characters/Darius_Basic.png' },
  { id: 'ekko', name: 'Ekko', imagePath: '/characters/Ekko_Basic.png' },
  { id: 'illaoi', name: 'Illaoi', imagePath: '/characters/Illaoi_Basic.png' },
  { id: 'jinx', name: 'Jinx', imagePath: '/characters/Jinx_Basic.png' },
  { id: 'teemo', name: 'Teemo', imagePath: '/characters/Teemo_Basic.png' },
  { id: 'vi', name: 'Vi', imagePath: '/characters/Vi_Basic.png' },
  { id: 'warwick', name: 'Warwick', imagePath: '/characters/Warwick_Basic.png' },
  { id: 'yasuo', name: 'Yasuo', imagePath: '/characters/Yasuo_Basic.png' },
];

export function getCharacter(id: string): WebCharacter | undefined {
  return characters.find((c) => c.id === id);
}
