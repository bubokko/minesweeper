export const range = (max: number) => [...Array(max).keys()];

export const shuffled = <Type>(array: Type[]) => (
    array
        .map(item => [item, Math.random()] as const)
        .sort(([, a], [, b]) => b - a)
        .map(([item]) => item)
);

export const playAudio = (audio: HTMLAudioElement) => {
    if (audio.paused) {
        void audio.play();
    } else {
        audio.currentTime = 0;
    }
};
