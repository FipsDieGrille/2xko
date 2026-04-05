import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCharacter, characters } from '@/lib/characters';
import { getCombos } from '../../../../src/combos';
import { ComboListClient } from './ComboListClient';

export function generateStaticParams() {
  return characters.map((c) => ({ characterId: c.id }));
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const { characterId } = await params;
  const character = getCharacter(characterId);
  if (!character) notFound();

  const combos = getCombos(characterId);

  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: '#7777aa' }}>
          <Link href="/roster" className="hover:text-white transition-colors">Roster</Link>
          <span>/</span>
          <span style={{ color: '#eeeef4' }}>{character.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {character.imagePath && (
            <Image
              src={character.imagePath}
              alt={character.name}
              width={64}
              height={64}
              className="rounded-lg object-cover"
              style={{ border: '2px solid #222244' }}
            />
          )}
          <div>
            <h1 className="font-heading text-2xl font-bold" style={{ color: '#eeeef4' }}>{character.name}</h1>
            <p className="text-sm" style={{ color: '#7777aa' }}>
              {combos.length} combo{combos.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <ComboListClient combos={combos} />
      </div>
    </main>
  );
}
