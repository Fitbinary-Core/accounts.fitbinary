import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const STORAGE_KEY = "isExpanded";

const loadState = (): boolean => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : false;
};

const saveState = (value: boolean) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    }
};

interface SidebarState {
    isExpanded: boolean;
}

const initialState: SidebarState = {
    isExpanded: loadState(),
};

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        toggleSidebar(state) {
            state.isExpanded = !state.isExpanded;
            saveState(state.isExpanded);
        },
        setSidebar(state, action: PayloadAction<boolean>) {
            state.isExpanded = action.payload;
            saveState(state.isExpanded);
        },
        hydrateSidebar(state) {
            state.isExpanded = loadState();
        },
    },
});

export const { toggleSidebar, setSidebar, hydrateSidebar } =
    sidebarSlice.actions;

export default sidebarSlice.reducer;
