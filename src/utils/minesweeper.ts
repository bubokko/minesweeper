import type { FieldMark } from "@/types/FieldMark";
import type { Matrix } from "@/types/Matrix";
import type { MinefieldSchema } from "@/types/MinefieldSchema";
import { indexesAroundInMatrix } from "@/utils/geometry";

export const numberToDigitalScreen = (number: number, length: number) => {
    if (number >= 0) {
        const max = 10 ** length - 1;
        const numericValue = Math.min(number, max);

        return String(numericValue).padStart(length, "0");
    }

    const mod = 10 ** (length - 1);
    const numericValue = Math.abs(number) % mod;

    return `-${String(numericValue).padStart(length - 1, "0")}`;
};

export const indexesToReveal = (
    index: number,
    minefieldSchema: MinefieldSchema,
    revealedFields: Set<number>,
    marks: Map<number, FieldMark>,
    matrix: Matrix,
): Set<number> => {
    const result: Set<number> = new Set();

    const revealField = (index: number) => {
        if (result.has(index) || revealedFields.has(index) || marks.get(index) === "flag") {
            return;
        }

        result.add(index);

        if (minefieldSchema[index] === 0) {
            indexesAroundInMatrix(index, matrix).forEach(index => {
                revealField(index);
            });
        }
    };

    revealField(index);

    return result;
};
