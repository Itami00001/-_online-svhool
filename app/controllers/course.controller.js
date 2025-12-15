const db = require("../models");
const Course = db.Course;
const Teacher = db.Teacher;
const Op = db.Sequelize.Op;

// Create and Save a new Course
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Course
    const course = {
        name: req.body.name,
        description: req.body.description,
        duration_hours: req.body.duration_hours,
        price: req.body.price,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        teacher_id: req.body.teacher_id
    };

    // Save Course in the database
    Course.create(course)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Course."
            });
        });
};

// Retrieve all Courses from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

    Course.findAll({
        where: condition,
        include: [{
            model: Teacher,
            as: 'teacher',
            attributes: ['name', 'specialization']
        }],
        order: [['id', 'ASC']]
    })
        .then(data => {
            // Преобразование для совместимости с фронтендом
            const formattedCourses = data.map(course => ({
                ...course.toJSON(),
                teacher_name: course.teacher ? course.teacher.name : null,
                specialization: course.teacher ? course.teacher.specialization : null
            }));
            res.send(formattedCourses);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving courses."
            });
        });
};

// Find a single Course with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Course.findByPk(id, {
        include: [{
            model: Teacher,
            as: 'teacher',
            attributes: ['name', 'specialization']
        }]
    })
        .then(data => {
            if (data) {
                const course = {
                    ...data.toJSON(),
                    teacher_name: data.teacher ? data.teacher.name : null,
                    specialization: data.teacher ? data.teacher.specialization : null
                }
                res.send(course);
            } else {
                res.status(404).send({
                    message: `Cannot find Course with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Course with id=" + id
            });
        });
};

// Update a Course by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Course.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Course was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Course with id=${id}. Maybe Course was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Course with id=" + id
            });
        });
};

// Delete a Course with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Course.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Course was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Course with id=${id}. Maybe Course was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Course with id=" + id
            });
        });
};

// Delete all Courses from the database.
exports.deleteAll = (req, res) => {
    Course.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Courses were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all courses."
            });
        });
};
