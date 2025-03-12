let form = document.querySelector('form');
let todocol = document.getElementById("todo-col");
let getallBoard = document.querySelectorAll(".board");

// Load Cards from Local Storage on Page Reload
window.onload = () => {
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach((task) => {
        createCard(task.content, task.board);
    });
};

// Submit Form Event
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let newtask = document.getElementById("task-input");

    if (newtask.value.trim() === "") {
        alert("Please enter a task!");
        return;
    }

    createCard(newtask.value, "todo-col");

    // Save Task to Local Storage
    saveTask(newtask.value, "todo-col");

    // Clear Input Field
    newtask.value = "";
});

// Create Card Function
function createCard(task, boardId) {
    let newcard = document.createElement("div");
    newcard.classList.add("card");
    newcard.setAttribute("draggable", "true");

    let taskcont = document.createElement("p");
    taskcont.innerText = task;

    let deltaskBtn = document.createElement("button");
    deltaskBtn.classList.add("del-task-btn");
    deltaskBtn.innerText = "❌";

    // Delete Task
    deltaskBtn.addEventListener("click", () => {
        newcard.remove();
        deleteTask(task);
    });

    newcard.appendChild(taskcont);
    newcard.appendChild(deltaskBtn);

    document.getElementById(boardId).appendChild(newcard);

    addDragEvents(newcard);
}

// Function to Add Drag Events
function addDragEvents(card) {
    card.addEventListener("dragstart", () => {
        card.classList.add("flying");
    });

    card.addEventListener("dragend", () => {
        card.classList.remove("flying");
        let currentBoard = card.parentElement.id;
        updateTask(card.querySelector("p").innerText, currentBoard);
    });
}

// Drag Over Events on Boards
getallBoard.forEach((board) => {
    board.addEventListener("dragover", (e) => {
        e.preventDefault(); // Allow Drop
        let flyingElem = document.querySelector(".flying");
        if (flyingElem) {
            board.appendChild(flyingElem);
        }
    });
});

// Save Task to Local Storage
function saveTask(content, board) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ content, board });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Delete Task from Local Storage
function deleteTask(content) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.content !== content);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update Task Board in Local Storage
function updateTask(content, newBoard) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(task => task.content === content ? { ...task, board: newBoard } : task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
