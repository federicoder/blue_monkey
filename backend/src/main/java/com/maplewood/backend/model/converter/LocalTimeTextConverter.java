package com.maplewood.backend.model.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Converter(autoApply = false)
public class LocalTimeTextConverter implements AttributeConverter<LocalTime, String> {

    private static final DateTimeFormatter DB_TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm:ss");
    private static final DateTimeFormatter[] READ_FORMATS = new DateTimeFormatter[] {
            DateTimeFormatter.ofPattern("HH:mm:ss"),
            DateTimeFormatter.ofPattern("HH:mm"),
            DateTimeFormatter.ofPattern("H:mm:ss"),
            DateTimeFormatter.ofPattern("H:mm")
    };

    @Override
    public String convertToDatabaseColumn(LocalTime attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.format(DB_TIME_FORMAT);
    }

    @Override
    public LocalTime convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }

        for (DateTimeFormatter formatter : READ_FORMATS) {
            try {
                return LocalTime.parse(dbData, formatter);
            } catch (DateTimeParseException ignored) {
                // try next format
            }
        }

        throw new IllegalArgumentException("Unsupported time format: " + dbData);
    }
}
