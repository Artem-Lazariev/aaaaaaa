async function getStudents() {
    try {
        const res = await fetch("./database.json");
        const data = await res.json();
        return data.students || [];
    } catch (err) {
        console.error("Помилка завантаження даних:", err);
        return [];
    }
}

window.editStudent = async function(button, studentId) {
    try {
        const card = button.closest(".student-card");
        const name = card.querySelector(".edit-name").value;
        const age = card.querySelector(".edit-age").value;
        const course = card.querySelector(".edit-course").value;
        const skills = card.querySelector(".edit-skills").value;
        const email = card.querySelector(".edit-email").value;
        const isEnrolled = card.querySelector(".edit-enrolled").value;

        await fetch("./database.json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: studentId, name, age, course, skills, email, isEnrolled })
        });
        alert("Дані оновлено!");
    } catch (error) {
        console.log(error);
    }
};

window.deleteStudent = async function(button) {
    try {
        const card = button.closest(".student-card");
        await fetch("./database.json", {
            method: "DELETE",
        });
        card.remove();
    } catch(err) {
        console.log(err);
    }
};

function render(students) {
    return students.map(student => `
      <div class="student-card">
        <input class="edit-name" value="${student.name}">
        <p>ID: <b>${student.id}</b></p>
        <p>Вік: <input class="edit-age" value="${student.age}"></p>
        <p>Курс: <input class="edit-course" value="${student.course}"></p>
        <p>Навички: <input class="edit-skills" value="${student.skills}"></p>
        <p>Email: <input class="edit-email" value="${student.email}"></p>
        <p>Статус: <input class="edit-enrolled" value="${student.isEnrolled}"></p>

        <div class="action-btns">
          <button onclick="editStudent(this, '${student.id}')">Редагувати</button>
          <button class="delete-btn" onclick="deleteStudent(this)">Видалити</button>
        </div>
      </div>
    `).join('');
}

document.getElementById("get-students-btn").addEventListener("click", async () => {
    const students = await getStudents();
    document.getElementById("students-container").innerHTML = render(students);
});

document.getElementById("add-student-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const newStudent = {
        id: Date.now(),
        name: document.getElementById("name").value,
        age: Number(document.getElementById("age").value),
        course: document.getElementById("course").value,
        skills: document.getElementById("skills").value,
        email: document.getElementById("email").value,
        isEnrolled: document.getElementById("isEnrolled").checked
    };

    try {
        await fetch("./database.json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newStudent)
        });

        document.getElementById("add-student-form").reset();
        alert("Студента успішно додано!");
    } catch (err) {
        console.log("Помилка при додаванні:", err);
    }
});