-- Создание базы данных для Онлайн Школы
-- ЛР-7 и ЛР-9: Определение модели данных

-- Таблица: Студенты
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    registration_date DATE DEFAULT CURRENT_DATE,
    phone VARCHAR(20),
    birth_date DATE
);

-- Таблица: Преподаватели
CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    specialization VARCHAR(100),
    hire_date DATE DEFAULT CURRENT_DATE,
    phone VARCHAR(20)
);

-- Таблица: Курсы
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
    duration_hours INTEGER,
    price DECIMAL(10, 2),
    start_date DATE,
    end_date DATE
);

-- Таблица: Уроки
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    content TEXT,
    lesson_order INTEGER,
    duration_minutes INTEGER,
    lesson_date DATE
);

-- Таблица: Записи студентов на курсы
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active',
    grade DECIMAL(5, 2),
    UNIQUE(student_id, course_id)
);

-- Вставка тестовых данных

-- Преподаватели
INSERT INTO teachers (name, email, specialization, phone) VALUES
('Иванов Иван Иванович', 'ivanov@school.com', 'Программирование', '+7-900-123-4567'),
('Петрова Мария Сергеевна', 'petrova@school.com', 'Математика', '+7-900-234-5678'),
('Сидоров Алексей Петрович', 'sidorov@school.com', 'Английский язык', '+7-900-345-6789');

-- Курсы
INSERT INTO courses (name, description, teacher_id, duration_hours, price, start_date, end_date) VALUES
('Основы программирования на Python', 'Изучение основ Python для начинающих', 1, 40, 15000.00, '2024-01-15', '2024-03-15'),
('Высшая математика', 'Курс по высшей математике для студентов', 2, 60, 20000.00, '2024-01-20', '2024-04-20'),
('Английский язык для начинающих', 'Базовый курс английского языка', 3, 50, 12000.00, '2024-02-01', '2024-04-30'),
('Web-разработка', 'Создание современных веб-приложений', 1, 80, 25000.00, '2024-02-10', '2024-05-10');

-- Уроки для курса "Основы программирования на Python"
INSERT INTO lessons (course_id, title, content, lesson_order, duration_minutes) VALUES
(1, 'Введение в Python', 'Знакомство с языком программирования Python', 1, 90),
(1, 'Переменные и типы данных', 'Изучение базовых типов данных в Python', 2, 90),
(1, 'Условные операторы', 'Работа с if-else конструкциями', 3, 90),
(1, 'Циклы', 'Изучение циклов for и while', 4, 90),
(1, 'Функции', 'Создание и использование функций', 5, 90);

-- Уроки для курса "Высшая математика"
INSERT INTO lessons (course_id, title, content, lesson_order, duration_minutes) VALUES
(2, 'Матрицы и определители', 'Основы линейной алгебры', 1, 90),
(2, 'Производные', 'Дифференциальное исчисление', 2, 90),
(2, 'Интегралы', 'Интегральное исчисление', 3, 90);

-- Студенты
INSERT INTO students (name, email, phone, birth_date) VALUES
('Белялов Таир', 'belyalov@student.com', '+7-900-111-2222', '2005-05-15'),
('Смирнова Анна', 'smirnova@student.com', '+7-900-222-3333', '2004-08-20'),
('Козлов Дмитрий', 'kozlov@student.com', '+7-900-333-4444', '2005-03-10'),
('Морозова Елена', 'morozova@student.com', '+7-900-444-5555', '2004-11-25'),
('Новиков Сергей', 'novikov@student.com', '+7-900-555-6666', '2005-01-30');

-- Записи студентов на курсы
INSERT INTO enrollments (student_id, course_id, status, grade) VALUES
(1, 1, 'active', NULL),
(1, 4, 'active', NULL),
(2, 2, 'active', 85.5),
(2, 3, 'completed', 92.0),
(3, 1, 'active', NULL),
(4, 3, 'active', NULL),
(5, 4, 'active', NULL);

-- Создание индексов для оптимизации запросов
CREATE INDEX idx_courses_teacher ON courses(teacher_id);
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
