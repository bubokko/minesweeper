import { type CSSProperties, type ImgHTMLAttributes } from "react";
import classNames from "classnames";
import styles from "./HorizontalSprite.module.scss";

type SpriteId = unknown;

type Image = ImgHTMLAttributes<HTMLImageElement>;

interface HorizontalSpriteProps extends Omit<Image, "width" | "height"> {
    item: SpriteId;
    items: readonly SpriteId[];
    width: number;
    height: number;
    scale?: number;
}

const HorizontalSprite = ({
    item,
    items,
    width,
    height,
    scale = 1,
    className,
    style,
    ...props
}: HorizontalSpriteProps) => (
    <img
        {...props}
        style={{
            ...style,
            ["--width"]: width,
            ["--height"]: height,
            ["--index"]: items.indexOf(item),
            ["--count"]: items.length,
            ["--scale"]: scale,
        } as CSSProperties}
        className={classNames(
            styles.container,
            className,
        )}
    />
);

export default HorizontalSprite;
