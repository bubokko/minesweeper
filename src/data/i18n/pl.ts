import type { LeaderboardGroupId } from "@/hooks/useLeaderboard";
import type { Translations } from "./en";

const translations: Translations = {
    "buttons.cancel": "Anuluj",
    "buttons.ok": "OK",
    "custom.height": "Wysokość",
    "custom.mines": "Miny",
    "custom.title": "Pole niestandardowe",
    "custom.width": "Szerokość",
    "debug": "debug",
    "game.title": "Saper",
    "gameMode.beginner": "Początkujący",
    "gameMode.custom": "Niestandardowy",
    "gameMode.expert": "Ekspert",
    "gameMode.intermediate": "Średniozaawansowany",
    "leaderboard.congratulations": (leaderboardGroup: LeaderboardGroupId) => {
        const leaderboardGroupName = {
            beginner: "początkujących",
            intermediate: "średniozaawansowanych",
            expert: "ekspertów",
        }[leaderboardGroup];

        return `Masz najlepszy czas na poziomie dla ${leaderboardGroupName}. Wpisz swoje imię.`;
    },
    "leaderboard.defaultPlayer": "Anonim",
    "leaderboard.reset": "Resetuj wyniki",
    "leaderboard.title": "Najszybsi saperzy",
    "menu.game.color": "Kolor",
    "menu.game.exit": "Zakończ",
    "menu.game.marks": "Znaczniki (?)",
    "menu.game.new": "Nowa",
    "menu.game.sound": "Dźwięk",
    "menu.game": "Gra",
    "menu.help.about": "Saper — informacje...",
    "menu.help.commands": "Używanie Pomocy",
    "menu.help.howToPlay": "Wyszukaj Pomoc na temat...",
    "menu.help.index": "Spis treści",
    "menu.help": "Pomoc",
    "menu.leaderboard": "Najlepsze wyniki...",
};

export default translations;
