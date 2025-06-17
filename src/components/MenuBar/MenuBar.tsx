import { type HTMLAttributes, useEffect, useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";
import checkedImage from "./checked.png";
import style from "./MenuBar.module.scss";
import type { MenuGroup } from "@/types/MenuGroup";

interface MenuBarProps extends HTMLAttributes<HTMLDivElement> {
    items: MenuGroup[];
    disabled?: boolean;
    onOptionClick: (id: string, source: "click" | "shortcut") => void;
}

const lockClick = (event: MouseEvent) => {
    event.stopPropagation();
};

const MenuBar = ({
    items,
    disabled = false,
    onOptionClick,
    className,
    ...props
}: MenuBarProps) => {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [isAnimated, setIsAnimated] = useState(true);
    const previousActiveItem = useRef<string | null>(null);

    useEffect(
        () => {
            const hideMenu = () => {
                setActiveItem(null);
            };

            window.addEventListener("pointerdown", hideMenu);
            window.addEventListener("pointerup", hideMenu);

            return () => {
                window.removeEventListener("pointerdown", hideMenu);
                window.removeEventListener("pointerup", hideMenu);
            };
        },
        []
    );

    useEffect(
        () => {
            const handleKeyboardShortcuts = (event: KeyboardEvent) => {
                const menuChildren = items.map(({ items }) => items).flat();
                const menuOptions = menuChildren.filter(
                    item => item !== null // Skip separators
                );

                for (const menuOption of menuOptions) {
                    if (menuOption.shortcut === undefined) {
                        continue;
                    }

                    if (event.code === menuOption.shortcut) {
                        onOptionClick(menuOption.id, "shortcut");
                    }
                }
            };

            window.addEventListener("keydown", handleKeyboardShortcuts);

            return () => {
                window.removeEventListener("keydown", handleKeyboardShortcuts);
            };
        },
        [items, onOptionClick]
    );

    useLayoutEffect(
        () => {
            setIsAnimated(previousActiveItem.current === null);
            previousActiveItem.current = activeItem;
        },
        [activeItem]
    );

    return (
        <div
            className={classNames(
                style.container,
                className,
            )}
            onContextMenu={event => {
                event.preventDefault();
            }}
            {...props}
        >
            {items.map(({ id, label, items }) => (
                <div
                    key={id}
                    className={style.itemContainer}
                    onPointerDown={event => {
                        event.stopPropagation();
                    }}
                    onPointerUp={event => {
                        event.stopPropagation();
                    }}
                >
                    <button
                        type="button"
                        className={classNames(
                            style.item,
                            style.rootItem,
                            {
                                [style.hover ?? ""]: hoveredItem === id,
                                [style.active ?? ""]: activeItem === id,
                            }
                        )}
                        disabled={disabled}
                        onPointerEnter={event => {
                            setHoveredItem(id);

                            if (event.pointerType === "mouse" && activeItem !== null) {
                                setActiveItem(id);
                            }

                            if (event.pointerType === "touch") {
                                setActiveItem(activeItem => activeItem !== id ? id : null);
                            }
                        }}
                        onPointerLeave={() => {
                            setHoveredItem(null);
                        }}
                        onPointerDown={event => {
                            event.currentTarget.releasePointerCapture(event.pointerId);

                            if (event.pointerType === "mouse") {
                                setActiveItem(
                                    activeItem => activeItem !== id ? id : null
                                );
                            }
                        }}
                    >
                        <div className={style.label}>
                            {label}
                        </div>
                    </button>
                    <div className={style.submenuContainer}>
                        {activeItem === id && (
                            <div
                                className={classNames(
                                    style.submenu,
                                    {
                                        [style.animate ?? ""]: isAnimated,
                                    }
                                )}
                            >
                                {items.map((submenuItem, submenuIndex) => {
                                    if (submenuItem === null) {
                                        return (
                                            <div
                                                key={submenuIndex}
                                                className={style.separator}
                                            />
                                        );
                                    }

                                    const { id, label, shortcut, checked = false } = submenuItem;

                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            className={classNames(
                                                style.item,
                                                style.submenuItem,
                                                {
                                                    [style.hover ?? ""]: hoveredItem === id,
                                                },
                                            )}
                                            onPointerEnter={() => {
                                                setHoveredItem(id);
                                            }}
                                            onPointerLeave={() => {
                                                setHoveredItem(null);
                                            }}
                                            onPointerDown={event => {
                                                event.currentTarget.releasePointerCapture(
                                                    event.pointerId
                                                );
                                            }}
                                            onPointerUp={() => {
                                                setActiveItem(null);
                                                onOptionClick(id, "click");

                                                // Locking the click, as it's triggered after
                                                // submenu item disappears
                                                // TODO find a nicer way to handle this, without
                                                // setTimeout
                                                window.addEventListener("click", lockClick, true);

                                                window.setTimeout(
                                                    () => {
                                                        window.removeEventListener(
                                                            "click",
                                                            lockClick,
                                                            true,
                                                        );
                                                    },
                                                    200
                                                );
                                            }}
                                        >
                                            {checked && (
                                                <img
                                                    src={checkedImage}
                                                    alt="Checked"
                                                    className={style.checkedIcon}
                                                />
                                            )}
                                            <div className={style.label}>
                                                {label}
                                            </div>
                                            {shortcut !== undefined && (
                                                <div className={style.submenuItemShortcut}>
                                                    {shortcut}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MenuBar;
