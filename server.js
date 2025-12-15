require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Импорт моделей Sequelize
const { sequelize, Student, Teacher, Course, Lesson, Enrollment } = require('./app/models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes с использованием Sequelize

// Получить всех студентов
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.findAll({
      order: [['id', 'ASC']]
    });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении студентов' });
  }
});

// Получить всех преподавателей
app.get('/api/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      order: [['id', 'ASC']]
    });
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении преподавателей' });
  }
});

// Получить все курсы с информацией о преподавателях
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{
        model: Teacher,
        as: 'teacher',
        attributes: ['name', 'specialization']
      }],
      order: [['id', 'ASC']]
    });

    // Преобразование для совместимости с фронтендом
    const formattedCourses = courses.map(course => ({
      ...course.toJSON(),
      teacher_name: course.teacher ? course.teacher.name : null,
      specialization: course.teacher ? course.teacher.specialization : null
    }));

    res.json(formattedCourses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении курсов' });
  }
});

// Получить уроки по ID курса
app.get('/api/lessons/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await Lesson.findAll({
      where: { course_id: courseId },
      order: [['lesson_order', 'ASC']]
    });
    res.json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении уроков' });
  }
});

// Получить все записи на курсы с подробной информацией
app.get('/api/enrollments', async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['name', 'price']
        }
      ],
      order: [['enrollment_date', 'DESC']]
    });

    // Преобразование для совместимости с фронтендом
    const formattedEnrollments = enrollments.map(enrollment => ({
      id: enrollment.id,
      enrollment_date: enrollment.enrollment_date,
      status: enrollment.status,
      grade: enrollment.grade,
      student_name: enrollment.student.name,
      student_email: enrollment.student.email,
      course_name: enrollment.course.name,
      price: enrollment.course.price
    }));

    res.json(formattedEnrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении записей' });
  }
});

// Добавить нового студента
app.post('/api/students', async (req, res) => {
  try {
    const { name, email, phone, birth_date } = req.body;
    const student = await Student.create({
      name,
      email,
      phone,
      birth_date
    });
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при добавлении студента' });
  }
});

// Записать студента на курс
app.post('/api/enrollments', async (req, res) => {
  try {
    const { student_id, course_id } = req.body;
    const enrollment = await Enrollment.create({
      student_id,
      course_id
    });
    res.status(201).json(enrollment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при записи на курс' });
  }
});

// Получить статистику
app.get('/api/stats', async (req, res) => {
  try {
    const studentsCount = await Student.count();
    const teachersCount = await Teacher.count();
    const coursesCount = await Course.count();
    const enrollmentsCount = await Enrollment.count();

    res.json({
      students: studentsCount,
      teachers: teachersCount,
      courses: coursesCount,
      enrollments: enrollmentsCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении статистики' });
  }
});

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📱 Откройте http://localhost:${PORT} в браузере`);
});
