import {
    type HTMLAttributes,
    type PropsWithChildren,
    useState,
    useEffect,
    useRef,
} from "react";
import classNames from "classnames";
import type { MenuGroup } from "@/types/MenuGroup";
import type { Point } from "@/types/Point";
import MenuBar from "@/components/MenuBar/MenuBar";
import styles from "./Window.module.scss";

interface WindowMenuBar {
    items: MenuGroup[];
    onOptionSelect: (id: string, source: "click" | "shortcut") => void;
}

interface WindowProps extends HTMLAttributes<HTMLDivElement> {
    icon: string;
    label: string;
    menu?: WindowMenuBar;
    disabled?: boolean;
}

const initialOffset: Point = { x: 0, y: 0 };

const Window = ({
    icon,
    label,
    menu,
    disabled = false,
    className,
    style,
    children,
    ...props
}: PropsWithChildren<WindowProps>) => {
    const [offset, setOffset] = useState<Point>(initialOffset);
    const [isDragging, setIsDragging] = useState(false);
    const previousDragPoint = useRef<Point | null>(null);
    const containerElement = useRef<HTMLDivElement>(null);

    useEffect(
        () => {
            const moveWindow = ({ clientX, clientY }: PointerEvent) => {
                if (!isDragging || previousDragPoint.current === null) {
                    return;
                }

                const { x: previousX, y: previousY } = previousDragPoint.current;

                setOffset(offset => ({
                    x: offset.x + clientX - previousX,
                    y: offset.y + clientY - previousY,
                }));

                previousDragPoint.current = { x: clientX, y: clientY };
            };

            const stopDragging = () => {
                setIsDragging(false);
                previousDragPoint.current = null;
            };

            document.addEventListener("pointermove", moveWindow);
            document.addEventListener("pointerup", stopDragging);

            return () => {
                document.removeEventListener("pointermove", moveWindow);
                document.removeEventListener("pointerup", stopDragging);
            };
        },
        [isDragging]
    );

    return (
        <div
            ref={containerElement}
            className={classNames(
                styles.container,
                {
                    [styles.disabled ?? ""]: disabled,
                },
                className,
            )}
            style={{
                translate: `${String(offset.x)}px ${String(offset.y)}px`,
                ...style,
            }}
            {...props}
        >
            <div
                className={styles.topBar}
                onPointerDown={({ clientX, clientY }) => {
                    if (containerElement.current !== null) {
                        setIsDragging(true);
                    }

                    previousDragPoint.current = {
                        x: clientX,
                        y: clientY,
                    };
                }}
            >
                <img
                    src={icon}
                    alt="Icon"
                    className={styles.icon}
                    draggable={false}
                />
                {label}
            </div>
            <div className={styles.body}>
                {menu !== undefined && (
                    <MenuBar
                        items={menu.items}
                        disabled={disabled}
                        onOptionClick={menu.onOptionSelect}
                    />
                )}
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Window;
