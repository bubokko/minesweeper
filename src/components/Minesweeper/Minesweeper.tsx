import { useState, useEffect, useMemo, useCallback } from "react";
import classNames from "classnames";
import type { BestTimeContext } from "@/types/BestTimeContext";
import type { FieldMark } from "@/types/FieldMark";
import type { GameStatus } from "@/types/GameStatus";
import type { RevealAftermath } from "@/types/RevealAftermath";
import BestTimeModal from "@/components/BestTimeModal/BestTimeModal";
import Counter from "@/components/Counter/Counter";
import CustomGameWindow from "@/components/CustomGameWindow/CustomGameWindow";
import LeaderboardWindow from "@/components/LeaderboardWindow/LeaderboardWindow";
import Minefield from "@/components/Minefield/Minefield";
import SmileyButton from "@/components/SmileyButton/SmileyButton";
import { type SmileySpriteItemType } from "@/components/SmileySprite/SmileySprite";
import Window from "@/components/Window/Window";
import { range, shuffled } from "@/utils/utils";
import { numberToDigitalScreen } from "@/utils/minesweeper";
import useAudio from "@/hooks/useAudio";
import useLeaderboard, { isLeaderboardGroupId } from "@/hooks/useLeaderboard";
import usePrevious from "@/hooks/usePrevious";
import useSettings from "@/hooks/useSettings";
import useTranslation from "@/hooks/useTranslation";
import useTimer from "@/hooks/useTimer";
import iconSrc from "@/images/icon.png";
import winAudioSrc from "@/audio/win.mp3";
import loseAudioSrc from "@/audio/lose.mp3";
import tickAudioSrc from "@/audio/tick.mp3";
import useIsTabActive from "@/hooks/useWindowStatus";
import useMenu from "@/hooks/useMenu";
import style from "./Minesweeper.module.scss";
import {
    defaultGameModePreset,
    useRememberGameMode,
    type GameModeCustom,
} from "@/utils/gameMode";
import gameModes from "@/data/gameModes";

const createBombs = (
    matrixWidth: number,
    matrixHeight: number,
    bombsCount: number,
    startIndex: number,
) => {
    const fieldsCount = matrixWidth * matrixHeight;
    const fieldIndexes = range(fieldsCount).filter(
        index => index !== startIndex
    );

    return new Set(
        shuffled(fieldIndexes).slice(0, bombsCount)
    );
};

const digitalScreenLength = 3;
const defaultGameStatus = "awaiting";

const audioMap = new Map([
    ["tick", tickAudioSrc],
    ["win", winAudioSrc],
    ["lose", loseAudioSrc],
]);

interface MinesweeperProps {
    onClose: () => void;
}

