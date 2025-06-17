import gameModes from "@/data/gameModes";
import useTranslation from "@/hooks/useTranslation";
import type { MenuGroup } from "@/types/MenuGroup";
import type { MenuOption } from "@/types/MenuOption";
import type { GameMode } from "@/utils/gameMode";
import { useMemo } from "react";

const useMenu = (
    activeGameMode: GameMode,
    areQuestionsMarksEnabled: boolean,
    isColorOn: boolean,
    isSoundOn: boolean,
) => {
    const translate = useTranslation();

    const gameModesMenu = useMemo<MenuOption[]>(
        () => gameModes.map(
            ({ id, settings }) => {
                const translatedName = translate(`gameMode.${id}`);
                const suffix = settings === null ? "..." : "";

                return {
                    id: `gameMode.${id}`,
                    label: `${translatedName}${suffix}`,
                    checked: id === activeGameMode.id,
                };
            }
        ),
        [activeGameMode, translate]
    );

    const menu = useMemo<MenuGroup[]>(
        () => [
            {
                id: "game",
                label: translate("menu.game"),
                items: [
                    {
                        id: "game.new",
                        label: translate("menu.game.new"),
                        shortcut: "F2",
                        checked: false,
                    },
                    null,
                    ...gameModesMenu,
                    null,
                    {
                        id: "game.marks",
                        label: translate("menu.game.marks"),
                        checked: areQuestionsMarksEnabled,
                    },
                    {
                        id: "game.color",
                        label: translate("menu.game.color"),
                        checked: isColorOn,
                    },
                    {
                        id: "game.sound",
                        label: translate("menu.game.sound"),
                        checked: isSoundOn,
                    },
                    null,
                    {
                        id: "game.leaderboard",
                        label: translate("menu.leaderboard"),
                        checked: false,
                    },
                    null,
                    {
                        id: "game.exit",
                        label: translate("menu.game.exit"),
                        checked: false,
                    },
                ],
            },
            {
                id: "help",
                label: translate("menu.help"),
                items: [
                    {
                        id: "help.index",
                        label: translate("menu.help.index"),
                        shortcut: "F1",
                        checked: false,
                    },
                    {
                        id: "help.howToPlay",
                        label: translate("menu.help.howToPlay"),
                        checked: false,
                    },
                    {
                        id: "help.commands",
                        label: translate("menu.help.commands"),
                        checked: false,
                    },
                    null,
                    {
                        id: "help.about",
                        label: translate("menu.help.about"),
                        checked: false,
                    },
                ],
            },
        ],
        [areQuestionsMarksEnabled, gameModesMenu, isColorOn, isSoundOn, translate]
    );

    return menu;
};

export default useMenu;
