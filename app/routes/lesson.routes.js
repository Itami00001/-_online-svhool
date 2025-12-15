module.exports = app => {
    const lessons = require("../controllers/lesson.controller.js");

    var router = require("express").Router();

    // Create a new Lesson
    router.post("/", lessons.create);

    // Retrieve all Lessons
    router.get("/", lessons.findAll);

    // Retrieve a single Lesson with id
    router.get("/:id", lessons.findOne);

    // Update a Lesson with id
    router.put("/:id", lessons.update);

    // Delete a Lesson with id
    router.delete("/:id", lessons.delete);

    // Delete all Lessons
    router.delete("/", lessons.deleteAll);

    app.use('/api/lessons', router);
};
