// API Base URL
const API_URL = 'http://localhost:3000/api';

// Загрузка данных при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadCourses();
    loadStudents();
    loadTeachers();
    loadEnrollments();

    // Обработчики форм
    document.getElementById('add-student-form').addEventListener('submit', addStudent);
    document.getElementById('add-enrollment-form').addEventListener('submit', addEnrollment);
});

// Переключение вкладок
function showTab(tabName) {
    // Скрыть все вкладки
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Убрать активный класс у всех кнопок
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Показать выбранную вкладку
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Активировать кнопку
    event.target.classList.add('active');
}

// Загрузка статистики
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const stats = await response.json();

        document.getElementById('stats-students').textContent = stats.students;
        document.getElementById('stats-teachers').textContent = stats.teachers;
        document.getElementById('stats-courses').textContent = stats.courses;
        document.getElementById('stats-enrollments').textContent = stats.enrollments;
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
    }
}

// Загрузка курсов
async function loadCourses() {
    try {
        const response = await fetch(`${API_URL}/courses`);
        const courses = await response.json();

        const container = document.getElementById('courses-list');
        container.innerHTML = courses.map(course => `
            <div class="course-card">
                <h3>${course.name}</h3>
                <p><strong>Преподаватель:</strong> ${course.teacher_name || 'Не назначен'}</p>
                <p><strong>Специализация:</strong> ${course.specialization || '-'}</p>
                <p><strong>Длительность:</strong> ${course.duration_hours} часов</p>
                <p><strong>Период:</strong> ${formatDate(course.start_date)} - ${formatDate(course.end_date)}</p>
                <p class="price">${course.price ? course.price + ' ₽' : 'Бесплатно'}</p>
            </div>
        `).join('');

        // Заполнить селект курсов для формы записи
        const select = document.getElementById('enrollment-course');
        select.innerHTML = '<option value="">Выберите курс</option>' +
            courses.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    } catch (error) {
        console.error('Ошибка загрузки курсов:', error);
    }
}

// Загрузка студентов
async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/students`);
        const students = await response.json();

        const container = document.getElementById('students-list');
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Email</th>
                        <th>Телефон</th>
                        <th>Дата рождения</th>
                        <th>Дата регистрации</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map(s => `
                        <tr>
                            <td>${s.id}</td>
                            <td>${s.name}</td>
                            <td>${s.email}</td>
                            <td>${s.phone || '-'}</td>
                            <td>${formatDate(s.birth_date)}</td>
                            <td>${formatDate(s.registration_date)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        // Заполнить селект студентов для формы записи
        const select = document.getElementById('enrollment-student');
        select.innerHTML = '<option value="">Выберите студента</option>' +
            students.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    } catch (error) {
        console.error('Ошибка загрузки студентов:', error);
    }
}

// Загрузка преподавателей
async function loadTeachers() {
    try {
        const response = await fetch(`${API_URL}/teachers`);
        const teachers = await response.json();

        const container = document.getElementById('teachers-list');
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Email</th>
                        <th>Специализация</th>
                        <th>Телефон</th>
                        <th>Дата найма</th>
                    </tr>
                </thead>
                <tbody>
                    ${teachers.map(t => `
                        <tr>
                            <td>${t.id}</td>
                            <td>${t.name}</td>
                            <td>${t.email}</td>
                            <td>${t.specialization || '-'}</td>
                            <td>${t.phone || '-'}</td>
                            <td>${formatDate(t.hire_date)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Ошибка загрузки преподавателей:', error);
    }
}

// Загрузка записей на курсы
async function loadEnrollments() {
    try {
        const response = await fetch(`${API_URL}/enrollments`);
        const enrollments = await response.json();

        const container = document.getElementById('enrollments-list');
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Студент</th>
                        <th>Email студента</th>
                        <th>Курс</th>
                        <th>Цена</th>
                        <th>Дата записи</th>
                        <th>Статус</th>
                        <th>Оценка</th>
                    </tr>
                </thead>
                <tbody>
                    ${enrollments.map(e => `
                        <tr>
                            <td>${e.id}</td>
                            <td>${e.student_name}</td>
                            <td>${e.student_email}</td>
                            <td>${e.course_name}</td>
                            <td>${e.price ? e.price + ' ₽' : '-'}</td>
                            <td>${formatDate(e.enrollment_date)}</td>
                            <td><span class="status-badge status-${e.status}">${e.status}</span></td>
                            <td>${e.grade || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Ошибка загрузки записей:', error);
    }
}

// Добавление студента
async function addStudent(e) {
    e.preventDefault();

    const studentData = {
        name: document.getElementById('student-name').value,
        email: document.getElementById('student-email').value,
        phone: document.getElementById('student-phone').value,
        birth_date: document.getElementById('student-birth').value
    };

    try {
        const response = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        if (response.ok) {
            alert('✓ Студент успешно добавлен!');
            document.getElementById('add-student-form').reset();
            loadStudents();
            loadStats();
        } else {
            alert('✗ Ошибка при добавлении студента');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('✗ Ошибка при добавлении студента');
    }
}

// Запись студента на курс
async function addEnrollment(e) {
    e.preventDefault();

    const enrollmentData = {
        student_id: parseInt(document.getElementById('enrollment-student').value),
        course_id: parseInt(document.getElementById('enrollment-course').value)
    };

    try {
        const response = await fetch(`${API_URL}/enrollments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(enrollmentData)
        });

        if (response.ok) {
            alert('✓ Студент успешно записан на курс!');
            document.getElementById('add-enrollment-form').reset();
            loadEnrollments();
            loadStats();
        } else {
            alert('✗ Ошибка при записи на курс (возможно, студент уже записан)');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('✗ Ошибка при записи на курс');
    }
}

// Форматирование даты
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}
