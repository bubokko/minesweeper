import type { LeaderboardGroupId } from "@/hooks/useLeaderboard";

export type LeaderboardStorageItem = [
    groupId: LeaderboardGroupId,
    player: string | null,
    time: number,
];
