import germanPokemonNames from '../../data/pkmn_german.json';

export const getNumberFromGermanName = (name: string) => {
    const pokemon = germanPokemonNames.find(
        (pokemon) => pokemon.name.toLowerCase() === name.toLowerCase()
    );

    console.log(`Searching for Pokémon: ${name}`);
    return pokemon ? pokemon.number : null;
};
