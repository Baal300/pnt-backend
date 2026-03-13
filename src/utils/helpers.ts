export const isNumericId = (value: string): boolean => {
    // Check if the value consists only of digits
    return /^\d+$/.test(value);
};

export const validateLanguageCode = (lang: string): boolean => {
    // Check if the language code is exactly two alphabetic characters
    return /^[a-zA-Z]{2}$/.test(lang);
};