import {
    useState,
    useRef,
    useEffect,
    useLayoutEffect,
    useMemo,
    useCallback,
} from "react";
import classNames from "classnames";
import { type MinefieldProps } from "./MinefieldProps";
import Field from "@/components/Field/Field";
import type { BombsAroundCount } from "@/types/BombsAroundCount";
import type { Matrix } from "@/types/Matrix";
import type { MinefieldSchema } from "@/types/MinefieldSchema";
import type { Point } from "@/types/Point";
import type { RevealAftermath } from "@/types/RevealAftermath";
import {
    indexToPoint,
    pointsAroundInMatrix,
    pointToIndex,
} from "@/utils/geometry";
import { indexesToReveal } from "@/utils/minesweeper";
import { range } from "@/utils/utils";
import { fieldLabel } from "./minefieldUtils";
import style from "./Minefield.module.scss";

const bombsAroundCount = (
    point: Point,
    bombs: Set<number>,
    matrix: Matrix,
): BombsAroundCount => {
    const points = pointsAroundInMatrix(point, matrix);
    const indexes = points.map(point => pointToIndex(point, matrix));

    return indexes.filter(index => bombs.has(index)).length as BombsAroundCount;
};

const Minefield = ({
    gameStatus,
    width,
    height,
    bombs,
    marks,
    revealedFields,
    explosionField,
    areQuestionMarksEnabled,
    onCreateBombs,
    onStart,
    onReveal,
    onAfterReveal,
    onMark,
    onAutoUnmark,
    ...props
}: MinefieldProps) => {
    const [queuedReveal, setQueuedReveal] = useState<number | null>(null);
    const [insetField, setInsetField] = useState<number | null>(null);
    const longPressTimeoutId = useRef<number>(undefined);
    const isRevealingLocked = useRef(false);

    const schema: MinefieldSchema = useMemo(
        () => {
            const matrix = { width, height };

            return range(width * height).map(index => {
                const point = indexToPoint(index, matrix);

                if (bombs.has(index)) {
                    return "bomb";
                }

                return bombsAroundCount(point, bombs, matrix);
            });
        },
        [bombs, height, width]
    );

    const isFieldMarkable = useCallback(
        (index: number) => (
            ["awaiting", "playing"].includes(gameStatus)
            && !revealedFields.has(index)
        ),
        [gameStatus, revealedFields]
    );

    const isFieldClickable = useCallback(
        (index: number) => isFieldMarkable(index) && marks.get(index) !== "flag",
        [isFieldMarkable, marks]
    );

    const onFieldClick = useCallback(
        (field: number) => {
            if (!isFieldClickable(field)) { // Needed as this can be triggered by long touch cancel
                return;
            }

            if (queuedReveal === null && revealedFields.size === 0) { // First click, start the game
                onCreateBombs(field);
                onStart(field);
                setQueuedReveal(field);
                return;
            }

            const matrix = { width, height };
            const newRevealedFields = indexesToReveal(
                field,
                schema,
                revealedFields,
                marks,
                matrix,
            );

            onReveal(field, newRevealedFields);

            const safeFieldsCount = width * height - bombs.size;
            const foo = safeFieldsCount - revealedFields.size;

            const aftermath: RevealAftermath = (
                bombs.has(field)
                    ? "explosion"
                    : newRevealedFields.size === foo
                        ? "win"
                        : "continue"
            );

            onAfterReveal(aftermath, field);

            const fieldsToUnmark = new Set<number>();

            newRevealedFields.forEach(field => {
                if (marks.get(field) === "maybe") {
                    fieldsToUnmark.add(field);
                }
            });

            if (fieldsToUnmark.size > 0) {
                onAutoUnmark(fieldsToUnmark);
            }
        },
        [
            bombs,
            height,
            isFieldClickable,
            marks,
            onAfterReveal,
            onAutoUnmark,
            onCreateBombs,
            onReveal,
            onStart,
            queuedReveal,
            revealedFields,
            schema,
            width,
        ]
    );

    useEffect(
        () => {
            const unlockRevealing = () => isRevealingLocked.current = false;

            window.addEventListener("pointerup", unlockRevealing);

            return () => {
                window.removeEventListener("pointerup", unlockRevealing);
            };
        },
        []
    );

    useLayoutEffect(
        () => {
            if (queuedReveal !== null) {
                onFieldClick(queuedReveal);
                setQueuedReveal(null);
            }
        },
        [queuedReveal, onFieldClick]
    );

    const onMarkNext = (index: number) => {
        const markMap = new Map([
            [null, "flag"],
            ["flag", areQuestionMarksEnabled ? "maybe" : null],
            ["maybe", null],
        ] as const);

        const previousMark = marks.get(index) ?? null;
        const mark = markMap.get(previousMark) ?? null;

        onMark(index, mark);
    };

    const matrix = { width, height };

    return (
        <div {...props}>
            {range(height).map(y => (
                <div
                    key={y}
                    className={style.row}
                >
                    {range(width).map(x => {
                        const index = pointToIndex({ x, y }, matrix);
                        const label = fieldLabel(
                            index,
                            gameStatus,
                            revealedFields,
                            marks,
                            schema,
                        );

                        return (
                            <Field
                                key={x}
                                label={label}
                                isInset={insetField === index}
                                className={classNames({
                                    [style.explosionField ?? ""]: index === explosionField,
                                })}
                                onPointerDown={event => {
                                    event.currentTarget.releasePointerCapture(
                                        event.pointerId
                                    );

                                    if (
                                        (event.pointerType === "touch" || event.button === 0)
                                        && isFieldClickable(index)
                                    ) {
                                        setInsetField(index);
                                    }

                                    if (
                                        event.pointerType === "mouse"
                                        && event.button === 2
                                        && isFieldMarkable(index)
                                    ) {
                                        onMarkNext(index);
                                    }
                                }}
                                onPointerEnter={event => {
                                    if (event.pointerType === "touch" && isFieldMarkable(index)) {
                                        longPressTimeoutId.current = window.setTimeout(
                                            () => {
                                                isRevealingLocked.current = true;
                                                setInsetField(null);
                                                onMarkNext(index);
                                            },
                                            700
                                        );
                                    }

                                    // event.button & event.buttons work differently than I assumed
                                    if (
                                        (event.pointerType === "touch" || event.buttons === 1)
                                        && isFieldClickable(index)
                                    ) {
                                        setInsetField(index);
                                    }
                                }}
                                onPointerLeave={event => {
                                    setInsetField(null);

                                    if (event.pointerType === "touch") {
                                        window.clearTimeout(longPressTimeoutId.current);
                                    }
                                }}
                                onPointerUp={event => {
                                    if (
                                        (event.pointerType === "touch" || event.button === 0)
                                        && !isRevealingLocked.current
                                    ) {
                                        onFieldClick(index);
                                    }

                                    setInsetField(null);
                                }}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Minefield;
