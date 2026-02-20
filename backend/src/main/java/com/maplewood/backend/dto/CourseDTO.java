package com.maplewood.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class CourseDTO {
    private Long id;
    private String code;
    private String name;
    private String description;
    private Integer credits;
    private Integer hoursPerWeek;
    private String courseType;
    private Integer gradeLevelMin;
    private Integer gradeLevelMax;
    private Integer semesterOrder;
    private CourseDTO prerequisite;
    private List<CourseSectionDTO> availableSections;

    // Dipartimento derivato dal codice
    public String getDepartment() {
        if (code != null && code.length() >= 4) {
            String prefix = code.substring(0, 4);
            switch(prefix) {
                case "MATH": return "Mathematics";
                case "ENG": return "English";
                case "SCI": return "Science";
                case "HIST": return "History";
                case "ART": return "Arts";
                default: return "Other";
            }
        }
        return "Other";
    }
}
