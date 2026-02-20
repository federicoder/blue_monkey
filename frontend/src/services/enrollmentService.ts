import api from './api';
import type { CourseSection, EnrollmentRequest, EnrollmentResponse } from '../types';

export const enrollmentService = {
    // Iscriviti a un corso
    enroll: async (request: EnrollmentRequest): Promise<EnrollmentResponse> => {
        const response = await api.post('/enrollments', request);
        return response.data;
    },

    // Abbandona un corso
    drop: async (studentId: number, sectionId: number): Promise<EnrollmentResponse> => {
        const response = await api.delete(`/enrollments/${studentId}/${sectionId}`);
        return response.data;
    },

    getAvailableSections: async (studentId: number, semester: string): Promise<CourseSection[]> => {
        const response = await api.get(`/enrollments/available-sections?studentId=${studentId}&semester=${semester}`);
        return response.data;
    },
};
