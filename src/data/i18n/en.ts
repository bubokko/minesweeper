import type { LeaderboardGroupId } from "@/hooks/useLeaderboard";

const translations = {
    "buttons.cancel": "Cancel",
    "buttons.ok": "OK",
    "custom.height": "Height",
    "custom.mines": "Mines",
    "custom.title": "Custom Field",
    "custom.width": "Width",
    "debug": "debug",
    "game.title": "Minesweeper",
    "gameMode.beginner": "Beginner",
    "gameMode.custom": "Custom",
    "gameMode.expert": "Expert",
    "gameMode.intermediate": "Intermediate",
    "leaderboard.congratulations": (leaderboardGroup: LeaderboardGroupId) => (
        `You have the fastest time for ${leaderboardGroup} level. Please enter your name.`
    ),
    "leaderboard.defaultPlayer": "Anonymous",
    "leaderboard.reset": "Reset Scores",
    "leaderboard.title": "Fastest Mine Sweepers",
    "menu.game.color": "Color",
    "menu.game.exit": "Exit",
    "menu.game.marks": "Marks (?)",
    "menu.game.new": "New",
    "menu.game.sound": "Sound",
    "menu.game": "Game",
    "menu.help.about": "About Minesweeper...",
    "menu.help.commands": "Commands",
    "menu.help.howToPlay": "How to Play...",
    "menu.help.index": "Index",
    "menu.help": "Help",
    "menu.leaderboard": "Best Times...",
};

export default translations;

export type Translations = typeof translations;

export type TranslationKey = keyof Translations;
