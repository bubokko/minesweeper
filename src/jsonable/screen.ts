export interface WebkitScreenProperties {
    availLeft: number;
    availTop: number;
    isExtended: boolean;
}

export type WebkitScreen = Screen & WebkitScreenProperties;

export type JSONableScreen = (
    Omit<Screen, "orientation">
    & Partial<WebkitScreenProperties>
    & {
        orientation?: Pick<ScreenOrientation, "angle" | "type">;
    }
);

const jsonableScreen = (screen: WebkitScreen): JSONableScreen => ({
    availHeight: screen.availHeight,
    availLeft: screen.availLeft,
    availTop: screen.availTop,
    availWidth: screen.availWidth,
    colorDepth: screen.colorDepth,
    height: screen.height,
    isExtended: screen.isExtended,
    pixelDepth: screen.pixelDepth,
    width: screen.width,

    orientation: {
        angle: screen.orientation.angle,
        type: screen.orientation.type,
    },
});

export default jsonableScreen;
