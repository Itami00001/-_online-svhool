const db = require("../models");
const Student = db.Student;
const Op = db.Sequelize.Op;

// Создать и сохранить нового студента
exports.create = (req, res) => {
    // Валидация запроса
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Создание студента
    const student = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        birth_date: req.body.birth_date,
        registration_date: req.body.registration_date
    };

    // Сохранение в БД
    Student.create(student)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Student."
            });
        });
};

// Получить всех студентов (с возможностью поиска по имени)
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

    Student.findAll({ where: condition, order: [['id', 'ASC']] })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving students."
            });
        });
};

// Получить одного студента по id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Student.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Student with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Student with id=" + id
            });
        });
};

// Обновить студента по id
exports.update = (req, res) => {
    const id = req.params.id;

    Student.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Student was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Student with id=${id}. Maybe Student was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Student with id=" + id
            });
        });
};

// Удалить студента по id
exports.delete = (req, res) => {
    const id = req.params.id;

    Student.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Student was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Student with id=${id}. Maybe Student was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Student with id=" + id
            });
        });
};

// Удалить всех студентов
exports.deleteAll = (req, res) => {
    Student.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Students were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all students."
            });
        });
};
