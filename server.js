const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка подключения к PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1',
  database: process.env.DB_NAME || 'online_school'
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Проверка подключения к БД
pool.connect((err, client, release) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.stack);
  } else {
    console.log('✓ Успешное подключение к PostgreSQL');
    release();
  }
});

// API Routes

// Получить всех студентов
app.get('/api/students', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении студентов' });
  }
});

// Получить всех преподавателей
app.get('/api/teachers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM teachers ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении преподавателей' });
  }
});

// Получить все курсы с информацией о преподавателях
app.get('/api/courses', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, t.name as teacher_name, t.specialization
      FROM courses c
      LEFT JOIN teachers t ON c.teacher_id = t.id
      ORDER BY c.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении курсов' });
  }
});

// Получить уроки по ID курса
app.get('/api/lessons/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await pool.query(
      'SELECT * FROM lessons WHERE course_id = $1 ORDER BY lesson_order',
      [courseId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении уроков' });
  }
});

// Получить все записи на курсы с подробной информацией
app.get('/api/enrollments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.id, 
        e.enrollment_date, 
        e.status, 
        e.grade,
        s.name as student_name, 
        s.email as student_email,
        c.name as course_name,
        c.price
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      JOIN courses c ON e.course_id = c.id
      ORDER BY e.enrollment_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении записей' });
  }
});

// Добавить нового студента
app.post('/api/students', async (req, res) => {
  try {
    const { name, email, phone, birth_date } = req.body;
    const result = await pool.query(
      'INSERT INTO students (name, email, phone, birth_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, birth_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при добавлении студента' });
  }
});

// Записать студента на курс
app.post('/api/enrollments', async (req, res) => {
  try {
    const { student_id, course_id } = req.body;
    const result = await pool.query(
      'INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING *',
      [student_id, course_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при записи на курс' });
  }
});

// Получить статистику
app.get('/api/stats', async (req, res) => {
  try {
    const studentsCount = await pool.query('SELECT COUNT(*) FROM students');
    const teachersCount = await pool.query('SELECT COUNT(*) FROM teachers');
    const coursesCount = await pool.query('SELECT COUNT(*) FROM courses');
    const enrollmentsCount = await pool.query('SELECT COUNT(*) FROM enrollments');

    res.json({
      students: parseInt(studentsCount.rows[0].count),
      teachers: parseInt(teachersCount.rows[0].count),
      courses: parseInt(coursesCount.rows[0].count),
      enrollments: parseInt(enrollmentsCount.rows[0].count)
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
