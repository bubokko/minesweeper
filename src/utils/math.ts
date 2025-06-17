export const isLikeInt = (value: string) => /-?[1-9]\d*|0/.test(value);

export const clampNumber = (value: number, min: number, max: number): number => {
    if (value < min) {
        return min;
    }

    if (value > max) {
        return max;
    }

    return value;
};

// Simply returns Number.isInteger(), but is also a type guard
export const isInteger = (value: unknown): value is number => (
    Number.isInteger(value)
);
