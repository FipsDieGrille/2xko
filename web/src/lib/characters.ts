export interface WebCharacter {
  id: string;
  name: string;
  imagePath: string | null;
  comingSoon?: boolean;
}

export const characters: WebCharacter[] = [
  { id: 'ahri', name: 'Ahri', imagePath: '/characters/ahri.webp' },
  { id: 'akali', name: 'Akali', imagePath: '/characters/akali.webp', comingSoon: true },
  { id: 'blitzcrank', name: 'Blitzcrank', imagePath: '/characters/blitzcrank.webp' },
  { id: 'braum', name: 'Braum', imagePath: '/characters/braum.webp' },
  { id: 'caitlyn', name: 'Caitlyn', imagePath: '/characters/caitlyn.webp' },
  { id: 'darius', name: 'Darius', imagePath: '/characters/darius.webp' },
  { id: 'ekko', name: 'Ekko', imagePath: '/characters/ekko.webp' },
  { id: 'illaoi', name: 'Illaoi', imagePath: '/characters/illaoi.webp' },
  { id: 'jinx', name: 'Jinx', imagePath: '/characters/jinx.webp' },
  { id: 'teemo', name: 'Teemo', imagePath: '/characters/teemo.webp' },
  { id: 'vi', name: 'Vi', imagePath: '/characters/vi.webp' },
  { id: 'warwick', name: 'Warwick', imagePath: '/characters/warwick.webp' },
  { id: 'yasuo', name: 'Yasuo', imagePath: '/characters/yasuo.webp' },
];

export function getCharacter(id: string): WebCharacter | undefined {
  return characters.find((c) => c.id === id);
}