const Minesweeper = ({ onClose }: MinesweeperProps) => {
    const [gameKey, setGameKey] = useState(0); // Used to restart the game when needed
    const { settings, setSetting } = useSettings();
    const translate = useTranslation();
    const { isBestLeaderboardTime, updateLeaderboard } = useLeaderboard();
    const [playAudio] = useAudio(audioMap);
    const [gameStatus, setGameStatus] = useState<GameStatus>(defaultGameStatus);
    const {
        rememberedGameModeWithSettings,
        rememberGameModeCustom,
        rememberGameModePreset,
    } = useRememberGameMode();
    const [activeGameMode, activeGameSettings] = useMemo(
        () => (
            rememberedGameModeWithSettings
            ?? [defaultGameModePreset, defaultGameModePreset.settings]
        ),
        [rememberedGameModeWithSettings]
    );
    const [requestedGameModeCustom, setRequestedGameModeCustom] = useState<GameModeCustom | null>(
        null
    );
    const [bombs, setBombs] = useState<Set<number>>(new Set());
    const [marks, setMarks] = useState<Map<number, FieldMark>>(new Map());
    const [explosion, setExplosion] = useState<number | null>(null);
    const [revealedFields, setRevealedFields] = useState<Set<number>>(new Set());
    const initialTimer = 0;
    const {
        value: timer,
        setValue: setTimer,
        start: startTimer,
        stop: stopTimer,
        pause: pauseTimer,
        resume: resumeTimer,
    } = useTimer(initialTimer);
    const previousTimer = usePrevious(timer);
    const [isPointerDown, setIsPointerDown] = useState(false);
    const [isSmileyDown, setIsSmileyDown] = useState(false);
    const [bestTimeModalContext, setBestTimeModalContext] = useState<BestTimeContext | null>(null);
    const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);
    const isTabActive = useIsTabActive();
    const [bestTimePlayer, setBestTimePlayer] = useState(
        translate("leaderboard.defaultPlayer")
    );
    const menu = useMenu(activeGameMode, settings.marks, settings.color, settings.sound);

    const handleAudio = useCallback(
        (audio: unknown) => {
            if (settings.sound) {
                void playAudio(audio);
            }
        },
        [playAudio, settings.sound]
    );

    useEffect(
        () => {
            if (isTabActive && timer !== previousTimer && timer !== 0) {
                handleAudio("tick");
            }
        },
        [handleAudio, isTabActive, previousTimer, timer]
    );

    const statusToSmiley = (gameStatus: GameStatus): SmileySpriteItemType => {
        if (isSmileyDown) {
            return "smile";
        }

        if (isPointerDown && ["awaiting", "playing"].includes(gameStatus)) {
            return "wow";
        }

        const smileys: Record<GameStatus, SmileySpriteItemType> = {
            awaiting: "smile",
            playing: "smile",
            win: "cool",
            lose: "dead",
        };

        return smileys[gameStatus];
    };

    useEffect(
        () => {
            stopTimer();
            setTimer(0);
            setGameStatus("awaiting");
            setRevealedFields(new Set());
            setBombs(new Set());
            setMarks(new Map());
            setExplosion(null);
        },
        [activeGameMode, activeGameSettings, gameKey, setTimer, stopTimer]
    );

    const restartGame = useCallback(
        () => {
            setGameKey(gameKey => gameKey + 1);
        },
        []
    );

    useEffect(
        () => {
            const resetPointerDown = () => {
                setIsPointerDown(false);
                setIsSmileyDown(false);
            };

            const disableTouchContextMenu = (event: MouseEvent) => {
                if (event.button !== 2) {
                    event.preventDefault();
                }
            };

            window.addEventListener("pointerup", resetPointerDown);
            window.addEventListener("pointerleave", resetPointerDown);
            window.addEventListener("pointercancel", resetPointerDown);
            window.addEventListener("contextmenu", disableTouchContextMenu);

            return () => {
                window.removeEventListener("pointerup", resetPointerDown);
                window.removeEventListener("pointerleave", resetPointerDown);
                window.removeEventListener("pointercancel", resetPointerDown);
                window.removeEventListener("contextmenu", disableTouchContextMenu);
            };
        },
        []
    );

    useEffect(
        () => {
            if (isSmileyDown) {
                pauseTimer();
            } else {
                resumeTimer();
            }
        },
        [isSmileyDown, pauseTimer, resumeTimer]
    );

    const onAfterReveal = useCallback(
        (aftermath: RevealAftermath, index: number) => {
            if (aftermath === "continue") {
                return;
            }

            stopTimer();

            const newGameStatus = (aftermath === "win" ? "win" : "lose") satisfies GameStatus;

            handleAudio(newGameStatus);

            setGameStatus(newGameStatus);

            if (aftermath === "explosion") {
                setExplosion(index);
            }

            if (
                aftermath === "win"
                && isLeaderboardGroupId(activeGameMode.id)
                && isBestLeaderboardTime(activeGameMode.id, timer)
            ) {
                setBestTimeModalContext({ groupId: activeGameMode.id, time: timer });
            }
        },
        [
            activeGameMode,
            handleAudio,
            isBestLeaderboardTime,
            stopTimer,
            timer,
        ]
    );

    const flagsCount = [...marks].filter(
        ([, mark]) => mark === "flag"
    ).length;

    const onOptionSelect = useCallback(
        (id: string) => {
            switch (id) {
                case "game.new":
                    restartGame();
                    break;

                case "game.color":
                    setSetting("color", !settings.color);
                    break;

                case "game.marks":
                    setSetting("marks", !settings.marks);
                    break;

                case "game.sound":
                    setSetting("sound", !settings.sound);
                    break;

                case "game.leaderboard": {
                    setIsLeaderboardVisible(true);
                    break;
                }

                case "game.exit":
                    onClose();
                    break;

                default: {
                    const idComponents = id.split(".");

                    if (idComponents[0] === "gameMode") {
                        const gameModeId = idComponents[1];
                        const gameMode = gameModes.find(
                            ({ id }) => id === gameModeId
                        );

                        if (gameMode === undefined) {
                            break;
                        }

                        if (gameMode.settings !== null) {
                            rememberGameModePreset(gameMode);
                        } else {
                            setRequestedGameModeCustom(gameMode);
                        }
                    }

                    break;
                }
            }

            (document.activeElement as HTMLElement).blur();
        },
        [
            onClose,
            rememberGameModePreset,
            restartGame,
            setSetting,
            settings.color,
            settings.marks,
            settings.sound,
        ]
    );

    const title = translate("game.title");

    const windowKey = [activeGameSettings.width, activeGameSettings.height].join("x");

    return (
        <>
            <title>{title}</title>
            <Window
                key={windowKey} // TODO use more clever mechanics to keep window position
                icon={iconSrc}
                label={title}
                menu={{
                    items: menu,
                    onOptionSelect,
                }}
                disabled={
                    requestedGameModeCustom !== null
                    || bestTimeModalContext !== null
                    || isLeaderboardVisible
                }
                className={style.window}
            >
                <div
                    className={classNames(
                        style.game,
                        {
                            [style.noColor ?? ""]: !settings.color,
                        }
                    )}
                    onPointerDown={event => {
                        if (event.button !== 2) {
                            setIsPointerDown(true);
                        }
                    }}
                    onContextMenu={event => {
                        event.preventDefault();
                    }}
                >
                    <div className={style.info}>
                        <Counter
                            value={numberToDigitalScreen(
                                activeGameSettings.bombs - flagsCount,
                                digitalScreenLength
                            )}
                            className={style.digitalScreen}
                        />
                        <SmileyButton
                            smiley={statusToSmiley(gameStatus)}
                            onPointerDown={() => {
                                setIsSmileyDown(true);
                            }}
                            onClick={restartGame}
                        />
                        <Counter
                            value={numberToDigitalScreen(timer, digitalScreenLength)}
                            className={style.digitalScreen}
                        />
                    </div>
                    <Minefield
                        // Key is needed to fix the rendering issue:
                        // Changing game mode while scrolling the minefield renders empty minefield
                        key={activeGameMode.id}
                        gameStatus={gameStatus}
                        width={activeGameSettings.width}
                        height={activeGameSettings.height}
                        bombs={bombs}
                        marks={marks}
                        revealedFields={revealedFields}
                        explosionField={explosion}
                        areQuestionMarksEnabled={settings.marks}
                        className={style.fields}
                        onCreateBombs={startIndex => {
                            const generatedBombs = createBombs(
                                activeGameSettings.width,
                                activeGameSettings.height,
                                activeGameSettings.bombs,
                                startIndex
                            );

                            setBombs(generatedBombs);
                        }}
                        onStart={() => {
                            setTimer(timer => timer + 1);
                            startTimer(1);
                        }}
                        onReveal={(index, indexes) => {
                            setGameStatus("playing");

                            setRevealedFields(revealedFields => new Set([
                                ...revealedFields,
                                ...indexes,
                            ]));
                        }}
                        onAfterReveal={onAfterReveal}
                        onMark={(index, mark) => {
                            setIsPointerDown(false);
                            setMarks(previous => {
                                const marks = new Map(previous);

                                if (mark !== null) {
                                    marks.set(index, mark);
                                } else {
                                    marks.delete(index);
                                }

                                return marks;
                            });
                        }}
                        onAutoUnmark={indexes => {
                            setMarks(previous => {
                                const marks = new Map(previous);

                                indexes.forEach(
                                    index => marks.delete(index)
                                );

                                return marks;
                            });
                        }}
                    />
                </div>
                {bestTimeModalContext !== null && (
                    <BestTimeModal
                        groupId={bestTimeModalContext.groupId}
                        time={bestTimeModalContext.time}
                        player={bestTimePlayer}
                        className={style.bestTimeModal}
                        onPlayerChange={setBestTimePlayer}
                        onProceed={(groupId, player, time) => {
                            updateLeaderboard(groupId, player, time);
                            setBestTimeModalContext(null);
                            setIsLeaderboardVisible(true);
                        }}
                    />
                )}
            </Window>
            {requestedGameModeCustom !== null && (
                <CustomGameWindow
                    defaultWidth={activeGameSettings.width}
                    defaultHeight={activeGameSettings.height}
                    defaultBombs={activeGameSettings.bombs}
                    onProceed={newGameSettings => {
                        setRequestedGameModeCustom(null);
                        rememberGameModeCustom(requestedGameModeCustom, newGameSettings);
                    }}
                    onClose={() => {
                        setRequestedGameModeCustom(null);
                    }}
                />
            )}
            {isLeaderboardVisible && (
                <LeaderboardWindow
                    onClose={() => {
                        setIsLeaderboardVisible(false);
                    }}
                />
            )}
        </>
    );
};

export default Minesweeper;
