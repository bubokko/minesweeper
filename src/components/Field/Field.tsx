import { type ButtonHTMLAttributes } from "react";
import classNames from "classnames";
import type { FieldLabel } from "@/types/FieldLabel";
import FieldSprite from "@/components/FieldSprite/FieldSprite";
import style from "./Field.module.scss";

interface FieldProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: FieldLabel;
    isInset: boolean;
}

const Field = ({ label, isInset, className, ...props }: FieldProps) => (
    <button
        type="button"
        className={classNames(
            style.container,
            style[String(label)],
            {
                [style.flat ?? ""]: typeof label === "number" || label === "bomb",
                [style.inset ?? ""]: isInset,
            },
            className,
        )}
        {...props}
    >
        {label !== null && label !== 0 && (
            <FieldSprite
                item={label}
                draggable={false}
                className={style.sprite} // TODO won't be necessary without pointer-events: none
            />
        )}
    </button>
);

export default Field;
