import { clampNumber } from "@/utils/math";
import type { GameSettings } from "@/types/GameSettings";

const normalizeValue = (value: number, min: number, max: number) => {
    let normalized = value;

    if (Number.isNaN(normalized)) {
        normalized = 0;
    }

    normalized = Math.trunc(normalized);
    normalized = clampNumber(normalized, min, max);

    return normalized;
};

export const normalizeGameSettings = (gameSettings: GameSettings): GameSettings => {
    const { width, height, bombs } = gameSettings;

    const normalizedWidth = normalizeValue(width, 9, 30);
    const normalizedHeight = normalizeValue(height, 9, 24);

    const maxBombs = (normalizedWidth - 1) * (normalizedHeight - 1);
    const normalizedBombs = normalizeValue(bombs, 10, maxBombs);

    return {
        width: normalizedWidth,
        height: normalizedHeight,
        bombs: normalizedBombs,
    };
};
