import { type FormHTMLAttributes, useEffect, useRef } from "react";
import classNames from "classnames";
import WindowButton from "@/components/WindowButton/WindowButton";
import useTranslation from "@/hooks/useTranslation";
import style from "./BestTimeModal.module.scss";
import type { LeaderboardGroupId } from "@/hooks/useLeaderboard";

interface BestTimeModalProps extends FormHTMLAttributes<HTMLFormElement> {
    groupId: LeaderboardGroupId;
    time: number;
    player: string;
    onPlayerChange: (player: string) => void;
    onProceed: (groupId: LeaderboardGroupId, player: string, time: number) => void;
}

const BestTimeModal = ({
    groupId,
    time,
    player,
    onProceed,
    onPlayerChange,
    className,
    onSubmit,
    ...props
}: BestTimeModalProps) => {
    const inputElement = useRef<HTMLInputElement>(null);
    const translate = useTranslation();

    useEffect(
        () => inputElement.current?.select(),
        []
    );

    const message = translate("leaderboard.congratulations")(groupId);

    return (
        <form
            onSubmit={event => {
                event.preventDefault();

                onSubmit?.(event);
                onProceed(groupId, player, time);
            }}
            className={classNames(
                style.container,
                className,
            )}
            {...props}
        >
            <p className={style.message}>
                {message}
            </p>
            <input
                ref={inputElement}
                type="text"
                value={player}
                className={style.input}
                onChange={event => {
                    onPlayerChange(event.target.value);
                }}
            />
            <div className={style.buttons}>
                <WindowButton type="submit">
                    {translate("buttons.ok")}
                </WindowButton>
            </div>
        </form>
    );
};

export default BestTimeModal;
