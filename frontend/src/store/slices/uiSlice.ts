import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    sidebarOpen: boolean;
    notifications: Array<{
        id: string;
        type: 'success' | 'error' | 'info' | 'warning';
        message: string;
    }>;
}

const initialState: UIState = {
    sidebarOpen: false,
    notifications: [],
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },
        addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id'>>) => {
            const id = Date.now().toString();
            state.notifications.push({ ...action.payload, id });
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(n => n.id !== action.payload);
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
});

export const {
    toggleSidebar,
    setSidebarOpen,
    addNotification,
    removeNotification,
    clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;