import { useEffect, useState } from "react";

const parseHash = (hash: string | null = null) => {
    const hashString = hash ?? window.location.hash;

    if (hashString === "") {
        return null;
    }

    return hashString.substring(1);
};

const useLocationHash = () => {
    const [hash, setHash] = useState(parseHash);

    useEffect(
        () => {
            const eventName = "hashchange" satisfies keyof WindowEventMap;

            const handle = () => {
                const newHash = parseHash();

                setHash(newHash);
            };

            window.addEventListener(eventName, handle);

            return () => {
                window.removeEventListener(eventName, handle);
            };
        },
        []
    );

    return hash;
};

export default useLocationHash;
