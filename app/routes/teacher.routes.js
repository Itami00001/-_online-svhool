/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Мария Петрова"
 *         email:
 *           type: string
 *           example: "maria@example.com"
 *         specialization:
 *           type: string
 *           example: "Математика"
 *         phone:
 *           type: string
 *           example: "+79001234567"
 *         hire_date:
 *           type: string
 *           format: date
 *           example: "2023-09-01"
 */

module.exports = app => {
    const teachers = require("../controllers/teacher.controller.js");

    var router = require("express").Router();

    /**
     * @swagger
     * /api/teachers:
     *   post:
     *     summary: Создать нового учителя
     *     tags: [Teachers]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Teacher'
     *     responses:
     *       201:
     *         description: Учитель успешно создан
     */
    // Create a new Teacher
    router.post("/", teachers.create);

    /**
     * @swagger
     * /api/teachers:
     *   get:
     *     summary: Получить список всех учителей
     *     tags: [Teachers]
     *     responses:
     *       200:
     *         description: Список учителей
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Teacher'
     */
    // Retrieve all Teachers
    router.get("/", teachers.findAll);

    /**
     * @swagger
     * /api/teachers/paged:
     *   get:
     *     summary: Получить постраничный список учителей
     *     tags: [Teachers]
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
     *         description: Постраничный список учителей
     */
    router.get("/paged", teachers.findAllPaged);

    /**
     * @swagger
     * /api/teachers/{id}:
     *   get:
     *     summary: Получить учителя по ID
     *     tags: [Teachers]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID учителя
     *     responses:
     *       200:
     *         description: Данные учителя
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Teacher'
     *       404:
     *         description: Учитель не найден
     */
    // Retrieve a single Teacher with id
    router.get("/:id", teachers.findOne);

    /**
     * @swagger
     * /api/teachers/{id}:
     *   put:
     *     summary: Обновить данные учителя
     *     tags: [Teachers]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID учителя
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Teacher'
     *     responses:
     *       200:
     *         description: Данные учителя обновлены
     *       404:
     *         description: Учитель не найден
     */
    // Update a Teacher with id
    router.put("/:id", teachers.update);

    /**
     * @swagger
     * /api/teachers/{id}:
     *   delete:
     *     summary: Удалить учителя
     *     tags: [Teachers]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID учителя
     *     responses:
     *       200:
     *         description: Учитель успешно удален
     *       404:
     *         description: Учитель не найден
     */
    // Delete a Teacher with id
    router.delete("/:id", teachers.delete);

    /**
     * @swagger
     * /api/teachers:
     *   delete:
     *     summary: Удалить всех учителей
     *     tags: [Teachers]
     *     responses:
     *       200:
     *         description: Все учителя удалены
     */
    // Delete all Teachers
    router.delete("/", teachers.deleteAll);

    app.use('/api/teachers', router);
};
