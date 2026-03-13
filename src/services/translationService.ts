import axios, { AxiosError } from 'axios';
import {
    LocalizationData,
    SupportedLanguages,
    TranslationData,
} from '../types/translation';
import { PokeApiNamesData, PokeApiSpeciesResponse } from '../types/pokeApi';
import { NamesData } from '../types/pokemonName';

export const getPokedexNumber = async (
    pokedexNumber: string | undefined,
    pokemonName: string,
    sourceLanguage: SupportedLanguages,
): Promise<string | undefined> => {
    if (sourceLanguage !== SupportedLanguages.English) {
        console.log(
            `Fetching data for Pokémon (${sourceLanguage}): ${pokemonName}`,
        );

        if (!pokedexNumber) {
            // Get pokedex number from German name
            const extractedPokedexNumber = await getPokedexNumberFromName(
                pokemonName,
                sourceLanguage,
            );
            return extractedPokedexNumber !== null
                ? extractedPokedexNumber.toString()
                : undefined;
        }
    } else {
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
    try {
        console.log(`Fetching data for Pokémon ID: ${pokedexNumber}`);
        const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon-species/${pokedexNumber.toString()}`,
        );

        const imageResponse = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${pokedexNumber.toString()}/`,
        );

        const names: PokeApiNamesData[] = response.data.names;
        const translation = names.find(
            (n: NamesData) => n.language.name === targetLanguage,
        );

        if (translation?.name) {
            return {
                translated: translation.name,
                image: imageResponse.data.sprites.front_default,
            };
        } else {
            throw new Error('Translation not found');
        }
    } catch (error: unknown) {
        throw new Error(`Error fetching translation data: ${error}`);
    }
};

const getLocalizationData = async (
    language: string,
): Promise<LocalizationData> => {
    try {
        const localizationData = await import(
            `../../data/pkmn_${language}.json`
        );
        return localizationData.default;
    } catch (error) {
        throw new Error(`File "pkmn_${language}.json" not found`);
    }
};

const getPokedexNumberFromName = async (name: string, language: string): Promise<number | null> => {
    console.log(`Searching for Pokémon: ${name}`);

    const localizationData = await getLocalizationData(language);
    const localization = localizationData.find(
        (pokemon) => pokemon.name.toLowerCase() === name.toLowerCase(),
    );
    console.log(
        `Found Pokémon: ${localization ? localization.number : 'Not found'}`,
    );

    return localization ? localization.number : null;
};
