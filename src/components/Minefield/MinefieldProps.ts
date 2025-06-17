import { type HTMLAttributes } from "react";
import type { FieldMark } from "@/types/FieldMark";
import type { GameStatus } from "@/types/GameStatus";
import type { RevealAftermath } from "@/types/RevealAftermath";

export interface MinefieldProps extends HTMLAttributes<HTMLDivElement> {
    gameStatus: GameStatus;
    width: number;
    height: number;
    bombs: Set<number>;
    marks: Map<number, FieldMark>;
    revealedFields: Set<number>;
    explosionField: number | null;
    areQuestionMarksEnabled: boolean;
    onCreateBombs: (startIndex: number) => void;
    onStart: (index: number) => void;
    onReveal: (index: number, indexes: Set<number>) => void;
    onAfterReveal: (aftermath: RevealAftermath, index: number) => void;
    onMark: (index: number, mark: FieldMark | null) => void;
    onAutoUnmark: (indexes: Set<number>) => void;
}
