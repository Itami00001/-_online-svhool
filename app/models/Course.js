module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define('Course', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(150),
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        teacher_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            // references handled by associations in index.js
        },
        duration_hours: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        },
        start_date: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        end_date: {
            type: Sequelize.DATEONLY,
            allowNull: true
        }
    }, {
        tableName: 'courses',
        timestamps: false
    });
    return Course;
};
