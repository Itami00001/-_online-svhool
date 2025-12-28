/**
 * @swagger
 * components:
 *   schemas:
 *     Lesson:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         course_id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Введение"
 *         content:
 *           type: string
 *           example: "Содержание урока..."
 *         lesson_order:
 *           type: integer
 *           example: 1
 *         duration_minutes:
 *           type: integer
 *           example: 45
 *         lesson_date:
 *           type: string
 *           format: date
 *           example: "2024-02-01"
 */

module.exports = app => {
    const lessons = require("../controllers/lesson.controller.js");

    var router = require("express").Router();

    /**
     * @swagger
     * /api/lessons:
     *   post:
     *     summary: Создать новый урок
     *     tags: [Lessons]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Lesson'
     *     responses:
     *       201:
     *         description: Урок успешно создан
     */
    // Create a new Lesson
    router.post("/", lessons.create);

    /**
     * @swagger
     * /api/lessons:
     *   get:
     *     summary: Получить список всех уроков
     *     tags: [Lessons]
     *     responses:
     *       200:
     *         description: Список уроков
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Lesson'
     */
    // Retrieve all Lessons
    router.get("/", lessons.findAll);

    /**
     * @swagger
     * /api/lessons/paged:
     *   get:
     *     summary: Получить постраничный список уроков
     *     tags: [Lessons]
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
     *         description: Постраничный список уроков
     */
    router.get("/paged", lessons.findAllPaged);

    /**
     * @swagger
     * /api/lessons/{id}:
     *   get:
     *     summary: Получить урок по ID
     *     tags: [Lessons]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID урока
     *     responses:
     *       200:
     *         description: Данные урока
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Lesson'
     *       404:
     *         description: Урок не найден
     */
    // Retrieve a single Lesson with id
    router.get("/:id", lessons.findOne);

    /**
     * @swagger
     * /api/lessons/{id}:
     *   put:
     *     summary: Обновить данные урока
     *     tags: [Lessons]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID урока
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Lesson'
     *     responses:
     *       200:
     *         description: Данные урока обновлены
     *       404:
     *         description: Урок не найден
     */
    // Update a Lesson with id
    router.put("/:id", lessons.update);

    /**
     * @swagger
     * /api/lessons/{id}:
     *   delete:
     *     summary: Удалить урок
     *     tags: [Lessons]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID урока
     *     responses:
     *       200:
     *         description: Урок успешно удален
     *       404:
     *         description: Урок не найден
     */
    // Delete a Lesson with id
    router.delete("/:id", lessons.delete);

    /**
     * @swagger
     * /api/lessons:
     *   delete:
     *     summary: Удалить все уроки
     *     tags: [Lessons]
     *     responses:
     *       200:
     *         description: Все уроки удалены
     */
    // Delete all Lessons
    router.delete("/", lessons.deleteAll);

    app.use('/api/lessons', router);
};
