// Get references to various HTML elements
let taskInput = document.querySelector('.task-input input');
let taskTimeone = document.querySelector('.filter #time1');
let taskTimetwo = document.querySelector('.filter #time2');
let selectone = document.querySelector('.filter #sel1');
let selecttwo = document.querySelector('.filter #sel2');
let addBtn = document.querySelector('.task-input button');
let warning = document.getElementById('alert');
let taskbox = document.querySelector('.task-box');
let clearBtn = document.querySelector('.clear-btn');
let editId;
let isEditedTask = false;

// Retrieve existing todo items from local storage, if any
let todo = JSON.parse(localStorage.getItem('todo-list'));

// Event listener for the "Add" button
addBtn.addEventListener('click', () => {
    check();
});

// Function to validate and check user input
function check() {
    // Regular expression to check for special characters
    let specialCharacter = /([=<>!@#%^&*~`{};])/i;
    let isSC = specialCharacter.test(taskInput.value.trim());

    if (taskInput.value === "" && (taskTimeone.value ==="" || taskTimetwo.value === "") ) {
        warning.innerHTML = "Please enter the task And Time";
    } else if (taskTimeone.value ==="" || taskTimetwo.value === "") {
        warning.innerHTML = "Please select the time";
    }else if (taskTimeone.value ==="" || taskTimetwo.value === "") {
        warning.innerHTML = "Please select the time";
    } else if (isSC) {
        warning.innerHTML = "Invalid task, don't use special characters";
    } else {
        warning.innerHTML = "";
        ListInfo();
    }
}

// Function to add or edit a task
function ListInfo() {
    let userTask = taskInput.value.trim();

    if (!isEditedTask) {
        // If it's a new task, create a new object and push it to the todo array
        if (!todo) {
            todo = [];
        }
        let taskinfo = {
            name: userTask,
            status: "pending",
            time1: taskTimeone.value,
            sel1: selectone.value,
            time2: taskTimetwo.value,
            sel2: selecttwo.value
        };
        todo.push(taskinfo);
    } else {
        // If it's an edited task, update the existing task in the todo array
        isEditedTask = false;
        todo[editId].name = userTask;
    }
    taskInput.value = "";

    // Store the updated todo list in local storage
    localStorage.setItem('todo-list', JSON.stringify(todo));
    showList();
}

// Function to display the list of tasks
function showList() {
    if (todo.length <= 0) {
        clearBtn.setAttribute("disabled", "");
        clearBtn.style.backgroundColor = "grey";
    } else {
        clearBtn.removeAttribute("disabled");
        clearBtn.style.backgroundColor = "#3c87ff";
    }

    let li = "";
    if (todo) {
        todo.forEach((todo, id) => {
            let isCompleted = todo.status == "completed" ? "checked" : "";
            li += `
                <li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" onclick="changetime(this)" type="checkbox" name="" id="${id}" ${isCompleted}>
                        <p style = "width:200px; margin-right : 10px">${todo.time1}-${selectone.value} to ${todo.time2}-${selecttwo.value}</p>
                        <p class="${isCompleted}">${todo.name}</p>
                    </label>
                    <div class="setting">
                        <i onclick="editTask(${id},'${todo.name}')" class="fa-regular fa-pen-to-square"></i>
                        <i onclick="deleteTask(${id})" class="fa-solid fa-trash-can"></i>
                    </div>
                </li>`;
        });
    }
    taskbox.innerHTML = li || `<p>You don't have any tasks here.</p>`;
}
showList()

// Function to update the status of a task (completed or pending)
function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todo[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todo[selectedTask.id].status = "pending";
    }


    // Store the updated todo list in local storage
    localStorage.setItem('todo-list', JSON.stringify(todo));
}

// Function to delete a task
function deleteTask(deleteId) {
    todo.splice(deleteId, 1);
    // Store the updated todo list in local storage
    localStorage.setItem('todo-list', JSON.stringify(todo));
    showList();
}

// Function to edit a task
function editTask(taskId, taskName) {
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}

// Event listener for the "Clear All" button
clearBtn.addEventListener('click', () => {
    // Clear all tasks and update local storage
    todo = [];
    localStorage.setItem('todo-list', JSON.stringify(todo));
    showList();
});

// Initial display of the task list
showList();
