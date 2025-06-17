import { useState, useCallback } from "react";
import Minesweeper from "@/components/Minesweeper/Minesweeper";
import style from "./App.module.scss";

const App = () => {
    const [isOpen, setIsOpen] = useState(true);

    const onClose = useCallback(
        () => {
            setIsOpen(false);
        },
        []
    );

    if (!isOpen) {
        return null;
    }

    return (
        <div className={style.container}>
            <Minesweeper onClose={onClose} />
        </div>
    );
};

export default App;
