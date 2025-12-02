const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Enrollment = sequelize.define('Enrollment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'students',
            key: 'id'
        }
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'courses',
            key: 'id'
        }
    },
    enrollment_date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'active'
    },
    grade: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    }
}, {
    tableName: 'enrollments',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['student_id', 'course_id']
        }
    ]
});

module.exports = Enrollment;
