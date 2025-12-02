# Sequelize ORM Models

## 📋 Обзор

Проект использует **Sequelize ORM** для работы с базой данных PostgreSQL вместо raw SQL запросов.

## 🗂️ Модели

### Student (Студент)
- `id`, `name`, `email` (unique), `phone`, `birth_date`, `registration_date`
- Связи: hasMany → Enrollment, belongsToMany → Course

### Teacher (Преподаватель)
- `id`, `name`, `email` (unique), `specialization`, `phone`, `hire_date`
- Связи: hasMany → Course

### Course (Курс)
- `id`, `name`, `description`, `teacher_id`, `duration_hours`, `price`, `start_date`, `end_date`
- Связи: belongsTo → Teacher, hasMany → Lesson, hasMany → Enrollment

### Lesson (Урок)
- `id`, `course_id`, `title`, `content`, `lesson_order`, `duration_minutes`, `lesson_date`
- Связи: belongsTo → Course

### Enrollment (Запись на курс)
- `id`, `student_id`, `course_id`, `enrollment_date`, `status`, `grade`
- Связи: belongsTo → Student, belongsTo → Course
- Индекс: UNIQUE(student_id, course_id)

## 🔗 Связи

```
Teacher (1) ──→ (N) Course
Course (1) ──→ (N) Lesson
Student (N) ←──→ (N) Course (через Enrollment)
```

## 💻 Примеры использования

### Получение данных с JOIN
```javascript
const courses = await Course.findAll({
  include: [{
    model: Teacher,
    as: 'teacher',
    attributes: ['name', 'specialization']
  }]
});
```

### Создание записи
```javascript
const student = await Student.create({
  name: 'Иван Иванов',
  email: 'ivan@example.com',
  phone: '+7-900-123-4567'
});
```

### Подсчет записей
```javascript
const count = await Student.count();
```

## ✨ Преимущества

- ✅ Защита от SQL-инъекций
- ✅ Валидация данных (email, unique)
- ✅ Читаемый код
- ✅ Автоматические JOIN запросы
- ✅ Типизация данных

## 📚 Документация

Официальная документация: https://sequelize.org/docs/v6/
