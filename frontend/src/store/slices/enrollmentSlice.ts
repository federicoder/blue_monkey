import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { enrollmentService } from '../../services/enrollmentService';
import { fetchStudentProfile, fetchStudentSchedule } from './studentSlice.ts';
import { fetchAllCourses, fetchAvailableSections } from './courseSlice.ts';
import type { EnrollmentRequest, EnrollmentResponse } from '../../types';

interface EnrollmentState {
    loading: boolean;
    error: string | null;
    lastResponse: EnrollmentResponse | null;
}

const initialState: EnrollmentState = {
    loading: false,
    error: null,
    lastResponse: null,
};

export const enrollInCourse = createAsyncThunk(
    'enrollment/enroll',
    async (request: EnrollmentRequest, { dispatch, rejectWithValue }) => {
        let response: EnrollmentResponse;
        try {
            response = await enrollmentService.enroll(request);
        } catch (error: any) {
            const apiMessage = error?.response?.data?.message || 'Enrollment failed';
            const apiErrors = error?.response?.data?.errors;
            return rejectWithValue(apiErrors?.length ? `${apiMessage}: ${apiErrors.join(', ')}` : apiMessage);
        }

        if (response.success) {
            // Refresh student data after successful enrollment
            await dispatch(fetchStudentProfile(request.studentId));
            await dispatch(fetchStudentSchedule(request.studentId));
            await dispatch(fetchAllCourses(request.studentId));
            await dispatch(fetchAvailableSections(request.studentId));
        }
        return response;
    }
);

export const dropCourse = createAsyncThunk(
    'enrollment/drop',
    async ({ studentId, sectionId }: { studentId: number; sectionId: number }, { dispatch, rejectWithValue }) => {
        let response: EnrollmentResponse;
        try {
            response = await enrollmentService.drop(studentId, sectionId);
        } catch (error: any) {
            const apiMessage = error?.response?.data?.message || 'Drop failed';
            const apiErrors = error?.response?.data?.errors;
            return rejectWithValue(apiErrors?.length ? `${apiMessage}: ${apiErrors.join(', ')}` : apiMessage);
        }

        if (response.success) {
            // Refresh student data after successful drop
            await dispatch(fetchStudentProfile(studentId));
            await dispatch(fetchStudentSchedule(studentId));
            await dispatch(fetchAllCourses(studentId));
            await dispatch(fetchAvailableSections(studentId));
        }
        return response;
    }
);

const enrollmentSlice = createSlice({
    name: 'enrollment',
    initialState,
    reducers: {
        clearLastResponse: (state) => {
            state.lastResponse = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Enroll
            .addCase(enrollInCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(enrollInCourse.fulfilled, (state, action: PayloadAction<EnrollmentResponse>) => {
                state.loading = false;
                state.lastResponse = action.payload;
                if (!action.payload.success) {
                    state.error = action.payload.message;
                }
            })
            .addCase(enrollInCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || action.error.message || 'Enrollment failed';
            })
            // Drop
            .addCase(dropCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(dropCourse.fulfilled, (state, action: PayloadAction<EnrollmentResponse>) => {
                state.loading = false;
                state.lastResponse = action.payload;
                if (!action.payload.success) {
                    state.error = action.payload.message;
                }
            })
            .addCase(dropCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || action.error.message || 'Drop failed';
            });
    },
});

export const { clearLastResponse, clearError } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
