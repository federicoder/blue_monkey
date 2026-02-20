import api from './api';
import type {Schedule, StudentProfile} from "../types";

export const studentService = {
    // Ottieni profilo studente
    getProfile: async (studentId: number): Promise<StudentProfile> => {
        const response = await api.get(`/students/${studentId}/profile`);
        return response.data;
    },

    // Ottieni orario settimanale
    getSchedule: async (studentId: number): Promise<Schedule> => {
        const response = await api.get(`/students/${studentId}/schedule`);
        return response.data;
    },
};