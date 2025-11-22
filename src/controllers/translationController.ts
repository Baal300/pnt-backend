import { Request, Response } from 'express';
import axios from 'axios';
import { getNumberFromGermanName as getPokedexNumberFromGermanName } from '../utils/helpers';
import { NamesData } from '../types/pokemonName';
import { PokeApiNamesData } from '../types/pokeApi';

const isNumericId = (value: string): boolean => {
    // Check if the value consists only of digits
    return /^\d+$/.test(value);
};

const validateLanguageCode = (lang: string): boolean => {
    // Check if the language code is exactly two alphabetic characters
    return /^[a-zA-Z]{2}$/.test(lang);
};

type TranslationData = {
    translated: string;
    image: string;
};

type TranslationDTO = {
    number: number;
} & TranslationData;

const fetchTranslationDataByPokedexNumber = async (
    pokedexNumber: string,
    lang: string
): Promise<TranslationData> => {
    const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${pokedexNumber.toString()}`
    );

    const imageResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokedexNumber.toString()}/`
    );

    const names: PokeApiNamesData[] = response.data.names;
    const translation = names.find((n: NamesData) => n.language.name === lang);

    if (translation?.name) {
        return {
            translated: translation.name,
            image: imageResponse.data.sprites.front_default,
        };
    } else {
        throw new Error('Translation not found');
    }
};

export const getTranslation = async (req: Request, res: Response) => {
    console.log('Received request for translation');
    // Either numeric ID or name is provided in the path parameter
    let pokedexNumber: string | undefined = isNumericId(req.params.id)
        ? req.params.id
        : undefined;
    const pokemonName = !pokedexNumber ? req.params.id : undefined;

    // Translation defaults to English if not specified
    const { lang = 'en' } = req.query;

    if (!validateLanguageCode(lang as string)) {
        return res
            .status(400)
            .json({ error: 'Bad request: Invalid language code' });
    }

    if (lang === 'en') {
        if (pokemonName) {
            // Translate from German to English
            console.log(`Fetching data for Pokémon (DE): ${pokemonName}`);

            if (!pokedexNumber) {
                // Get numeric ID from German name
                const extractedPokedexNumber = getPokedexNumberFromGermanName(
                    pokemonName as string
                );
                pokedexNumber =
                    extractedPokedexNumber !== null
                        ? extractedPokedexNumber.toString()
                        : undefined;
            }

            if (!pokedexNumber) {
                return res
                    .status(404)
                    .json({ error: 'Pokémon (DE) translation not found' });
            }
        }
    } else if (lang === 'de' && pokemonName) {
        // Translate from English to German using name
        try {
            const response = await axios.get(
                `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`
            );

            // Get the Pokédex number
            pokedexNumber = response.data.pokedex_numbers[0].entry_number;
        } catch (error) {
            return res.status(404).json({
                error: `Pokémon with name "${pokemonName}" not found`,
            });
        }
    }

    // Use pokedexNumber to fetch translation data
    try {
        console.log(`Fetching data for Pokémon ID: ${pokedexNumber}`);

        const translationData = await fetchTranslationDataByPokedexNumber(
            pokedexNumber as string,
            lang as string
        );

        const translationDTO: TranslationDTO = {
            number: parseInt(pokedexNumber as string),
            ...translationData,
        };

        return res.json(translationDTO);
    } catch (error) {
        return res.status(404).json({
            error: error instanceof Error ? error.message : `Error: ${error}`,
        });
    }
};
