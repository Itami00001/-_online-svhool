module.exports = (sequelize, Sequelize) => {
    const Enrollment = sequelize.define('Enrollment', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        student_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        course_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        enrollment_date: {
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.NOW
        },
        status: {
            type: Sequelize.STRING(20),
            defaultValue: 'active'
        },
        grade: {
            type: Sequelize.DECIMAL(5, 2),
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
    return Enrollment;
};
