export type PokeApiSpeciesResponse = {
    pokedex_numbers: Array<{
        entry_number: string;
    }>;
}

export type PokeApiNamesData = {
    language: {
        name: string;
        url: string;
    };
    name: string;
};
