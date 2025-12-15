module.exports = (sequelize, Sequelize) => {
    const Student = sequelize.define('Student', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        birth_date: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        registration_date: {
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.NOW
        }
    }, {
        tableName: 'students',
        timestamps: false
    });
    return Student;
};
