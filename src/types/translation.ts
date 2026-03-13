export type TranslationData = {
    translated: string;
    image: string;
};

export type TranslationDTO = {
    number: number;
} & TranslationData;

export enum SupportedLanguages {
    English = 'en',
    German = 'de',
    French = 'fr',
    Japanese = 'jp',
}
