import { type ImgHTMLAttributes } from "react";
import classNames from "classnames";
import { type CounterSpriteItem } from "./types";
import HorizontalSprite from "@/components/HorizontalSprite/HorizontalSprite";
import spriteImage from "@/images/counter.png";
import style from "./CounterSprite.module.scss";

const items: readonly CounterSpriteItem[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "-"];

type ImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "width" | "height">;

interface CounterSpriteProps extends ImgProps {
    item: CounterSpriteItem;
}

const CounterSprite = ({ item, className, ...props }: CounterSpriteProps) => {
    return (
        <HorizontalSprite
            src={spriteImage}
            item={item}
            items={items}
            width={13}
            height={23}
            scale={2}
            className={classNames(
                style.container,
                className,
            )}
            {...props}
        />
    );
};

export default CounterSprite;
