import { type HTMLAttributes } from "react";
import classNames from "classnames";
import Window from "@/components/Window/Window";
import WindowButton from "@/components/WindowButton/WindowButton";
import useTranslation from "@/hooks/useTranslation";
import style from "./LeaderboardWindow.module.scss";
import iconSrc from "@/images/icon.png"; // TODO use different icon, as in the original game
import useLeaderboard from "@/hooks/useLeaderboard";

interface LeaderboardWindowProps extends HTMLAttributes<HTMLFormElement> {
    onClose: () => void;
}

const LeaderboardWindow = ({ onClose, ...props }: LeaderboardWindowProps) => {
    const { leaderboard, clearLeaderboard } = useLeaderboard();
    const translate = useTranslation();

    return (
        <Window
            icon={iconSrc}
            label={translate("leaderboard.title")}
        >
            <form
                {...props}
                className={classNames(
                    style.container,
                    props.className,
                )}
                onSubmit={event => {
                    event.preventDefault();
                    onClose();
                }}
            >
                <table className={style.table}>
                    <tbody>
                        {leaderboard.map(({ label, player, time }) => (
                            <tr key={label}>
                                <td>
                                    {label}:
                                </td>
                                <td className={style.timeCell}>
                                    {time}s
                                </td>
                                <td>
                                    <div className={style.player}>
                                        {player}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={style.buttons}>
                    <WindowButton
                        onClick={() => {
                            clearLeaderboard();
                        }}
                    >
                        {translate("leaderboard.reset")}
                    </WindowButton>
                    <WindowButton
                        type="submit"
                        autoFocus
                    >
                        OK
                    </WindowButton>
                </div>
            </form>
        </Window>
    );
};

export default LeaderboardWindow;
