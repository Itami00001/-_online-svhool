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
// API Routes
require("./app/routes/student.routes")(app);
require("./app/routes/teacher.routes")(app);
require("./app/routes/course.routes")(app);
require("./app/routes/lesson.routes")(app);
require("./app/routes/enrollment.routes")(app);

// Получить статистику (оставлено в server.js так как это агрегирующий запрос)
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

// Запуск сервера с синхронизацией базы данных
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📱 Откройте http://localhost:${PORT} в браузере`);
  });
}).catch(err => {
  console.error('Ошибка синхронизации с базой данных:', err);
});
