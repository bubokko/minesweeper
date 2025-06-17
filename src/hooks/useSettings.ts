import { softJsonParseTyped } from "@/utils/json";
import { useCallback, useMemo } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";

interface Settings {
    marks: boolean;
    color: boolean;
    sound: boolean;
}

const isObject = (value: unknown): value is Record<PropertyKey, unknown> => (
    typeof value === "object"
    && !Array.isArray(value)
    && value !== null
);

const defaultSettings: Settings = {
    marks: true,
    color: true,
    sound: false,
};

const storageKey = "minesweeper:settings";

const parseStorageValue = (storageValue: string | null): Partial<Settings> => {
    const result: Partial<Settings> = {};

    if (storageValue === null) {
        return result;
    }

    const storageParsedValue = softJsonParseTyped(storageValue);

    if (!isObject(storageParsedValue)) {
        return result;
    }

    if (typeof storageParsedValue.marks === "boolean") {
        result.marks = storageParsedValue.marks;
    }

    if (typeof storageParsedValue.color === "boolean") {
        result.color = storageParsedValue.color;
    }

    if (typeof storageParsedValue.sound === "boolean") {
        result.sound = storageParsedValue.sound;
    }

    return result;
};

const useSettings = () => {
    const [storageValue, setStorageValue] = useLocalStorage(storageKey);

    const setSetting = useCallback(
        <Key extends keyof Settings>(key: Key, value: Settings[Key]) => {
            const newStorageParsedValue = {
                ...parseStorageValue(storageValue),
                [key]: value,
            };

            const json = JSON.stringify(newStorageParsedValue);

            setStorageValue(json);
        },
        [setStorageValue, storageValue]
    );

    const settings = useMemo(
        () => ({
            ...defaultSettings,
            ...parseStorageValue(storageValue),
        }),
        [storageValue]
    );

    return useMemo(
        () => ({ settings, setSetting }),
        [setSetting, settings]
    );
};

export default useSettings;
