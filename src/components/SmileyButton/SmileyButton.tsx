import { type ButtonHTMLAttributes } from "react";
import classNames from "classnames";
import SmileySprite, {
    type SmileySpriteItemType,
} from "@/components/SmileySprite/SmileySprite";
import style from "./SmileyButton.module.scss";

interface SmileyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    smiley: SmileySpriteItemType;
}

const SmileyButton = ({ smiley, className, ...props }: SmileyButtonProps) => {
    return (
        <button
            type="button"
            className={classNames(
                style.container,
                className,
            )}
            {...props}
        >
            <SmileySprite
                item={smiley}
                draggable={false}
            />
        </button>
    );
};

export default SmileyButton;
