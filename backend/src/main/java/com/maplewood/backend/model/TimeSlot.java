package com.maplewood.backend.model;

import com.maplewood.backend.model.converter.LocalTimeTextConverter;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "time_slots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class TimeSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "section_id")
    private CourseSection section;

    @Column(name = "day_of_week")
    private String dayOfWeek; // MONDAY, TUESDAY, etc.

    @Convert(converter = LocalTimeTextConverter.class)
    @Column(name = "start_time")
    private LocalTime startTime;

    @Convert(converter = LocalTimeTextConverter.class)
    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "room_number")
    private String roomNumber;

}
