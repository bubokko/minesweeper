import type { LeaderboardGroupId } from "@/hooks/useLeaderboard";

export interface BestTimeContext {
    groupId: LeaderboardGroupId;
    time: number;
}
