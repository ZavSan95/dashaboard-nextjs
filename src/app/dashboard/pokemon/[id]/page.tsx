import { Pokemon } from "@/pokemons";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

type Params = { id: string };

interface Props {
  params: Promise<Params>; // 👈 params es Promise
}

const getPokemon = async (id: string): Promise<Pokemon> => {

    try {
        const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
            next: { revalidate: 60 * 60 * 24 }, // 24h (ajustá a gusto)
        }).then((resp) => resp.json());

        return pokemon;
    } catch (error) {
        notFound();
    }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const { id } = await params;       
        const { name } = await getPokemon(id);
        return {
            title: `Pokémon #${id}`,
            description: `Detalles del Pokémon ${name}`,
        };
    } catch (error) {
        return{
            title: 'Página del pokemon',
            description: 'Descripción del pokemon'
        }
    }
}

export default async function PokemonPage({ params }: Props) {
  const { id } = await params;       
  const pokemon = await getPokemon(id);

  const mainImg =
    pokemon.sprites.other?.dream_world.front_default ??
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    pokemon.sprites.front_default ?? "";

  return (
    <div className="flex mt-5 flex-col items-center text-slate-800">
      <div className="relative flex flex-col items-center rounded-[20px] w-[700px] mx-auto bg-white bg-clip-border shadow-lg p-3">
        <div className="mt-2 mb-8 w-full">
          <h1 className="px-2 text-xl font-bold text-slate-700 capitalize">
            #{pokemon.id} {pokemon.name}
          </h1>

          <div className="flex flex-col justify-center items-center">
            {mainImg && (
              <Image
                src={mainImg}
                width={150}
                height={150}
                alt={`Imagen del pokemon ${pokemon.name}`}
                className="mb-5"
              />
            )}

            <div className="flex flex-wrap">
              {pokemon.moves.map((m) => (
                <p key={m.move.name} className="mr-2 capitalize">
                  {m.move.name}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 px-2 w-full">
          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 drop-shadow-lg ">
            <p className="text-sm text-gray-600">Types</p>
            <div className="text-base font-medium text-navy-700 flex">
              {pokemon.types.map((t) => (
                <p key={t.slot} className="mr-2 capitalize">
                  {t.type.name}
                </p>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 drop-shadow-lg ">
            <p className="text-sm text-gray-600">Peso</p>
            <span className="text-base font-medium text-navy-700 flex">
              {pokemon.weight}
            </span>
          </div>

          <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 drop-shadow-lg">
            <p className="text-sm text-gray-600">Regular Sprites</p>
            <div className="flex justify-center">
              {pokemon.sprites.front_default && (
                <Image
                  src={pokemon.sprites.front_default}
                  width={100}
                  height={100}
                  alt={`sprite ${pokemon.name}`}
                />
              )}
              {pokemon.sprites.back_default && (
                <Image
                  src={pokemon.sprites.back_default}
                  width={100}
                  height={100}
                  alt={`sprite ${pokemon.name}`}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 drop-shadow-lg">
            <p className="text-sm text-gray-600">Shiny Sprites</p>
            <div className="flex justify-center">
              {pokemon.sprites.front_shiny && (
                <Image
                  src={pokemon.sprites.front_shiny}
                  width={100}
                  height={100}
                  alt={`sprite ${pokemon.name}`}
                />
              )}
              {pokemon.sprites.back_shiny && (
                <Image
                  src={pokemon.sprites.back_shiny}
                  width={100}
                  height={100}
                  alt={`sprite ${pokemon.name}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
