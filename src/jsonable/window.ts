export type JSONableWindow = Pick<
    Window,
    "innerWidth" | "outerWidth" | "innerHeight" | "outerHeight" | "devicePixelRatio"
>;

const jsonableWindow = (window: Window): JSONableWindow => ({
    devicePixelRatio: window.devicePixelRatio,
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
});

export default jsonableWindow;
