import type { Direction } from "@/types/Direction";
import type { Matrix } from "@/types/Matrix";
import type { Point } from "@/types/Point";

export const isPointInMatrix = (point: Point, matrix: Matrix) => (
    point.x >= 0
    && point.x < matrix.width
    && point.y >= 0
    && point.y < matrix.height
);

export const indexToPoint = (index: number, matrix: Matrix): Point => {
    const x = index % matrix.width;
    const y = Math.floor(index / matrix.width);

    return { x, y };
};

export const pointToIndex = (point: Point, matrix: Matrix): number => (
    point.y * matrix.width + point.x
);

export const pointsAround = (point: Point): Point[] => {
    const offsets: [Direction, Direction][] = [
        [0, -1], // N
        [1, -1], // NE
        [1, 0], // E
        [1, 1], // SE
        [0, 1], // S
        [-1, 1], // SW
        [-1, 0], // W
        [-1, -1], // NW
    ];

    return offsets.map(
        ([offsetX, offsetY]) => {
            const x = point.x + offsetX;
            const y = point.y + offsetY;

            return { x, y };
        }
    );
};

export const pointsAroundInMatrix = (point: Point, matrix: Matrix): Point[] => (
    pointsAround(point).filter(
        point => isPointInMatrix(point, matrix)
    )
);

export const indexesAroundInMatrix = (index: number, matrix: Matrix): Set<number> => {
    const point = indexToPoint(index, matrix);

    const indexes = pointsAroundInMatrix(point, matrix).map(
        pointAround => pointToIndex(pointAround, matrix)
    );

    return new Set(indexes);
};
