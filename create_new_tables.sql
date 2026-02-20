-- Crea le tabelle mancanti per il sistema di pianificazione corsi

-- Tabella per le sezioni dei corsi (orari specifici per il semestre corrente)
CREATE TABLE IF NOT EXISTS course_sections (
                                               id INTEGER PRIMARY KEY AUTOINCREMENT,
                                               course_id INTEGER NOT NULL,
                                               section_code TEXT NOT NULL,
                                               semester TEXT NOT NULL,
                                               academic_year INTEGER,
                                               max_capacity INTEGER DEFAULT 25,
                                               FOREIGN KEY (course_id) REFERENCES courses(id)
    );

-- Tabella per gli orari delle sezioni
CREATE TABLE IF NOT EXISTS time_slots (
                                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                                          section_id INTEGER NOT NULL,
                                          day_of_week TEXT NOT NULL,
                                          start_time TEXT NOT NULL,
                                          end_time TEXT NOT NULL,
                                          room_number TEXT,
                                          FOREIGN KEY (section_id) REFERENCES course_sections(id)
    );

-- Tabella per le iscrizioni del semestre corrente
CREATE TABLE IF NOT EXISTS current_enrollments (
                                                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                   student_id INTEGER NOT NULL,
                                                   section_id INTEGER NOT NULL,
                                                   enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                   status TEXT DEFAULT 'ENROLLED',
                                                   FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (section_id) REFERENCES course_sections(id)
    );

-- Crea indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_sections_course ON course_sections(course_id);
CREATE INDEX IF NOT EXISTS idx_sections_semester ON course_sections(semester);
CREATE INDEX IF NOT EXISTS idx_timeslots_section ON time_slots(section_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON current_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_section ON current_enrollments(section_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON current_enrollments(status);

-- Inserisci alcuni dati di esempio per le sezioni dei corsi
-- (basati sui corsi esistenti)

-- Inserisci sezioni per i corsi principali
INSERT OR IGNORE INTO course_sections (course_id, section_code, semester, academic_year, max_capacity)
SELECT
    c.id,
    c.code || '-A',
    'Fall 2024',
    2024,
    25
FROM courses c
WHERE NOT EXISTS (
    SELECT 1 FROM course_sections cs WHERE cs.course_id = c.id
);

INSERT OR IGNORE INTO course_sections (course_id, section_code, semester, academic_year, max_capacity)
SELECT
    c.id,
    c.code || '-B',
    'Fall 2024',
    2024,
    25
FROM courses c
WHERE NOT EXISTS (
    SELECT 1 FROM course_sections cs WHERE cs.course_id = c.id AND cs.section_code LIKE '%-B'
);

-- Inserisci orari per le sezioni
INSERT OR IGNORE INTO time_slots (section_id, day_of_week, start_time, end_time, room_number)
SELECT
    cs.id,
    'MONDAY',
    '09:00',
    '10:30',
    'Room ' || (100 + (cs.id % 10))
FROM course_sections cs
WHERE cs.section_code LIKE '%-A'
  AND NOT EXISTS (
    SELECT 1 FROM time_slots ts WHERE ts.section_id = cs.id
);

INSERT OR IGNORE INTO time_slots (section_id, day_of_week, start_time, end_time, room_number)
SELECT
    cs.id,
    'WEDNESDAY',
    '09:00',
    '10:30',
    'Room ' || (100 + (cs.id % 10))
FROM course_sections cs
WHERE cs.section_code LIKE '%-A'
  AND NOT EXISTS (
    SELECT 1 FROM time_slots ts WHERE ts.section_id = cs.id AND ts.day_of_week = 'WEDNESDAY'
);

INSERT OR IGNORE INTO time_slots (section_id, day_of_week, start_time, end_time, room_number)
SELECT
    cs.id,
    'TUESDAY',
    '11:00',
    '12:30',
    'Room ' || (200 + (cs.id % 10))
FROM course_sections cs
WHERE cs.section_code LIKE '%-B'
  AND NOT EXISTS (
    SELECT 1 FROM time_slots ts WHERE ts.section_id = cs.id
);

INSERT OR IGNORE INTO time_slots (section_id, day_of_week, start_time, end_time, room_number)
SELECT
    cs.id,
    'THURSDAY',
    '11:00',
    '12:30',
    'Room ' || (200 + (cs.id % 10))
FROM course_sections cs
WHERE cs.section_code LIKE '%-B'
  AND NOT EXISTS (
    SELECT 1 FROM time_slots ts WHERE ts.section_id = cs.id AND ts.day_of_week = 'THURSDAY'
);

-- Inserisci alcune iscrizioni di esempio per Emma Wilson (student_id: 1)
-- (solo per test, commenta se non vuoi dati di esempio)
INSERT OR IGNORE INTO current_enrollments (student_id, section_id, enrollment_date, status)
SELECT
    1,
    cs.id,
    datetime('now'),
    'ENROLLED'
FROM course_sections cs
WHERE cs.course_id IN (
    SELECT c.id FROM courses c
    WHERE c.code IN ('MATH201', 'ENG202', 'SCI101')
)
  AND NOT EXISTS (
    SELECT 1 FROM current_enrollments ce
    WHERE ce.student_id = 1 AND ce.section_id = cs.id
)
    LIMIT 3;

-- Verifica le tabelle create
SELECT 'Tabelle create con successo!' as messaggio;
SELECT count(*) as course_sections_count FROM course_sections;
SELECT count(*) as time_slots_count FROM time_slots;
SELECT count(*) as current_enrollments_count FROM current_enrollments;
