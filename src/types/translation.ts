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
    Japanese = 'ja-hrkt',
    JapaneseRomaji = 'ja-roma',
}

export type LocalizationData = {
    name: string;
    number: number;
}[];