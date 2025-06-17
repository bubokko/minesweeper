import type { MenuOption } from "@/types/MenuOption";

export interface MenuGroup {
    id: string;
    label: string;
    items: (MenuOption | null)[]; // null means a separator
}
