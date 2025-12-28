/**
 * @swagger
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         student_id:
 *           type: integer
 *           example: 1
 *         course_id:
 *           type: integer
 *           example: 1
 *         enrollment_date:
 *           type: string
 *           format: date
 *           example: "2024-02-01"
 *         status:
 *           type: string
 *           example: "active"
 *         grade:
 *           type: number
 *           format: float
 *           example: 4.5
 */

module.exports = app => {
    const enrollments = require("../controllers/enrollment.controller.js");

    var router = require("express").Router();

    /**
     * @swagger
     * /api/enrollments:
     *   post:
     *     summary: Создать новую запись о зачислении
     *     tags: [Enrollments]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Enrollment'
     *     responses:
     *       201:
     *         description: Запись успешно создана
     */
    // Create a new Enrollment
    router.post("/", enrollments.create);

    /**
     * @swagger
     * /api/enrollments:
     *   get:
     *     summary: Получить список всех зачислений
     *     tags: [Enrollments]
     *     responses:
     *       200:
     *         description: Список зачислений
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Enrollment'
     */
    // Retrieve all Enrollments
    router.get("/", enrollments.findAll);

    /**
     * @swagger
     * /api/enrollments/paged:
     *   get:
     *     summary: Получить постраничный список зачислений
     *     tags: [Enrollments]
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
     *         description: Постраничный список зачислений
     */
    router.get("/paged", enrollments.findAllPaged);

    /**
     * @swagger
     * /api/enrollments/{id}:
     *   get:
     *     summary: Получить зачисление по ID
     *     tags: [Enrollments]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID зачисления
     *     responses:
     *       200:
     *         description: Данные зачисления
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Enrollment'
     *       404:
     *         description: Зачисление не найдено
     */
    // Retrieve a single Enrollment with id
    router.get("/:id", enrollments.findOne);

    /**
     * @swagger
     * /api/enrollments/{id}:
     *   put:
     *     summary: Обновить данные зачисления
     *     tags: [Enrollments]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID зачисления
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Enrollment'
     *     responses:
     *       200:
     *         description: Данные зачисления обновлены
     *       404:
     *         description: Зачисление не найдено
     */
    // Update an Enrollment with id
    router.put("/:id", enrollments.update);

    /**
     * @swagger
     * /api/enrollments/{id}:
     *   delete:
     *     summary: Удалить зачисление
     *     tags: [Enrollments]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID зачисления
     *     responses:
     *       200:
     *         description: Зачисление успешно удалено
     *       404:
     *         description: Зачисление не найдено
     */
    // Delete an Enrollment with id
    router.delete("/:id", enrollments.delete);

    /**
     * @swagger
     * /api/enrollments:
     *   delete:
     *     summary: Удалить все зачисления
     *     tags: [Enrollments]
     *     responses:
     *       200:
     *         description: Все зачисления удалены
     */
    // Delete all Enrollments
    router.delete("/", enrollments.deleteAll);

    app.use('/api/enrollments', router);
};
