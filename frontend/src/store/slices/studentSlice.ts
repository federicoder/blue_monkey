import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { studentService } from '../../services/studentService';
import type { Schedule, StudentProfile } from '../../types';

interface StudentState {
    currentStudent: StudentProfile | null;
    schedule: Schedule | null;
    loading: boolean;
    error: string | null;
}

const initialState: StudentState = {
    currentStudent: null,
    schedule: null,
    loading: false,
    error: null,
};

// Per demo, usiamo Emma Wilson (student_id: 1)
const DEMO_STUDENT_ID = 1;

export const fetchStudentProfile = createAsyncThunk(
    'student/fetchProfile',
    async (studentId: number = DEMO_STUDENT_ID) => {
        return await studentService.getProfile(studentId);
    }
);

export const fetchStudentSchedule = createAsyncThunk(
    'student/fetchSchedule',
    async (studentId: number = DEMO_STUDENT_ID) => {
        return await studentService.getSchedule(studentId);
    }
);

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Profile
            .addCase(fetchStudentProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentProfile.fulfilled, (state, action: PayloadAction<StudentProfile>) => {
                state.loading = false;
                state.currentStudent = action.payload;
            })
            .addCase(fetchStudentProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch student profile';
            })
            // Fetch Schedule
            .addCase(fetchStudentSchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentSchedule.fulfilled, (state, action: PayloadAction<Schedule>) => {
                state.loading = false;
                state.schedule = action.payload;
            })
            .addCase(fetchStudentSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch schedule';
            });
    },
});

export const { clearError } = studentSlice.actions;
export default studentSlice.reducer;
