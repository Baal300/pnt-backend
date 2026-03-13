import { Request, Response } from 'express';
import {
    getPokedexNumber,
    fetchTranslationDataByPokedexNumber,
} from '../services/translationService';
import { TranslationDTO, SupportedLanguages } from '../types/translation';
import { isNumericId } from '../utils/helpers';

export const getTranslation = async (req: Request, res: Response) => {
    console.log('Received request for translation');
    // Request by Pokédex number
    let pokedexNumber: string | undefined = isNumericId(req.params.id)
        ? req.params.id
        : undefined;
    // Request by Pokémon name
    const pokemonName = !pokedexNumber ? req.params.id : undefined;
    const { sourceLanguage, targetLanguage } = req.query;

    if (
        !Object.values(SupportedLanguages).includes(
            sourceLanguage as SupportedLanguages,
        ) &&
        !Object.values(SupportedLanguages).includes(
            targetLanguage as SupportedLanguages,
        )
    ) {
        return res
            .status(400)
            .json({ error: 'Bad request: Invalid language code' });
    }

    // If only Pokémon name is provided, get the Pokédex number first
    if (pokemonName) {
        pokedexNumber = await getPokedexNumber(
            pokedexNumber,
            pokemonName,
            sourceLanguage as SupportedLanguages,
        );

        if (!pokedexNumber) {
            return res.status(404).json({
                error: `Pokémon with name "${pokemonName}" (${sourceLanguage}) not found`,
            });
        }
    }

    // Use Pokédex number to fetch translation data
    try {
        const translationData = await fetchTranslationDataByPokedexNumber(
            pokedexNumber as string,
            targetLanguage as string,
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
