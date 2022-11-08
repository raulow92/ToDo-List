// OBTENIENDO ELEMENTOS DEL DOM
const newTask = document.getElementById("new-task");
const btnAddTask = document.getElementById("add-task");
const containerTasks = document.querySelector(".container__tasks");
const template = document.getElementById("template").content;
const fragment = document.createDocumentFragment();
const taskCount = document.getElementById("task-count");
const taskList = [
    {
        id: "1667920152028",
        text: 'Learn React',
        status: false,
    },
    {
        id: "1667920154549",
        text: "Buy sushi",
        status: true,
    },
    {
        id: "1667920157743",
        text: 'Do a "ToDo List" with JavaScript',
        status: true,
    },
];

document.addEventListener("DOMContentLoaded", () => {
    renderTasks();
})

btnAddTask.addEventListener("click", () => {
    setTask();
})

newTask.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        setTask();
    }
})

containerTasks.addEventListener("click", e => {
    btnAction(e);
})

const setTask = () => {
    if (newTask.value.trim() === "") {
        newTask.value = "";
        newTask.focus();
        return
    }
    const task = {
        id: Date.now(),
        text: newTask.value,
        status: false,
    }

    taskList.unshift(task);
    renderTasks();

    newTask.value = "";
    newTask.focus();
}

const renderTasks = () =>  {

    if (taskList.length === 0) {
        containerTasks.innerHTML = `<h2>You don't have any task to do! 🤩</h2>`
        taskCount.innerHTML = ""
        return
    }

    containerTasks.innerHTML = ""
    taskList.forEach(task => {
        const clone = template.cloneNode(true);
        clone.querySelector(".task-input").value = task.text;

        if (task.status) {
            clone.querySelector(".task").classList.add("task-done");
            clone.querySelector(".check").classList.replace("fa-circle-check", "fa-rotate-right");
            clone.querySelector(".fa-pen").style.color = "transparent";
            clone.querySelector(".fa-pen").style.cursor = "auto";
        }

        clone.querySelector(".check").dataset.id = task.id;
        clone.querySelector(".fa-pen").dataset.id = task.id;
        clone.querySelector(".fa-trash").dataset.id = task.id;
        clone.querySelector(".task-input").dataset.id = task.id;

        fragment.appendChild(clone);
    })
    containerTasks.appendChild(fragment);

    let doneCount = 0
    taskList.forEach(task => {
        if (task.status === true){
            doneCount++
        }
    })
    taskCount.innerHTML = `<p>Done ${doneCount} of ${taskList.length} tasks</p>`
}

const btnAction = e => {
    if (e.target.classList.contains("fa-circle-check")){
        const index = taskList.findIndex(x => x.id == e.target.dataset.id);
        taskList[index].status = true;
        let copy = taskList.splice(index, 1)[0];
        taskList.splice(taskList.length, 0, copy);
        renderTasks();
    }

    if (e.target.classList.contains("fa-rotate-right")){
        const index = taskList.findIndex(x => x.id == e.target.dataset.id);
        taskList[index].status = false;
        let copy = taskList.splice(index, 1)[0];
        taskList.unshift(copy);
        renderTasks();
    }

    if (e.target.classList.contains("fa-trash")){
        const index = taskList.findIndex(x => x.id == e.target.dataset.id);
        taskList.splice([index],1);
        renderTasks();
    }

    if (e.target.classList.contains("fa-pen")){
        const index = taskList.findIndex(x => x.id == e.target.dataset.id);
        let input = document.getElementsByClassName("task-input")[index];
        input.readOnly = false
        input.focus();
        let edit = document.getElementsByClassName("edit")[index];
        edit.classList.replace("fa-pen", "fa-arrow-turn-down");
        
        input.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                taskList[index].text = input.value;
                input.readOnly = true;
                renderTasks();
                newTask.focus();
            }
        })
    }
}