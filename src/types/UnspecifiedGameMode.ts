import type { GameSettings } from "@/types/GameSettings";

export interface UnspecifiedGameMode {
    id: string;
    settings: GameSettings | null;
}
