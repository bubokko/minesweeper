import { useEffect, useState } from "react";

const useIsTabActive = () => {
    const [isActive, setIsActive] = useState(true);

    useEffect(
        () => {
            const onFocus = () => {
                setIsActive(true);
            };

            const onBlur = () => {
                setIsActive(false);
            };

            window.addEventListener("focus", onFocus);
            window.addEventListener("blur", onBlur);

            return () => {
                window.removeEventListener("focus", onFocus);
                window.removeEventListener("blur", onBlur);
            };
        },
        []
    );

    return isActive;
};

export default useIsTabActive;
