package com.maplewood.backend.model.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Converter(autoApply = false)
public class LocalDateTextConverter implements AttributeConverter<LocalDate, String> {

    private static final DateTimeFormatter DB_DATE_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter[] DATE_TIME_FORMATS = new DateTimeFormatter[] {
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.S"),
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SS"),
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS")
    };

    @Override
    public String convertToDatabaseColumn(LocalDate attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.format(DB_DATE_FORMAT);
    }

    @Override
    public LocalDate convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }

        try {
            return LocalDate.parse(dbData, DB_DATE_FORMAT);
        } catch (DateTimeParseException ignored) {
            // Try datetime formats from legacy rows/drivers
        }

        for (DateTimeFormatter formatter : DATE_TIME_FORMATS) {
            try {
                return LocalDateTime.parse(dbData, formatter).toLocalDate();
            } catch (DateTimeParseException ignored) {
                // try next format
            }
        }

        throw new IllegalArgumentException("Unsupported date format: " + dbData);
    }
}
