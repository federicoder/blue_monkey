import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { enrollInCourse, dropCourse } from '../store/slices/enrollmentSlice';
import { addNotification } from '../store/slices/uiSlice';

const DEMO_STUDENT_ID = 1;

export const useEnrollment = () => {
    const dispatch = useAppDispatch();
    const { loading, error, lastResponse } = useAppSelector((state) => state.enrollment);
    const { currentStudent } = useAppSelector((state) => state.student);
    const studentId = currentStudent?.id ?? DEMO_STUDENT_ID;

    const enroll = useCallback(async (sectionId: number) => {
        const result = await dispatch(enrollInCourse({
            studentId,
            sectionId,
        })).unwrap();

        if (result.success) {
            dispatch(addNotification({
                type: 'success',
                message: result.message,
            }));
        } else {
            const detailedMessage = result.errors?.length
                ? `${result.message}: ${result.errors.join(', ')}`
                : result.message;
            dispatch(addNotification({
                type: 'error',
                message: detailedMessage,
            }));
        }

        return result;
    }, [dispatch, studentId]);

    const drop = useCallback(async (sectionId: number) => {
        const result = await dispatch(dropCourse({
            studentId,
            sectionId,
        })).unwrap();

        if (result.success) {
            dispatch(addNotification({
                type: 'success',
                message: result.message,
            }));
        } else {
            const detailedMessage = result.errors?.length
                ? `${result.message}: ${result.errors.join(', ')}`
                : result.message;
            dispatch(addNotification({
                type: 'error',
                message: detailedMessage,
            }));
        }

        return result;
    }, [dispatch, studentId]);
    const canEnroll = useCallback(() => {
        if (!currentStudent) return false;

        // Check if already at max courses
        if (currentStudent.currentCoursesCount >= 5) return false;

        // Check if already enrolled (you might want to check actual enrollments)
        // This is simplified - you'd check against actual enrolled sections

        return true;
    }, [currentStudent]);

    return {
        enroll,
        drop,
        canEnroll,
        loading,
        error,
        lastResponse,
    };
};
