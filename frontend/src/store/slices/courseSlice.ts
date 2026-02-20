import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Course, CourseFilters, CourseSection } from '../../types';
import { courseService } from '../../services/courseService';
import { enrollmentService } from '../../services/enrollmentService';
import { getCurrentSemesterLabel } from '../../services/academicTermService';

interface CourseState {
    courses: Course[];
    availableSections: CourseSection[];
    filters: CourseFilters;
    loading: boolean;
    error: string | null;
}

const initialState: CourseState = {
    courses: [],
    availableSections: [],
    filters: {},
    loading: false,
    error: null,
};

const DEMO_STUDENT_ID = 1;

export const fetchAllCourses = createAsyncThunk(
    'courses/fetchAll',
    async (studentId: number = DEMO_STUDENT_ID) => {
        const semester = await getCurrentSemesterLabel();
        return await courseService.getAvailableCourses(studentId, semester);
    }
);

export const fetchAvailableSections = createAsyncThunk(
    'courses/fetchAvailable',
    async (studentId: number = DEMO_STUDENT_ID) => {
        const semester = await getCurrentSemesterLabel();
        return await enrollmentService.getAvailableSections(studentId, semester);
    }
);

const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<CourseFilters>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {};
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Courses
            .addCase(fetchAllCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(fetchAllCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch courses';
            })
            // Fetch Available Sections
            .addCase(fetchAvailableSections.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAvailableSections.fulfilled, (state, action: PayloadAction<CourseSection[]>) => {
                state.loading = false;
                state.availableSections = action.payload;
            })
            .addCase(fetchAvailableSections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch available sections';
            });
    },
});

export const { setFilters, clearFilters, clearError } = courseSlice.actions;
export default courseSlice.reducer;
