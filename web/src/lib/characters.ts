export interface WebCharacter {
  id: string;
  name: string;
  imagePath: string | null;
  comingSoon?: boolean;
}

export const characters: WebCharacter[] = [
  { id: 'ahri', name: 'Ahri', imagePath: '/characters/Ahri_cs.png' },
  { id: 'akali', name: 'Akali', imagePath: '/characters/akali.webp', comingSoon: true },
  { id: 'blitzcrank', name: 'Blitzcrank', imagePath: '/characters/Blitzcrank_cs.png' },
  { id: 'braum', name: 'Braum', imagePath: '/characters/Braum_cs.png' },
  { id: 'caitlyn', name: 'Caitlyn', imagePath: '/characters/Caitlyn_cs.png' },
  { id: 'darius', name: 'Darius', imagePath: '/characters/Darius_cs.png' },
  { id: 'ekko', name: 'Ekko', imagePath: '/characters/Ekko_cs.png' },
  { id: 'illaoi', name: 'Illaoi', imagePath: '/characters/Illaoi_cs.png' },
  { id: 'jinx', name: 'Jinx', imagePath: '/characters/Jinx_cs.png' },
  { id: 'teemo', name: 'Teemo', imagePath: '/characters/Teemo_cs.png' },
  { id: 'vi', name: 'Vi', imagePath: '/characters/Vi_cs.png' },
  { id: 'warwick', name: 'Warwick', imagePath: '/characters/Warwick_cs.png' },
  { id: 'yasuo', name: 'Yasuo', imagePath: '/characters/Yasuo_cs.png' },
];

export function getCharacter(id: string): WebCharacter | undefined {
  return characters.find((c) => c.id === id);
}
