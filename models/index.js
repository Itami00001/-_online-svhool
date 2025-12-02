const sequelize = require('./database');
const Student = require('./Student');
const Teacher = require('./Teacher');
const Course = require('./Course');
const Lesson = require('./Lesson');
const Enrollment = require('./Enrollment');

// Определение связей между моделями

// Teacher - Course (One-to-Many)
Teacher.hasMany(Course, {
    foreignKey: 'teacher_id',
    as: 'courses'
});
Course.belongsTo(Teacher, {
    foreignKey: 'teacher_id',
    as: 'teacher'
});

// Course - Lesson (One-to-Many)
Course.hasMany(Lesson, {
    foreignKey: 'course_id',
    as: 'lessons'
});
Lesson.belongsTo(Course, {
    foreignKey: 'course_id',
    as: 'course'
});

// Student - Enrollment - Course (Many-to-Many through Enrollment)
Student.belongsToMany(Course, {
    through: Enrollment,
    foreignKey: 'student_id',
    otherKey: 'course_id',
    as: 'enrolledCourses'
});

Course.belongsToMany(Student, {
    through: Enrollment,
    foreignKey: 'course_id',
    otherKey: 'student_id',
    as: 'enrolledStudents'
});

// Direct associations for Enrollment
Student.hasMany(Enrollment, {
    foreignKey: 'student_id',
    as: 'enrollments'
});
Enrollment.belongsTo(Student, {
    foreignKey: 'student_id',
    as: 'student'
});

Course.hasMany(Enrollment, {
    foreignKey: 'course_id',
    as: 'enrollments'
});
Enrollment.belongsTo(Course, {
    foreignKey: 'course_id',
    as: 'course'
});

// Экспорт всех моделей и sequelize
module.exports = {
    sequelize,
    Student,
    Teacher,
    Course,
    Lesson,
    Enrollment
};
