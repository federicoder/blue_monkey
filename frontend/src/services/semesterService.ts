import api from './api';
import type {Semester} from '../types';

export const semesterService = {
    // Ottieni semestre corrente
    getCurrentSemester: async (): Promise<Semester> => {
        const response = await api.get('/semesters/current');
        return response.data;
    },

    // Ottieni tutti i semestri
    getAllSemesters: async (): Promise<Semester[]> => {
        const response = await api.get('/semesters');
        return response.data;
    },
};