require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Online School API',
            version: '1.0.0',
            description: 'API для управления онлайн-школой'
        },
        servers: [
            {
                url: `http://localhost:${PORT || 8080}`,
            },
        ],
    },
    apis: ['./app/routes/*.routes.js'], // файлы с аннотациями
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.static('public'));

const db = require("./app/models");

// Register routes BEFORE database sync
require("./app/routes/student.routes")(app);
require("./app/routes/teacher.routes")(app);
require("./app/routes/course.routes")(app);
require("./app/routes/lesson.routes")(app);
require("./app/routes/enrollment.routes")(app);

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Stats route
app.get('/api/stats', async (req, res) => {
    try {
        const studentsCount = await db.Student.count();
        const teachersCount = await db.Teacher.count();
        const coursesCount = await db.Course.count();
        const enrollmentsCount = await db.Enrollment.count();

        res.json({
            students: studentsCount,
            teachers: teachersCount,
            courses: coursesCount,
            enrollments: enrollmentsCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при получении статистики' });
    }
});

// Test database connection
db.sequelize.authenticate()
    .then(() => {
        console.log("Database connection established successfully.");
        
        // Sync database and start server
        return db.sequelize.sync({ force: false });
    })
    .then(() => {
        console.log("Database synced successfully.");
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
            console.log(`Open http://localhost:${PORT} in browser`);
            console.log(`Swagger documentation: http://localhost:${PORT}/api-docs`);
        });
    })
    .catch((err) => {
        console.error("❌ Database connection failed!");
        console.error("Error message:", err.message);
        console.error("\nPlease check:");
        console.error("1. Is PostgreSQL running?");
        console.error("2. Are database credentials correct in .env file?");
        console.error("3. Does the database 'online_school' exist?");
        console.error("\nDefault connection settings:");
        console.error(`  Host: ${process.env.DB_HOST || 'localhost'}`);
        console.error(`  User: ${process.env.DB_USER || 'postgres'}`);
        console.error(`  Database: ${process.env.DB_NAME || 'online_school'}`);
        console.error("\nFull error:", err);
        process.exit(1);
    });