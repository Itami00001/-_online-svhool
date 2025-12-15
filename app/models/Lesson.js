module.exports = (sequelize, Sequelize) => {
    const Lesson = sequelize.define('Lesson', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        course_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING(150),
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        lesson_order: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        duration_minutes: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        lesson_date: {
            type: Sequelize.DATEONLY,
            allowNull: true
        }
    }, {
        tableName: 'lessons',
        timestamps: false
    });
    return Lesson;
};
