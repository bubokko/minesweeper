import type { LeaderboardItem } from "@/types/LeaderboardItem";
import { useCallback, useMemo } from "react";
import useTranslation from "@/hooks/useTranslation";
import { gameModesPresets, type GameModeId } from "@/utils/gameMode";
import type { LeaderboardStorageItem } from "@/types/LeaderboardStorageItem";
import { jsonParseTyped } from "@/utils/json";
import { isInteger } from "@/utils/math";
import useLocalStorage from "@/hooks/useLocalStorage";

const storageKey = "minesweeper:leaderboard";
const defaultTime = 999;
const groupIds = gameModesPresets.map(
    ({ id }) => id
);

export type LeaderboardGroupId = typeof groupIds[number];

export const isLeaderboardGroupId = (value: unknown): value is LeaderboardGroupId => (
    typeof value === "string"
    && (groupIds as string[]).includes(value)
);

const isLeaderboardStorageItem = (value: unknown): value is LeaderboardStorageItem => {
    if (!Array.isArray(value)) {
        return false;
    }

    if (value.length !== 3) {
        return false;
    }

    const items = value as [unknown, unknown, unknown];

    const [groupId, player, time] = items;

    return (
        isLeaderboardGroupId(groupId)

        && (
            typeof player === "string"
            || player === null
        )

        && isInteger(time)
        && time > 0 // Never 0, because first click sets the timer to 1
    );
};

const useLeaderboard = () => {
    const [
        storageValue,
        setStorageValue,
        clearLeaderboard,
    ] = useLocalStorage(storageKey);
    const translate = useTranslation();
    const defaultPlayer = translate("leaderboard.defaultPlayer");

    const storageLeaderboard: LeaderboardStorageItem[] = useMemo(
        (): LeaderboardStorageItem[] => {
            try {
                if (storageValue === null) {
                    throw new Error("Missing leaderboard");
                }

                const storageParsedValue = jsonParseTyped(storageValue);

                if (!Array.isArray(storageParsedValue)) {
                    throw new Error("Invalid leaderboard value");
                }

                return storageParsedValue.filter(isLeaderboardStorageItem);
            } catch {
                return [];
            }
        },
        [storageValue]
    );

    const isBestLeaderboardTime = useCallback(
        (groupId: LeaderboardGroupId, time: number) => {
            if (time < 0) {
                return false;
            }

            const item = storageLeaderboard.find(
                ([itemGroupId]) => itemGroupId === groupId
            );

            if (item === undefined) {
                return true;
            }

            return time < item[2];
        },
        [storageLeaderboard]
    );

    const updateLeaderboard = useCallback(
        (groupId: LeaderboardGroupId, player: string, time: number): boolean => {
            const updatedLeaderboardOverwrites: LeaderboardStorageItem[] = [];
            let isUpdated = false;

            // Looping over groupIds to preserve the order
            for (const itemGroupId of groupIds) {
                let item = storageLeaderboard.find(
                    ([storedGroupId]) => storedGroupId === itemGroupId
                );

                const previousTime = item?.[2] ?? defaultTime;

                if (itemGroupId === groupId && time < previousTime) {
                    const storedPlayer = (player !== defaultPlayer ? player : null);

                    item = [groupId, storedPlayer, time];
                    isUpdated = true;
                }

                if (item !== undefined) {
                    updatedLeaderboardOverwrites.push(item);
                }
            }

            if (updatedLeaderboardOverwrites.length > 0) {
                const json = JSON.stringify(updatedLeaderboardOverwrites);

                setStorageValue(json);
            } else {
                clearLeaderboard();
            }

            return isUpdated;
        },
        [clearLeaderboard, defaultPlayer, setStorageValue, storageLeaderboard]
    );

    const leaderboard = useMemo<LeaderboardItem[]>(
        () => groupIds.map(groupId => {
            const label = translate(`gameMode.${groupId as GameModeId}`);
            let player: string;
            let time: number;

            const item = storageLeaderboard.find(
                ([itemGroupId]) => itemGroupId === groupId
            );

            if (item !== undefined) {
                player = item[1] ?? defaultPlayer;
                time = item[2];
            } else {
                player = defaultPlayer;
                time = defaultTime;
            }

            return { label, player, time };
        }),
        [defaultPlayer, storageLeaderboard, translate]
    );

    return useMemo(
        () => ({
            isBestLeaderboardTime,
            leaderboard,
            updateLeaderboard,
            clearLeaderboard,
        }),
        [clearLeaderboard, isBestLeaderboardTime, leaderboard, updateLeaderboard]
    );
};

export default useLeaderboard;
