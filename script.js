const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const deadlineInput = document.getElementById("deadlineInput");

const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

const filterButtons = document.querySelectorAll(".filter-btn");

const progressFill = document.getElementById("progressFill");
const progressPercentage = document.getElementById("progressPercentage");

const currentDate = document.getElementById("currentDate");


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// ===============================
// ADD TASK
// ===============================

addTaskBtn.addEventListener("click", addTask);


function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }


    const newTask = {

        id: Date.now(),

        text: text,

        priority: priorityInput.value,

        deadline: deadlineInput.value,

        completed: false

    };


    tasks.push(newTask);


    // Clear inputs

    taskInput.value = "";

    priorityInput.value = "medium";

    deadlineInput.value = "";


    // Update application

    displayTasks();

}


// ===============================
// ENTER KEY
// ===============================

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});


// ===============================
// DISPLAY TASKS
// ===============================

function displayTasks() {

    taskList.innerHTML = "";


    let filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "pending") {

            return !task.completed;

        }


        if (currentFilter === "completed") {

            return task.completed;

        }


        return true;

    });


    filteredTasks.forEach(function(task) {


        // Main task

        const li = document.createElement("li");

        li.classList.add("task");


        if (task.completed) {

            li.classList.add("completed");

        }


        // ===============================
        // TASK INFORMATION
        // ===============================

        const taskInfo = document.createElement("div");

        taskInfo.classList.add("task-info");


        // Task name

        const taskName = document.createElement("strong");

        taskName.textContent = task.text;


        // ===============================
        // PRIORITY
        // ===============================

        const priority = document.createElement("span");

        priority.classList.add("priority");


        if (task.priority === "high") {

            priority.textContent = "🔴 High";

            priority.classList.add("high");

        }

        else if (task.priority === "medium") {

            priority.textContent = "🟡 Medium";

            priority.classList.add("medium");

        }

        else {

            priority.textContent = "🟢 Low";

            priority.classList.add("low");

        }


        // ===============================
        // DEADLINE
        // ===============================

        const deadline = document.createElement("small");


if (task.deadline) {

    const date = new Date(
        task.deadline + "T00:00:00"
    );

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    const difference =
        date - today;


    const daysLeft =
        Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );


    deadline.textContent =
        "📅 " +
        date.toLocaleDateString("en-GB");


    if (!task.completed && daysLeft < 0) {

        deadline.textContent +=
            " ⚠️ Overdue";

        deadline.classList.add("overdue");

    }

    else if (!task.completed && daysLeft === 0) {

        deadline.textContent +=
            " ⚠️ Today";

        deadline.classList.add("today");

    }

    else if (!task.completed && daysLeft <= 2) {

        deadline.textContent +=
            " ⏰ Soon";

        deadline.classList.add("soon");

    }

}

else {

    deadline.textContent =
        "📅 No deadline";

}


        // Add information

        taskInfo.appendChild(taskName);

        taskInfo.appendChild(priority);

        taskInfo.appendChild(deadline);


        // ===============================
        // BUTTONS
        // ===============================

        const actions = document.createElement("div");


        // Complete button

        const completeBtn =
            document.createElement("button");

        completeBtn.classList.add("complete-btn");

        completeBtn.textContent = "✅";


        completeBtn.addEventListener(
            "click",
            function() {

                task.completed = !task.completed;

                displayTasks();

            }
        );


        // Delete button

        const deleteBtn =
            document.createElement("button");

        deleteBtn.classList.add("delete-btn");

        deleteBtn.textContent = "🗑️";


        deleteBtn.addEventListener(
            "click",
            function() {

                tasks = tasks.filter(function(item) {

                    return item.id !== task.id;

                });


                displayTasks();

            }
        );


        actions.appendChild(completeBtn);

        actions.appendChild(deleteBtn);


        // ===============================
        // FINAL TASK
        // ===============================

        li.appendChild(taskInfo);

        li.appendChild(actions);

        taskList.appendChild(li);

    });


    updateCounter();

    updateProgress();

    saveTasks();

}


// ===============================
// FILTERS
// ===============================

filterButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            currentFilter =
                button.dataset.filter;


            filterButtons.forEach(function(btn) {

                btn.classList.remove("active");

            });


            button.classList.add("active");


            displayTasks();

        }
    );

});


// ===============================
// COUNTER
// ===============================

function updateCounter() {

    const total = tasks.length;


    const completed = tasks.filter(
        function(task) {

            return task.completed;

        }
    ).length;


    taskCount.textContent =
        `${total} tasks - ${completed} completed`;

}


// ===============================
// PROGRESS
// ===============================

function updateProgress() {

    const total = tasks.length;


    const completed = tasks.filter(
        function(task) {

            return task.completed;

        }
    ).length;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    progressFill.style.width =
        percentage + "%";


    progressPercentage.textContent =
        percentage + "%";

}


// ===============================
// LOCAL STORAGE
// ===============================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ===============================
// DATE
// ===============================

function showDate() {

    const today = new Date();


    const options = {

        weekday: "long",

        month: "long",

        day: "numeric"

    };


    currentDate.textContent =
        today.toLocaleDateString(
            "en-US",
            options
        );

}


// ===============================
// START
// ===============================

showDate();

displayTasks();