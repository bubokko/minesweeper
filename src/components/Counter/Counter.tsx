import { type HTMLAttributes, useMemo } from "react";
import classNames from "classnames";
import CounterSprite from "@/components/CounterSprite/CounterSprite";
import { type CounterSpriteItem } from "@/components/CounterSprite/types";
import type { Digit } from "@/types/Digit";
import type { StringDigit } from "@/types/StringDigit";
import style from "./Counter.module.scss";

interface CounterProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
}

const isDigit = (string: string): string is StringDigit => /^\d$/.test(string);

const Counter = ({ value, className, ...props }: CounterProps) => {
    const characters = useMemo<CounterSpriteItem[]>(
        // eslint-disable-next-line @typescript-eslint/no-misused-spread
        () => [...value].map(character => (
            isDigit(character)
                ? Number(character) as Digit
                : "-"
        )),
        [value]
    );

    return (
        <div
            className={classNames(
                style.container,
                className,
            )}
            {...props}
        >
            {characters.map((character, index) => (
                <CounterSprite
                    key={index}
                    item={character}
                    draggable={false}
                />
            ))}
        </div>
    );
};

export default Counter;
