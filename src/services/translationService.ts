import { getNumberFromGermanName as getPokedexNumberFromGermanName } from '../utils/helpers';
import axios from 'axios';
import { SupportedLanguages, TranslationData } from '../types/translation';
import { PokeApiNamesData, PokeApiSpeciesResponse } from '../types/pokeApi';
import { NamesData } from '../types/pokemonName';

export const getPokedexNumber = async (
    pokedexNumber: string | undefined,
    pokemonName: string,
    sourceLanguage: SupportedLanguages,
): Promise<string | undefined> => {
    if (sourceLanguage == SupportedLanguages.German) {
        console.log(`Fetching data for Pokémon (DE): ${pokemonName}`);

        if (!pokedexNumber) {
            // Get pokedex number from German name
            const extractedPokedexNumber = getPokedexNumberFromGermanName(
                pokemonName as string,
            );
            return extractedPokedexNumber !== null
                ? extractedPokedexNumber.toString()
                : undefined;
        }
    } else if (sourceLanguage == SupportedLanguages.English) {
        try {
            const response = await axios.get<PokeApiSpeciesResponse>(
                `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`,
            );

            // Get the Pokédex number
            return response.data.pokedex_numbers[0].entry_number;
        } catch (error) {
            return undefined;
        }
    }
};

export const fetchTranslationDataByPokedexNumber = async (
    pokedexNumber: string,
    targetLanguage: string,
): Promise<TranslationData> => {
    console.log(`Fetching data for Pokémon ID: ${pokedexNumber}`);

    const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${pokedexNumber.toString()}`,
    );

    const imageResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokedexNumber.toString()}/`,
    );

    const names: PokeApiNamesData[] = response.data.names;
    const translation = names.find((n: NamesData) => n.language.name === targetLanguage);

    if (translation?.name) {
        return {
            translated: translation.name,
            image: imageResponse.data.sprites.front_default,
        };
    } else {
        throw new Error('Translation not found');
    }
};
