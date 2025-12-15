require('dotenv').config();
const { sequelize, Student, Teacher, Course, Lesson, Enrollment } = require('./models');

async function seedDatabase() {
    try {
        // Проверка подключения
        await sequelize.authenticate();
        console.log('✓ Подключение к базе данных установлено');

        // Синхронизация моделей (создание таблиц, если их нет)
        await sequelize.sync({ force: false });
        console.log('✓ Модели синхронизированы');

        // Очистка существующих данных (опционально)
        console.log('\n🗑️  Очистка существующих данных...');
        // Удаляем в правильном порядке из-за внешних ключей
        await Enrollment.destroy({ where: {} });
        await Lesson.destroy({ where: {} });
        await Course.destroy({ where: {} });
        await Student.destroy({ where: {} });
        await Teacher.destroy({ where: {} });
        // Используем raw SQL для полной очистки с CASCADE
        await sequelize.query('TRUNCATE TABLE enrollments, lessons, courses, students, teachers RESTART IDENTITY CASCADE');
        console.log('✓ Данные очищены');

        // Создание преподавателей
        console.log('\n👨‍🏫 Создание преподавателей...');
        const teachers = await Teacher.bulkCreate([
            {
                name: 'Иванов Иван Иванович',
                email: 'ivanov@school.com',
                specialization: 'Программирование',
                phone: '+7-900-123-4567',
                hire_date: '2020-01-15'
            },
            {
                name: 'Петрова Мария Сергеевна',
                email: 'petrova@school.com',
                specialization: 'Математика',
                phone: '+7-900-234-5678',
                hire_date: '2019-03-20'
            },
            {
                name: 'Сидоров Алексей Петрович',
                email: 'sidorov@school.com',
                specialization: 'Английский язык',
                phone: '+7-900-345-6789',
                hire_date: '2021-06-10'
            },
            {
                name: 'Козлова Елена Викторовна',
                email: 'kozlova@school.com',
                specialization: 'Дизайн',
                phone: '+7-900-456-7890',
                hire_date: '2022-02-01'
            },
            {
                name: 'Морозов Дмитрий Александрович',
                email: 'morozov@school.com',
                specialization: 'Маркетинг',
                phone: '+7-900-567-8901',
                hire_date: '2021-09-15'
            }
        ]);
        console.log(`✓ Создано ${teachers.length} преподавателей`);

        // Создание курсов
        console.log('\n📚 Создание курсов...');
        const courses = await Course.bulkCreate([
            {
                name: 'Основы программирования на Python',
                description: 'Изучение основ Python для начинающих. Курс включает работу с переменными, циклами, функциями, ООП и работу с библиотеками.',
                teacher_id: teachers[0].id,
                duration_hours: 40,
                price: 15000.00,
                start_date: '2024-01-15',
                end_date: '2024-03-15'
            },
            {
                name: 'Высшая математика',
                description: 'Курс по высшей математике для студентов. Изучение матриц, производных, интегралов и дифференциальных уравнений.',
                teacher_id: teachers[1].id,
                duration_hours: 60,
                price: 20000.00,
                start_date: '2024-01-20',
                end_date: '2024-04-20'
            },
            {
                name: 'Английский язык для начинающих',
                description: 'Базовый курс английского языка. Грамматика, лексика, разговорная практика.',
                teacher_id: teachers[2].id,
                duration_hours: 50,
                price: 12000.00,
                start_date: '2024-02-01',
                end_date: '2024-04-30'
            },
            {
                name: 'Web-разработка',
                description: 'Создание современных веб-приложений. HTML, CSS, JavaScript, React, Node.js.',
                teacher_id: teachers[0].id,
                duration_hours: 80,
                price: 25000.00,
                start_date: '2024-02-10',
                end_date: '2024-05-10'
            },
            {
                name: 'UI/UX Дизайн',
                description: 'Проектирование пользовательских интерфейсов. Figma, Adobe XD, принципы дизайна.',
                teacher_id: teachers[3].id,
                duration_hours: 45,
                price: 18000.00,
                start_date: '2024-02-15',
                end_date: '2024-04-15'
            },
            {
                name: 'Цифровой маркетинг',
                description: 'Стратегии продвижения в интернете. SEO, SMM, контекстная реклама, аналитика.',
                teacher_id: teachers[4].id,
                duration_hours: 55,
                price: 22000.00,
                start_date: '2024-03-01',
                end_date: '2024-05-15'
            },
            {
                name: 'JavaScript: от основ к продвинутому',
                description: 'Глубокое изучение JavaScript. ES6+, асинхронность, работа с DOM, паттерны проектирования.',
                teacher_id: teachers[0].id,
                duration_hours: 70,
                price: 23000.00,
                start_date: '2024-03-10',
                end_date: '2024-06-10'
            },
            {
                name: 'Математический анализ',
                description: 'Углубленный курс математического анализа. Пределы, производные, интегралы, ряды.',
                teacher_id: teachers[1].id,
                duration_hours: 65,
                price: 21000.00,
                start_date: '2024-03-15',
                end_date: '2024-06-15'
            }
        ]);
        console.log(`✓ Создано ${courses.length} курсов`);

        // Создание уроков
        console.log('\n📖 Создание уроков...');
        const lessons = await Lesson.bulkCreate([
            // Уроки для курса "Основы программирования на Python" (course_id: 1)
            { course_id: courses[0].id, title: 'Введение в Python', content: 'Знакомство с языком программирования Python. Установка и настройка окружения. Первая программа.', lesson_order: 1, duration_minutes: 90, lesson_date: '2024-01-15' },
            { course_id: courses[0].id, title: 'Переменные и типы данных', content: 'Изучение базовых типов данных в Python: числа, строки, списки, словари, кортежи.', lesson_order: 2, duration_minutes: 90, lesson_date: '2024-01-22' },
            { course_id: courses[0].id, title: 'Условные операторы', content: 'Работа с if-else конструкциями. Логические операторы. Вложенные условия.', lesson_order: 3, duration_minutes: 90, lesson_date: '2024-01-29' },
            { course_id: courses[0].id, title: 'Циклы', content: 'Изучение циклов for и while. Управление циклом: break, continue.', lesson_order: 4, duration_minutes: 90, lesson_date: '2024-02-05' },
            { course_id: courses[0].id, title: 'Функции', content: 'Создание и использование функций. Параметры и аргументы. Возврат значений.', lesson_order: 5, duration_minutes: 90, lesson_date: '2024-02-12' },
            { course_id: courses[0].id, title: 'Работа с файлами', content: 'Чтение и запись файлов. Обработка исключений при работе с файлами.', lesson_order: 6, duration_minutes: 90, lesson_date: '2024-02-19' },
            { course_id: courses[0].id, title: 'ООП в Python', content: 'Классы и объекты. Наследование, инкапсуляция, полиморфизм.', lesson_order: 7, duration_minutes: 90, lesson_date: '2024-02-26' },
            { course_id: courses[0].id, title: 'Работа с библиотеками', content: 'Установка пакетов через pip. Использование популярных библиотек: requests, pandas.', lesson_order: 8, duration_minutes: 90, lesson_date: '2024-03-05' },

            // Уроки для курса "Высшая математика" (course_id: 2)
            { course_id: courses[1].id, title: 'Матрицы и определители', content: 'Основы линейной алгебры. Операции с матрицами. Вычисление определителей.', lesson_order: 1, duration_minutes: 90, lesson_date: '2024-01-20' },
            { course_id: courses[1].id, title: 'Производные', content: 'Дифференциальное исчисление. Правила дифференцирования. Производные сложных функций.', lesson_order: 2, duration_minutes: 90, lesson_date: '2024-01-27' },
            { course_id: courses[1].id, title: 'Интегралы', content: 'Интегральное исчисление. Неопределенные и определенные интегралы. Методы интегрирования.', lesson_order: 3, duration_minutes: 90, lesson_date: '2024-02-03' },
            { course_id: courses[1].id, title: 'Дифференциальные уравнения', content: 'Решение дифференциальных уравнений первого и второго порядка.', lesson_order: 4, duration_minutes: 90, lesson_date: '2024-02-10' },
            { course_id: courses[1].id, title: 'Ряды', content: 'Числовые и степенные ряды. Признаки сходимости. Разложение функций в ряд.', lesson_order: 5, duration_minutes: 90, lesson_date: '2024-02-17' },

            // Уроки для курса "Английский язык для начинающих" (course_id: 3)
            { course_id: courses[2].id, title: 'Алфавит и произношение', content: 'Изучение английского алфавита. Правила произношения звуков.', lesson_order: 1, duration_minutes: 60, lesson_date: '2024-02-01' },
            { course_id: courses[2].id, title: 'Базовые фразы и приветствия', content: 'Основные фразы для общения. Приветствия, прощания, знакомство.', lesson_order: 2, duration_minutes: 60, lesson_date: '2024-02-08' },
            { course_id: courses[2].id, title: 'Глагол to be', content: 'Спряжение глагола to be. Утвердительные, отрицательные и вопросительные предложения.', lesson_order: 3, duration_minutes: 60, lesson_date: '2024-02-15' },
            { course_id: courses[2].id, title: 'Настоящее время (Present Simple)', content: 'Образование и использование Present Simple. Частотные наречия.', lesson_order: 4, duration_minutes: 60, lesson_date: '2024-02-22' },
            { course_id: courses[2].id, title: 'Множественное число существительных', content: 'Правила образования множественного числа. Исключения.', lesson_order: 5, duration_minutes: 60, lesson_date: '2024-03-01' },
            { course_id: courses[2].id, title: 'Притяжательный падеж', content: 'Образование притяжательного падежа. Использование в речи.', lesson_order: 6, duration_minutes: 60, lesson_date: '2024-03-08' },

            // Уроки для курса "Web-разработка" (course_id: 4)
            { course_id: courses[3].id, title: 'HTML основы', content: 'Структура HTML документа. Теги, атрибуты, семантика.', lesson_order: 1, duration_minutes: 120, lesson_date: '2024-02-10' },
            { course_id: courses[3].id, title: 'CSS стилизация', content: 'Селекторы, свойства, каскадность. Flexbox и Grid.', lesson_order: 2, duration_minutes: 120, lesson_date: '2024-02-17' },
            { course_id: courses[3].id, title: 'JavaScript основы', content: 'Переменные, функции, события. Работа с DOM.', lesson_order: 3, duration_minutes: 120, lesson_date: '2024-02-24' },
            { course_id: courses[3].id, title: 'React: компоненты и состояние', content: 'Создание компонентов. Хуки useState и useEffect.', lesson_order: 4, duration_minutes: 120, lesson_date: '2024-03-03' },
            { course_id: courses[3].id, title: 'Node.js и Express', content: 'Создание сервера на Node.js. Роутинг, middleware, работа с БД.', lesson_order: 5, duration_minutes: 120, lesson_date: '2024-03-10' },
            { course_id: courses[3].id, title: 'Работа с API', content: 'REST API. Fetch, Axios. Создание и использование API.', lesson_order: 6, duration_minutes: 120, lesson_date: '2024-03-17' },

            // Уроки для курса "UI/UX Дизайн" (course_id: 5)
            { course_id: courses[4].id, title: 'Основы дизайна', content: 'Принципы дизайна. Композиция, цвет, типографика.', lesson_order: 1, duration_minutes: 90, lesson_date: '2024-02-15' },
            { course_id: courses[4].id, title: 'Работа в Figma', content: 'Интерфейс Figma. Создание макетов, компонентов, стилей.', lesson_order: 2, duration_minutes: 90, lesson_date: '2024-02-22' },
            { course_id: courses[4].id, title: 'Прототипирование', content: 'Создание интерактивных прототипов. Анимации и переходы.', lesson_order: 3, duration_minutes: 90, lesson_date: '2024-03-01' },
            { course_id: courses[4].id, title: 'User Experience', content: 'Исследование пользователей. Создание user personas и user journeys.', lesson_order: 4, duration_minutes: 90, lesson_date: '2024-03-08' },

            // Уроки для курса "Цифровой маркетинг" (course_id: 6)
            { course_id: courses[5].id, title: 'Введение в маркетинг', content: 'Основы цифрового маркетинга. Каналы продвижения.', lesson_order: 1, duration_minutes: 90, lesson_date: '2024-03-01' },
            { course_id: courses[5].id, title: 'SEO оптимизация', content: 'Поисковая оптимизация. Ключевые слова, мета-теги, внутренняя перелинковка.', lesson_order: 2, duration_minutes: 90, lesson_date: '2024-03-08' },
            { course_id: courses[5].id, title: 'SMM стратегии', content: 'Продвижение в социальных сетях. Контент-план, работа с аудиторией.', lesson_order: 3, duration_minutes: 90, lesson_date: '2024-03-15' },
            { course_id: courses[5].id, title: 'Контекстная реклама', content: 'Google Ads, Яндекс.Директ. Настройка кампаний, оптимизация.', lesson_order: 4, duration_minutes: 90, lesson_date: '2024-03-22' },
            { course_id: courses[5].id, title: 'Аналитика и метрики', content: 'Google Analytics, Яндекс.Метрика. Отслеживание конверсий.', lesson_order: 5, duration_minutes: 90, lesson_date: '2024-03-29' }
        ]);
        console.log(`✓ Создано ${lessons.length} уроков`);

        // Создание студентов
        console.log('\n👨‍🎓 Создание студентов...');
        const students = await Student.bulkCreate([
            {
                name: 'Александр Попов',
                email: 'alex@student.com',
                phone: '+7-900-111-2222',
                birth_date: '2005-05-15',
                registration_date: '2023-09-01'
            },
            {
                name: 'Смирнова Анна',
                email: 'smirnova@student.com',
                phone: '+7-900-222-3333',
                birth_date: '2004-08-20',
                registration_date: '2023-08-15'
            },
            {
                name: 'Козлов Дмитрий',
                email: 'kozlov@student.com',
                phone: '+7-900-333-4444',
                birth_date: '2005-03-10',
                registration_date: '2023-09-10'
            },
            {
                name: 'Морозова Елена',
                email: 'morozova@student.com',
                phone: '+7-900-444-5555',
                birth_date: '2004-11-25',
                registration_date: '2023-08-20'
            },
            {
                name: 'Новиков Сергей',
                email: 'novikov@student.com',
                phone: '+7-900-555-6666',
                birth_date: '2005-01-30',
                registration_date: '2023-09-05'
            },
            {
                name: 'Волков Игорь',
                email: 'volkov@student.com',
                phone: '+7-900-666-7777',
                birth_date: '2004-07-12',
                registration_date: '2023-10-01'
            },
            {
                name: 'Лебедева Ольга',
                email: 'lebedeva@student.com',
                phone: '+7-900-777-8888',
                birth_date: '2005-02-18',
                registration_date: '2023-10-05'
            },
            {
                name: 'Соколов Павел',
                email: 'sokolov@student.com',
                phone: '+7-900-888-9999',
                birth_date: '2004-09-22',
                registration_date: '2023-10-10'
            },
            {
                name: 'Попова Мария',
                email: 'popova@student.com',
                phone: '+7-900-999-0000',
                birth_date: '2005-04-05',
                registration_date: '2023-10-15'
            },
            {
                name: 'Федоров Артем',
                email: 'fedorov@student.com',
                phone: '+7-900-000-1111',
                birth_date: '2004-12-08',
                registration_date: '2023-10-20'
            }
        ]);
        console.log(`✓ Создано ${students.length} студентов`);

        // Создание записей на курсы
        console.log('\n📝 Создание записей студентов на курсы...');
        const enrollments = await Enrollment.bulkCreate([
            // Белялов Таир
            { student_id: students[0].id, course_id: courses[0].id, status: 'active', grade: null },
            { student_id: students[0].id, course_id: courses[3].id, status: 'active', grade: null },
            { student_id: students[0].id, course_id: courses[6].id, status: 'active', grade: 88.5 },

            // Смирнова Анна
            { student_id: students[1].id, course_id: courses[1].id, status: 'active', grade: 85.5 },
            { student_id: students[1].id, course_id: courses[2].id, status: 'completed', grade: 92.0 },
            { student_id: students[1].id, course_id: courses[4].id, status: 'active', grade: null },

            // Козлов Дмитрий
            { student_id: students[2].id, course_id: courses[0].id, status: 'active', grade: null },
            { student_id: students[2].id, course_id: courses[3].id, status: 'active', grade: 75.0 },

            // Морозова Елена
            { student_id: students[3].id, course_id: courses[2].id, status: 'active', grade: null },
            { student_id: students[3].id, course_id: courses[4].id, status: 'active', grade: null },
            { student_id: students[3].id, course_id: courses[5].id, status: 'active', grade: null },

            // Новиков Сергей
            { student_id: students[4].id, course_id: courses[3].id, status: 'active', grade: null },
            { student_id: students[4].id, course_id: courses[6].id, status: 'active', grade: null },

            // Волков Игорь
            { student_id: students[5].id, course_id: courses[0].id, status: 'active', grade: 90.0 },
            { student_id: students[5].id, course_id: courses[1].id, status: 'active', grade: null },

            // Лебедева Ольга
            { student_id: students[6].id, course_id: courses[2].id, status: 'completed', grade: 95.5 },
            { student_id: students[6].id, course_id: courses[4].id, status: 'active', grade: null },

            // Соколов Павел
            { student_id: students[7].id, course_id: courses[3].id, status: 'active', grade: 82.0 },
            { student_id: students[7].id, course_id: courses[6].id, status: 'active', grade: null },

            // Попова Мария
            { student_id: students[8].id, course_id: courses[4].id, status: 'active', grade: null },
            { student_id: students[8].id, course_id: courses[5].id, status: 'active', grade: null },

            // Федоров Артем
            { student_id: students[9].id, course_id: courses[1].id, status: 'active', grade: 87.0 },
            { student_id: students[9].id, course_id: courses[7].id, status: 'active', grade: null }
        ]);
        console.log(`✓ Создано ${enrollments.length} записей на курсы`);

        console.log('\n✅ База данных успешно заполнена!');
        console.log('\n📊 Статистика:');
        console.log(`   Преподавателей: ${teachers.length}`);
        console.log(`   Курсов: ${courses.length}`);
        console.log(`   Уроков: ${lessons.length}`);
        console.log(`   Студентов: ${students.length}`);
        console.log(`   Записей на курсы: ${enrollments.length}`);

    } catch (error) {
        console.error('❌ Ошибка при заполнении базы данных:', error);
    } finally {
        await sequelize.close();
        console.log('\n🔌 Соединение с базой данных закрыто');
    }
}

// Запуск скрипта
seedDatabase();

