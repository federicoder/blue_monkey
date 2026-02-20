import { semesterService } from './semesterService';

const FALLBACK_SEMESTER_LABEL = 'Fall 2024';

export const getCurrentSemesterLabel = async (): Promise<string> => {
    try {
        const currentSemester = await semesterService.getCurrentSemester();
        if (!currentSemester?.name || !currentSemester?.year) {
            return FALLBACK_SEMESTER_LABEL;
        }
        return `${currentSemester.name} ${currentSemester.year}`;
    } catch {
        return FALLBACK_SEMESTER_LABEL;
    }
};
