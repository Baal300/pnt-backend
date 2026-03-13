import germanPokemonNames from '../../data/pkmn_german.json';

export const getNumberFromGermanName = (name: string) => {
    const pokemon = germanPokemonNames.find(
        (pokemon) => pokemon.name.toLowerCase() === name.toLowerCase(),
    );

    console.log(`Searching for Pokémon: ${name}`);
    return pokemon ? pokemon.number : null;
};

export const isNumericId = (value: string): boolean => {
    // Check if the value consists only of digits
    return /^\d+$/.test(value);
};

export const validateLanguageCode = (lang: string): boolean => {
    // Check if the language code is exactly two alphabetic characters
    return /^[a-zA-Z]{2}$/.test(lang);
};