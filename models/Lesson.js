const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Lesson = sequelize.define('Lesson', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'courses',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    lesson_order: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    lesson_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, {
    tableName: 'lessons',
    timestamps: false
});

module.exports = Lesson;
