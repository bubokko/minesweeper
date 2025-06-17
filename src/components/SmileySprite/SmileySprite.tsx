import { type ImgHTMLAttributes } from "react";
import classNames from "classnames";
import HorizontalSprite from "@/components/HorizontalSprite/HorizontalSprite";
import type { TupleToUnion } from "@/types/TupleToUnion";
import spriteImage from "@/images/smiley.png";
import style from "./SmileySprite.module.scss";

const items = ["smile", "wow", "cool", "dead"] as const;

export type SmileySpriteItemType = TupleToUnion<typeof items>;

type ImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "width" | "height">;

interface SmileySpriteProps extends ImgProps {
    item: SmileySpriteItemType;
}

const SmileySprite = ({ item, className, ...props }: SmileySpriteProps) => {
    return (
        <HorizontalSprite
            src={spriteImage}
            item={item}
            items={items}
            width={20}
            height={20}
            scale={2}
            className={classNames(
                style.container,
                className,
            )}
            {...props}
        />
    );
};

export default SmileySprite;
