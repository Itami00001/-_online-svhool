module.exports = app => {
    const enrollments = require("../controllers/enrollment.controller.js");

    var router = require("express").Router();

    // Create a new Enrollment
    router.post("/", enrollments.create);

    // Retrieve all Enrollments
    router.get("/", enrollments.findAll);

    // Retrieve a single Enrollment with id
    router.get("/:id", enrollments.findOne);

    // Update an Enrollment with id
    router.put("/:id", enrollments.update);

    // Delete an Enrollment with id
    router.delete("/:id", enrollments.delete);

    // Delete all Enrollments
    router.delete("/", enrollments.deleteAll);

    app.use('/api/enrollments', router);
};
