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
    <main className="min-h-screen" style={{ backgroundColor: '#0f0f1a' }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-sm font-semibold hover:underline" style={{ color: '#6c5ce7' }}>
            ‹ Back
          </Link>
          {character.imagePath && (
            <Image
              src={character.imagePath}
              alt={character.name}
              width={48}
              height={48}
              className="rounded-lg object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#e0e0f0' }}>{character.name}</h1>
            <p className="text-xs" style={{ color: '#8888aa' }}>{combos.length} combo{combos.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <ComboListClient combos={combos} />
      </div>
    </main>
  );
}
