import { useCallback, useMemo } from "react";
import gameModes from "@/data/gameModes";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { GameSettings } from "@/types/GameSettings";
import { normalizeGameSettings } from "@/utils/gameSettings";

export type GameMode = typeof gameModes[number];

export type GameModeId = GameMode["id"];

export const gameModesIds: GameModeId[] = gameModes.map(
    ({ id }) => id
);

export const isGameModeId = (value: string): value is GameModeId => {
    return (gameModesIds as string[]).includes(value);
};

export const gameModesPresets = gameModes.filter(
    gameMode => gameMode.settings !== null
);

export type GameModePreset = typeof gameModesPresets[number];

export type GameModePresetId = GameModePreset["id"];

export const gameModesPresetsIds: GameModePresetId[] = gameModesPresets.map(
    ({ id }) => id
);

export const isGameModePresetId = (value: string): value is GameModePresetId => {
    return (gameModesPresetsIds as string[]).includes(value);
};

export const defaultGameModePresetId: GameModePresetId = "beginner";

export const defaultGameModePresetHelper = gameModesPresets.find(
    ({ id }) => id === defaultGameModePresetId
);

if (defaultGameModePresetHelper === undefined) {
    // Will never happen, but TypeScript is unable to deduct it from .find()
    throw new Error("Missing default game mode");
}

export const defaultGameModePreset = defaultGameModePresetHelper;

export const gameModesCustom = gameModes.filter(
    gameMode => gameMode.settings === null
);

export type GameModeCustom = typeof gameModesCustom[number];

export type GameModeCustomId = GameModeCustom["id"];

export const gameModesCustomIds: GameModeCustomId[] = gameModesCustom.map(
    ({ id }) => id
);

export const isGameModeCustomId = (value: string): value is GameModeCustomId => {
    return (gameModesCustomIds as string[]).includes(value);
};

const storageKey = "minesweeper:mode";

export type StorageGameModeWithSettings = [GameMode, GameSettings];

export const parseStorageGameMode = (
    storageValue: string | null
): StorageGameModeWithSettings | null => {
    if (storageValue === null) {
        return null;
    }

    if (isGameModePresetId(storageValue)) {
        const gameModePreset = gameModesPresets.find(
            ({ id }) => id === storageValue
        );

        if (gameModePreset === undefined) {
            return null;
        }

        return [gameModePreset, gameModePreset.settings];
    }

    // Pattern: gameModeId:width,height,bombs
    const pattern = /^(.+):([1-9]\d*|0),([1-9]\d*|0),([1-9]\d*|0)$/;
    const match = storageValue.match(pattern);

    if (match === null) {
        return null;
    }

    const [, gameModeId, widthString, heightString, bombsString] = match;

    if (
        gameModeId === undefined
        || !isGameModeCustomId(gameModeId)
        || widthString === undefined
        || heightString === undefined
        || bombsString === undefined
    ) {
        return null;
    }

    const gameModeCustom = gameModesCustom.find(
        // Disabling ESLint check to prevent error when only one custom mode is available
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        ({ id }) => id === gameModeId
    );

    if (gameModeCustom === undefined) {
        return null;
    }

    const gameSettings: GameSettings = {
        width: Number(widthString),
        height: Number(heightString),
        bombs: Number(bombsString),
    };

    const normalizedGameSettings = normalizeGameSettings(gameSettings);

    return [gameModeCustom, normalizedGameSettings];
};

export const useRememberGameMode = () => {
    const [storageValue, setStorageValue] = useLocalStorage(storageKey);

    const rememberGameModePreset = useCallback(
        (gameModePreset: GameModePreset) => {
            setStorageValue(gameModePreset.id);
        },
        [setStorageValue]
    );

    const rememberGameModeCustom = useCallback(
        (gameModeCustom: GameModeCustom, gameSettings: GameSettings) => {
            const gameSettingsTuple = [
                gameSettings.width,
                gameSettings.height,
                gameSettings.bombs,
            ];

            const newStorageValue = `${gameModeCustom.id}:${gameSettingsTuple.join(",")}`;

            setStorageValue(newStorageValue);
        },
        [setStorageValue]
    );

    const rememberedGameModeWithSettings: StorageGameModeWithSettings | null = useMemo(
        () => parseStorageGameMode(storageValue),
        [storageValue]
    );

    return useMemo(
        () => ({
            rememberedGameModeWithSettings,
            rememberGameModePreset,
            rememberGameModeCustom,
        }),
        [
            rememberGameModeCustom,
            rememberGameModePreset,
            rememberedGameModeWithSettings,
        ]
    );
};
