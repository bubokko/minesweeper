import { useCallback, useEffect, useMemo, useState } from "react";

const useLocalStorage = (key: string) => {
    const [value, setValueState] = useState<string | null>(
        () => localStorage.getItem(key)
    );

    useEffect(
        () => {
            const eventName = "storage" satisfies keyof WindowEventMap;

            const handle = (event: StorageEvent) => {
                if (event.key !== key) {
                    return;
                }

                setValueState(event.newValue);
            };

            window.addEventListener(eventName, handle);

            return () => {
                window.removeEventListener(eventName, handle);
            };
        },
        [key]
    );

    const set = useCallback(
        (newValue: string) => {
            setValueState(newValue);
            localStorage.setItem(key, newValue);
        },
        [key]
    );

    const clear = useCallback(
        () => {
            setValueState(null);
            localStorage.removeItem(key);
        },
        [key]
    );

    return useMemo(
        () => [value, set, clear] as const,
        [clear, set, value]
    );
};

export default useLocalStorage;
