module.exports = (sequelize, Sequelize) => {
    const Teacher = sequelize.define('Teacher', {
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
        specialization: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        phone: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        hire_date: {
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.NOW
        }
    }, {
        tableName: 'teachers',
        timestamps: false
    });
    return Teacher;
};
