import { type ButtonHTMLAttributes, type PropsWithChildren } from "react";
import classNames from "classnames";
import style from "./WindowButton.module.scss";

type WindowButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

const WindowButton = ({
    type = "button",
    className,
    children,
    ...props
}: WindowButtonProps) => (
    <button
        type={type}
        className={classNames(
            style.container,
            className,
        )}
        {...props}
    >
        {children}
    </button>
);

export default WindowButton;
