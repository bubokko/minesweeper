import type { UnspecifiedGameMode } from "@/types/UnspecifiedGameMode";

const gameModes = [
    {
        id: "beginner",
        settings: {
            width: 9,
            height: 9,
            bombs: 10,
        },
    },
    {
        id: "intermediate",
        settings: {
            width: 16,
            height: 16,
            bombs: 40,
        },
    },
    {
        id: "expert",
        settings: {
            width: 30,
            height: 16,
            bombs: 99,
        },
    },
    {
        id: "custom",
        settings: null,
    },
] as const satisfies UnspecifiedGameMode[];

export default gameModes;
