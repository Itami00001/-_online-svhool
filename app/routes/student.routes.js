/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Иван Иванов"
 *         email:
 *           type: string
 *           example: "ivan@example.com"
 *         phone:
 *           type: string
 *           example: "+79001234567"
 *         birth_date:
 *           type: string
 *           format: date
 *           example: "2000-01-01"
 *         registration_date:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 */

module.exports = app => {
    const students = require("../controllers/student.controller.js");

    var router = require("express").Router();

    /**
     * @swagger
     * /api/students:
     *   post:
     *     summary: Создать нового студента
     *     tags: [Students]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Student'
     *     responses:
     *       201:
     *         description: Студент успешно создан
     */
    // Create a new Student
    router.post("/", students.create);

    /**
     * @swagger
     * /api/students:
     *   get:
     *     summary: Получить список всех студентов
     *     tags: [Students]
     *     responses:
     *       200:
     *         description: Успешный запрос. Возвращает массив студентов.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Student'
     */
    // Retrieve all Students
    router.get("/", students.findAll);

    /**
     * @swagger
     * /api/students/paged:
     *   get:
     *     summary: Получить постраничный список студентов
     *     tags: [Students]
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
     *         description: Постраничный список студентов
     */
    router.get("/paged", students.findAllPaged);

    /**
     * @swagger
     * /api/students/{id}:
     *   get:
     *     summary: Получить студента по ID
     *     tags: [Students]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID студента
     *     responses:
     *       200:
     *         description: Успешный запрос. Возвращает данные студента.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Student'
     *       404:
     *         description: Студент не найден
     */
    // Retrieve a single Student with id
    router.get("/:id", students.findOne);

    /**
     * @swagger
     * /api/students/{id}:
     *   put:
     *     summary: Обновить данные студента
     *     tags: [Students]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID студента
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Student'
     *     responses:
     *       200:
     *         description: Данные студента обновлены
     *       404:
     *         description: Студент не найден
     */
    // Update a Student with id
    router.put("/:id", students.update);

    /**
     * @swagger
     * /api/students/{id}:
     *   delete:
     *     summary: Удалить студента
     *     tags: [Students]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID студента
     *     responses:
     *       200:
     *         description: Студент успешно удален
     *       404:
     *         description: Студент не найден
     */
    // Delete a Student with id
    router.delete("/:id", students.delete);

    /**
     * @swagger
     * /api/students:
     *   delete:
     *     summary: Удалить всех студентов
     *     tags: [Students]
     *     responses:
     *       200:
     *         description: Все студенты удалены
     */
    // Delete all Students
    router.delete("/", students.deleteAll);

    app.use('/api/students', router);
};