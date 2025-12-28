/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Основы программирования"
 *         description:
 *           type: string
 *           example: "Вводный курс по программированию"
 *         teacher_id:
 *           type: integer
 *           example: 1
 *         duration_hours:
 *           type: integer
 *           example: 40
 *         price:
 *           type: number
 *           format: float
 *           example: 99.99
 *         start_date:
 *           type: string
 *           format: date
 *           example: "2024-02-01"
 *         end_date:
 *           type: string
 *           format: date
 *           example: "2024-05-01"
 */

module.exports = app => {
    const courses = require("../controllers/course.controller.js");

    var router = require("express").Router();

    /**
     * @swagger
     * /api/courses:
     *   post:
     *     summary: Создать новый курс
     *     tags: [Courses]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Course'
     *     responses:
     *       201:
     *         description: Курс успешно создан
     */
    // Create a new Course
    router.post("/", courses.create);

    /**
     * @swagger
     * /api/courses:
     *   get:
     *     summary: Получить список всех курсов
     *     tags: [Courses]
     *     responses:
     *       200:
     *         description: Список курсов
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Course'
     */
    // Retrieve all Courses
    router.get("/", courses.findAll);

    /**
     * @swagger
     * /api/courses/paged:
     *   get:
     *     summary: Получить постраничный список курсов
     *     tags: [Courses]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Номер страницы
     *       - in: query
     *         name: size
     *         schema:
     *           type: integer
     *         description: Размер страницы
     *     responses:
     *       200:
     *         description: Постраничный список курсов
     */
    router.get("/paged", courses.findAllPaged);

    /**
     * @swagger
     * /api/courses/{id}:
     *   get:
     *     summary: Получить курс по ID
     *     tags: [Courses]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID курса
     *     responses:
     *       200:
     *         description: Данные курса
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Course'
     *       404:
     *         description: Курс не найден
     */
    // Retrieve a single Course with id
    router.get("/:id", courses.findOne);

    // Get teacher name for course (positional parameters)
    router.get("/:id/teachername", courses.getTeacherName);

    // Get teacher name for course (named parameters)
    router.get("/:id/teachername-named", courses.getTeacherNameNamed);

    // Get full teacher info for course (named parameters)
    router.get("/:id/teacher", courses.getTeacher);

    // Get full teacher info for course (string substitution)
    router.get("/:id/teacher-sub", courses.getTeacherSubstitution);

    /**
     * @swagger
     * /api/courses/{id}:
     *   put:
     *     summary: Обновить данные курса
     *     tags: [Courses]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID курса
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Course'
     *     responses:
     *       200:
     *         description: Данные курса обновлены
     *       404:
     *         description: Курс не найден
     */
    // Update a Course with id
    router.put("/:id", courses.update);

    /**
     * @swagger
     * /api/courses/{id}:
     *   delete:
     *     summary: Удалить курс
     *     tags: [Courses]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID курса
     *     responses:
     *       200:
     *         description: Курс успешно удален
     *       404:
     *         description: Курс не найден
     */
    // Delete a Course with id
    router.delete("/:id", courses.delete);

    /**
     * @swagger
     * /api/courses:
     *   delete:
     *     summary: Удалить все курсы
     *     tags: [Courses]
     *     responses:
     *       200:
     *         description: Все курсы удалены
     */
    // Delete all Courses
    router.delete("/", courses.deleteAll);

    app.use('/api/courses', router);
};