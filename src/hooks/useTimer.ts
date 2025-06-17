import { useState, useRef, useMemo, useCallback, useEffect } from "react";

interface Timer {
    id: number;
    step: number;
    ms: number;
    lastTick: Date;
    pausedAt: Date | null;
}

const useTimer = (initialValue = 0) => {
    const [value, setValue] = useState(initialValue);
    const timer = useRef<Timer | null>(null);

    const tick = useCallback(
        () => {
            const interval = timer.current;

            if (interval === null) {
                return;
            }

            setValue(value => value + interval.step);
            interval.lastTick = new Date();
        },
        []
    );

    const start = useCallback(
        (step = 1, intervalMs = 1000) => {
            if (timer.current !== null) {
                return;
            }

            timer.current = {
                id: window.setInterval(tick, intervalMs),
                step,
                ms: intervalMs,
                lastTick: new Date(),
                pausedAt: null,
            };
        },
        [tick]
    );

    const unschedule = useCallback(
        () => {
            if (timer.current === null) {
                return;
            }

            // Using clearTimeout() to clear either timeout or interval, as it just works
            window.clearTimeout(timer.current.id);
        },
        []
    );

    const stop = useCallback(
        () => {
            if (timer.current === null) {
                return;
            }

            unschedule();
            timer.current = null;
        },
        [unschedule]
    );

    const pause = useCallback(
        () => {
            if (timer.current === null) {
                return;
            }

            unschedule();
            timer.current.pausedAt = new Date();
        },
        [unschedule]
    );

    const resume = useCallback(
        () => {
            const interval = timer.current;

            if (interval === null) {
                return;
            }

            if (interval.pausedAt === null) {
                return;
            }

            const timeoutMs = (
                interval.ms
                - interval.pausedAt.getTime()
                + interval.lastTick.getTime()
            );

            interval.pausedAt = null;

            interval.id = window.setTimeout(
                () => {
                    tick();
                    interval.id = window.setInterval(tick, interval.ms);
                },
                timeoutMs
            );
        },
        [tick]
    );

    useEffect(
        () => stop,
        [stop]
    );

    const handler = useMemo(
        () => ({ value, setValue, start, stop, pause, resume }),
        [pause, resume, start, stop, value]
    );

    return handler;
};

export default useTimer;
