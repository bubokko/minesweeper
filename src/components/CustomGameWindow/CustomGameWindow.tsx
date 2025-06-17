import { type HTMLAttributes, type FormEvent, useState } from "react";
import classNames from "classnames";
import { normalizeGameSettings } from "@/utils/gameSettings";
import useTranslation from "@/hooks/useTranslation";
import Window from "@/components/Window/Window";
import WindowButton from "@/components/WindowButton/WindowButton";
import type { GameSettings } from "@/types/GameSettings";
import style from "./CustomGameWindow.module.scss";
import iconSrc from "@/images/icon.png";

interface CustomGameWindowProps extends HTMLAttributes<HTMLFormElement> {
    defaultWidth: number;
    defaultHeight: number;
    defaultBombs: number;
    onProceed: (gameSettings: GameSettings, event: FormEvent<HTMLFormElement>) => void;
    onClose: () => void;
}

const CustomGameWindow = ({
    defaultWidth,
    defaultHeight,
    defaultBombs,
    onProceed,
    onClose,
    className,
    onSubmit,
    ...props
}: CustomGameWindowProps) => {
    const [widthInput, setWidthInput] = useState(String(defaultWidth));
    const [heightInput, setHeightInput] = useState(String(defaultHeight));
    const [bombsInput, setBombsInput] = useState(String(defaultBombs));
    const translate = useTranslation();

    return (
        <Window
            icon={iconSrc}
            label={translate("custom.title")}
        >
            <form
                onSubmit={event => {
                    event.preventDefault();

                    const gameSettings: GameSettings = {
                        width: Number(widthInput),
                        height: Number(heightInput),
                        bombs: Number(bombsInput),
                    };

                    const normalizedGameSettings = normalizeGameSettings(gameSettings);

                    onProceed(normalizedGameSettings, event);
                    onSubmit?.(event);
                }}
                className={classNames(
                    style.container,
                    className,
                )}
                {...props}
            >
                <div className={style.inputs}>
                    <div className={style.inputRow}>
                        <div>{translate("custom.height")}:</div>
                        <input
                            type="number"
                            value={heightInput}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className={style.input}
                            onChange={event => {
                                setHeightInput(event.target.value);
                            }}
                        />
                    </div>
                    <div className={style.inputRow}>
                        <div>{translate("custom.width")}:</div>
                        <input
                            type="number"
                            value={widthInput}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className={style.input}
                            onChange={event => {
                                setWidthInput(event.target.value);
                            }}
                        />
                    </div>
                    <div className={style.inputRow}>
                        <div>{translate("custom.mines")}:</div>
                        <input
                            type="number"
                            value={bombsInput}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className={style.input}
                            onChange={event => {
                                setBombsInput(event.target.value);
                            }}
                        />
                    </div>
                </div>
                <div className={style.buttons}>
                    <WindowButton
                        type="submit"
                    >
                        {translate("buttons.ok")}
                    </WindowButton>
                    <WindowButton
                        onClick={onClose}
                    >
                        {translate("buttons.cancel")}
                    </WindowButton>
                </div>
            </form>
        </Window>
    );
};

export default CustomGameWindow;
