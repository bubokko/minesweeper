import { type ImgHTMLAttributes } from "react";
import classNames from "classnames";
import HorizontalSprite from "@/components/HorizontalSprite/HorizontalSprite";
import type { TupleToUnion } from "@/types/TupleToUnion";
import spriteImage from "@/images/field.png";
import style from "./FieldSprite.module.scss";

const items = [1, 2, 3, 4, 5, 6, 7, 8, "flag", "maybe", "bomb", "mistake"] as const;

export type FieldSpriteItemType = TupleToUnion<typeof items>;

type ImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "width" | "height">;

interface FieldSpriteProps extends ImgProps {
    item: FieldSpriteItemType;
}

const FieldSprite = ({ item, className, ...props }: FieldSpriteProps) => {
    return (
        <HorizontalSprite
            src={spriteImage}
            item={item}
            items={items}
            width={15}
            height={15}
            scale={2}
            className={classNames(
                style.container,
                className,
            )}
            {...props}
        />
    );
};

export default FieldSprite;
