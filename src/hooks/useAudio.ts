import { useEffect, useRef, useMemo, useCallback } from "react";

const useAudio = (paths: Map<unknown, string>) => {
    // Using singleton pattern to avoid trying to create AudioContext on mount
    const audioContext = useRef<AudioContext | null>(null);
    const decodedTracks = useRef<Map<unknown, Promise<AudioBuffer>> | null>(null);

    const getAudioContext = useCallback(
        () => {
            audioContext.current ??= new AudioContext();

            return audioContext.current;
        },
        []
    );

    const arrayBuffers = useMemo(
        () => new Map([...paths].map(
            ([key, path]) => [
                key,
                fetch(path).then(response => response.arrayBuffer()),
            ]
        )),
        [paths]
    );

    const getDecodedTracks = useCallback(
        () => {
            decodedTracks.current ??= new Map([...arrayBuffers].map(
                ([key, arrayBufferPromise]) => [
                    key,
                    arrayBufferPromise.then(
                        arrayBuffer => getAudioContext().decodeAudioData(arrayBuffer)
                    ),
                ]
            ));

            return decodedTracks.current;
        },
        [arrayBuffers, getAudioContext]
    );

    // Prepare Web Audio API early - doing it on play() makes Safari miss the first play
    useEffect(
        () => {
            // pointerup is too late for Safari to play the first sound, but pointerdown triggers
            // a warning anyway.
            // TODO find another way
            const eventName = "pointerdown";

            const initAudio = () => {
                getDecodedTracks();
                window.removeEventListener(eventName, initAudio, true); // Needed only once
            };

            window.addEventListener(eventName, initAudio, true);

            return () => {
                window.removeEventListener(eventName, initAudio, true);
            };
        },
        [getDecodedTracks]
    );

    const play = useCallback(
        async (key: unknown) => {
            const trackPromise = getDecodedTracks().get(key);

            if (trackPromise === undefined) {
                throw new Error("Invalid track key"); // TODO put key to the Error
            }

            const decodedTrack = await trackPromise;
            const bufferSource = getAudioContext().createBufferSource();

            bufferSource.buffer = decodedTrack;
            bufferSource.connect(getAudioContext().destination);

            bufferSource.start();
        },
        [getAudioContext, getDecodedTracks]
    );

    return [play] as const;
};

export default useAudio;
