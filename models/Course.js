const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'teachers',
            key: 'id'
        }
    },
    duration_hours: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, {
    tableName: 'courses',
    timestamps: false
});

module.exports = Course;
