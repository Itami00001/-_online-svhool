const { Sequelize } = require('sequelize');
require('dotenv').config();

// Создание экземпляра Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME || 'online_school',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false, // Отключить логирование SQL запросов
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Проверка подключения
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✓ Sequelize: Успешное подключение к PostgreSQL');
    } catch (error) {
        console.error('✗ Sequelize: Ошибка подключения к базе данных:', error);
    }
};

testConnection();

module.exports = sequelize;
