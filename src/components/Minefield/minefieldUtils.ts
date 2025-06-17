import type { FieldLabel } from "@/types/FieldLabel";
import type { FieldMark } from "@/types/FieldMark";
import type { GameStatus } from "@/types/GameStatus";
import type { MinefieldSchema } from "@/types/MinefieldSchema";

export const fieldLabel = (
    index: number,
    gameStatus: GameStatus,
    revealedFields: Set<number>,
    marks: Map<number, FieldMark>,
    minefieldSchema: MinefieldSchema,
): FieldLabel => {
    const bombStatus = minefieldSchema[index];

    if (bombStatus === undefined) {
        throw new Error(`Invalid field index: ${String(index)}`);
    }

    const isBomb = (bombStatus === "bomb");

    if (gameStatus === "win" && isBomb) {
        return "flag";
    }

    if (gameStatus === "lose") {
        if (isBomb && marks.get(index) !== "flag") {
            return "bomb";
        }

        if (!isBomb && marks.get(index) === "flag") {
            return "mistake";
        }
    }

    const mark = marks.get(index);

    if (mark !== undefined) {
        return mark;
    }

    if (!revealedFields.has(index)) {
        return null;
    }

    return bombStatus;
};
