const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    define: {
        underscored: true,  // преобразование camelCase в snake_case
        freezeTableName: true // сохраняет имена таблиц как в моделях
    },
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Student = require("./Student.js")(sequelize, Sequelize);
db.Teacher = require("./Teacher.js")(sequelize, Sequelize);
db.Course = require("./Course.js")(sequelize, Sequelize);
db.Lesson = require("./Lesson.js")(sequelize, Sequelize);
db.Enrollment = require("./Enrollment.js")(sequelize, Sequelize);

// Associations
// Teacher - Course
db.Teacher.hasMany(db.Course, { foreignKey: 'teacher_id', as: 'courses' });
db.Course.belongsTo(db.Teacher, { foreignKey: 'teacher_id', as: 'teacher' });

// Course - Lesson
db.Course.hasMany(db.Lesson, { foreignKey: 'course_id', as: 'lessons' });
db.Lesson.belongsTo(db.Course, { foreignKey: 'course_id', as: 'course' });

// Student - Enrollment - Course
// Many-to-Many through Enrollment
db.Student.belongsToMany(db.Course, {
    through: db.Enrollment,
    foreignKey: 'student_id',
    otherKey: 'course_id',
    as: 'enrolledCourses'
});
db.Course.belongsToMany(db.Student, {
    through: db.Enrollment,
    foreignKey: 'course_id',
    otherKey: 'student_id',
    as: 'enrolledStudents'
});

// Direct associations for Enrollment
db.Student.hasMany(db.Enrollment, { foreignKey: 'student_id', as: 'enrollments' });
db.Enrollment.belongsTo(db.Student, { foreignKey: 'student_id', as: 'student' });

db.Course.hasMany(db.Enrollment, { foreignKey: 'course_id', as: 'enrollments' });
db.Enrollment.belongsTo(db.Course, { foreignKey: 'course_id', as: 'course' });

module.exports = db;
