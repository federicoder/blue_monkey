import api from './api';
import type {Course} from "../types";

export const courseService = {
    // Ottieni tutti i corsi
    getAllCourses: async (): Promise<Course[]> => {
        const response = await api.get('/courses');
        return response.data;
    },

    // Ottieni corsi disponibili per studente
    getAvailableCourses: async (studentId: number, semester: string): Promise<Course[]> => {
        const response = await api.get(`/courses/available?studentId=${studentId}&semester=${semester}`);
        return response.data;
    },
};