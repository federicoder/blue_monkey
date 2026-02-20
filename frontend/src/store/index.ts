import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './slices/studentSlice.ts';
import courseReducer from './slices/courseSlice';
import enrollmentReducer from './slices/enrollmentSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        student: studentReducer,
        courses: courseReducer,
        enrollment: enrollmentReducer,
        ui: uiReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;