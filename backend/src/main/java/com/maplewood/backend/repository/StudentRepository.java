package com.maplewood.backend.repository;

import com.maplewood.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByFirstNameAndLastName(String firstName, String lastName);

    @Query("SELECT s FROM Student s WHERE s.gradeLevel = :gradeLevel")
    List<Student> findByGradeLevel(Integer gradeLevel);
}