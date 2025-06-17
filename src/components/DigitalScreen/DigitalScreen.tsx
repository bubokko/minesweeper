import { type HTMLAttributes } from "react";
import classNames from "classnames";
import style from "./DigitalScreen.module.scss";

interface DigitalScreenProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
    length?: number | null;
    align?: "left" | "right";
}

const DigitalScreen = ({
    value,
    length = null,
    align = "left",
    className,
    ...props
}: DigitalScreenProps) => {
    return (
        <div
            className={classNames(
                style.container,
                className,
            )}
            {...props}
        >
            <div
                className={style.screen}
                data-screen
            >
                <div className={style.off}>
                    {"8".repeat(length ?? value.length)}
                </div>
                <div
                    className={classNames(
                        style.on,
                        style[align],
                    )}
                >
                    {value}
                </div>
            </div>
        </div>
    );
};

export default DigitalScreen;
