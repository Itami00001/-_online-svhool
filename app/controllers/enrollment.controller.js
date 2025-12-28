const db = require("../models");
const Enrollment = db.Enrollment;
const Student = db.Student;
const Course = db.Course;
const Op = db.Sequelize.Op;

// Create and Save a new Enrollment
exports.create = (req, res) => {
    // Validate request
    if (!req.body.student_id || !req.body.course_id) {
        res.status(400).send({
            message: "Student ID and Course ID are required!"
        });
        return;
    }

    // Create an Enrollment
    const enrollment = {
        student_id: req.body.student_id,
        course_id: req.body.course_id,
        enrollment_date: req.body.enrollment_date || new Date(),
        status: req.body.status || 'active',
        grade: req.body.grade
    };

    // Save Enrollment in the database
    Enrollment.create(enrollment)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Enrollment."
            });
        });
};

// Retrieve all Enrollments from the database.
exports.findAll = (req, res) => {
    const student_id = req.query.student_id;
    const course_id = req.query.course_id;

    var condition = {};
    if (student_id) condition.student_id = student_id;
    if (course_id) condition.course_id = course_id;

    Enrollment.findAll({
        where: condition,
        include: [
            {
                model: Student,
                as: 'student',
                attributes: ['name', 'email']
            },
            {
                model: Course,
                as: 'course',
                attributes: ['name', 'price']
            }
        ],
        order: [['enrollment_date', 'DESC']]
    })
        .then(data => {
            // Преобразование для совместимости с фронтендом
            const formattedEnrollments = data.map(enrollment => ({
                id: enrollment.id,
                enrollment_date: enrollment.enrollment_date,
                status: enrollment.status,
                grade: enrollment.grade,
                student_id: enrollment.student_id,
                course_id: enrollment.course_id,
                student_name: enrollment.student ? enrollment.student.name : 'Unknown',
                student_email: enrollment.student ? enrollment.student.email : 'Unknown',
                course_name: enrollment.course ? enrollment.course.name : 'Unknown',
                price: enrollment.course ? enrollment.course.price : 0
            }));
            res.send(formattedEnrollments);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving enrollments."
            });
        });
};

// Find a single Enrollment with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Enrollment.findByPk(id, {
        include: [
            {
                model: Student,
                as: 'student',
                attributes: ['name', 'email']
            },
            {
                model: Course,
                as: 'course',
                attributes: ['name', 'price']
            }
        ]
    })
        .then(data => {
            if (data) {
                const enrollment = {
                    id: data.id,
                    enrollment_date: data.enrollment_date,
                    status: data.status,
                    grade: data.grade,
                    student_id: data.student_id,
                    course_id: data.course_id,
                    student_name: data.student ? data.student.name : 'Unknown',
                    student_email: data.student ? data.student.email : 'Unknown',
                    course_name: data.course ? data.course.name : 'Unknown',
                    price: data.course ? data.course.price : 0
                };
                res.send(enrollment);
            } else {
                res.status(404).send({
                    message: `Cannot find Enrollment with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Enrollment with id=" + id
            });
        });
};

// Update an Enrollment by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Enrollment.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Enrollment was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Enrollment with id=${id}. Maybe Enrollment was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Enrollment with id=" + id
            });
        });
};

// Delete an Enrollment with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Enrollment.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Enrollment was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Enrollment with id=${id}. Maybe Enrollment was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Enrollment with id=" + id
            });
        });
};

// Delete all Enrollments from the database.
exports.deleteAll = (req, res) => {
    Enrollment.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Enrollments were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all enrollments."
            });
        });
};

exports.findAllPaged = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const offset = (page - 1) * size;

    try {
        const { count, rows } = await Enrollment.findAndCountAll({
            where: {}, // Add conditions here if needed
            include: [
                {
                    model: Student,
                    as: 'student',
                    attributes: ['name', 'email']
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['name', 'price']
                }
            ],
            limit: size,
            offset: offset,
            order: [['enrollment_date', 'DESC']]
        });

        const formattedEnrollments = rows.map(enrollment => ({
            id: enrollment.id,
            enrollment_date: enrollment.enrollment_date,
            status: enrollment.status,
            grade: enrollment.grade,
            student_id: enrollment.student_id,
            course_id: enrollment.course_id,
            student_name: enrollment.student ? enrollment.student.name : 'Unknown',
            student_email: enrollment.student ? enrollment.student.email : 'Unknown',
            course_name: enrollment.course ? enrollment.course.name : 'Unknown',
            price: enrollment.course ? enrollment.course.price : 0
        }));

        res.json({
            totalItems: count,
            totalPages: Math.ceil(count / size),
            currentPage: page,
            items: formattedEnrollments,
        });
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
