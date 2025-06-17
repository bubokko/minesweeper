import { useCallback, useEffect, useMemo, useState } from "react";
import en, { type TranslationKey, type Translations } from "@/data/i18n/en";
import pl from "@/data/i18n/pl";

const translations = {
    en,
    pl,
} satisfies Record<string, Translations>;

type Language = keyof typeof translations;

const defaultLanguage: Language = "en";

const languagesWithTranslations = Object.keys(translations) as Language[]; // Safe cast

const isLanguageWithTranslation = (value: string): value is Language => (
    (languagesWithTranslations as string[]).includes(value)
);

const useTranslation = () => {
    const [browserLanguages, setBrowserLanguages] = useState(() => navigator.languages);

    useEffect(
        () => {
            const eventName = "languagechange" satisfies keyof WindowEventMap;

            const handle = () => {
                setBrowserLanguages(navigator.languages);
            };

            window.addEventListener(eventName, handle);

            return () => {
                window.removeEventListener(eventName, handle);
            };
        },
        []
    );

    const activeLanguage: Language = useMemo(
        () => {
            for (const browserLanguage of browserLanguages) {
                const browserLanguageCode = browserLanguage
                    .toLowerCase()
                    .replace(/-.*/, "");

                if (isLanguageWithTranslation(browserLanguageCode)) {
                    return browserLanguageCode;
                }
            }

            return defaultLanguage;
        },
        [browserLanguages]
    );

    useEffect(
        () => {
            document.documentElement.lang = activeLanguage;
        },
        [activeLanguage]
    );

    const translate = useCallback(
        <Key extends TranslationKey>(
            key: Key,
            language: Language = activeLanguage,
        ): Translations[Key] => {
            const languageTranslations: Translations = translations[language];
            const translatedText = languageTranslations[key];

            return translatedText;
        },
        [activeLanguage]
    );

    return translate;
};

export default useTranslation;
