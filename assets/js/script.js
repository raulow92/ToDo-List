// ELEMENTOS DEL DOM
const newTask = document.getElementById("new-task");
const btnAddTask = document.getElementById("add-task");
const containerTasks = document.querySelector(".container__tasks");
const template = document.getElementById("template").content;
const fragment = document.createDocumentFragment();
const taskCount = document.getElementById("task-count");

// ARRAY DE TAREAS (LET PARA PODER UTILIZAR LocalStorage)
let taskList = [ 
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

// ESPERA A QUE SE CARGUE EL DOM Y RENDERIZA LAS TAREAS
document.addEventListener("DOMContentLoaded", () => { 
    // LocalStorage
    if (localStorage.getItem("tasks")){
        taskList = JSON.parse(localStorage.getItem("tasks"));
        console.log(JSON.parse(localStorage.getItem("tasks")));
    }
    renderTasks(); // SE RENDERIZAN LAS TAREAS
})

// ESCUCHA LOS EVENTOS CLICK Y ENTER PARA EJECUTAR setTask
btnAddTask.addEventListener("click", () => {
    setTask();
})
newTask.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        setTask();
    }
})

// ESCUCHA LOS CLICKS DE TODOS LOS ELEMENTOS DENTRO DEL CONTENEDOR DE TAREAS
containerTasks.addEventListener("click", e => {
    btnAction(e);
})

// CREA UNA NUEVA TAREA
const setTask = () => {
    // SI LA TAREA ESTÁ VACÍA DETIENE LA FUNCIÓN
    if (newTask.value.trim() === "") {
        newTask.value = "";
        newTask.focus();
        return
    }
    // SE AGREGA LA INFORMACIÓN A LA NUEVA TAREA
    const task = {
        id: Date.now(),
        text: newTask.value,
        status: false,
    }
    
    taskList.unshift(task); // SE AGREGA LA TAREA AL COMIENZO DEL ARRAY

    renderTasks();      // SE RENDERIZAN LAS TAREAS
    newTask.value = ""; // EL INPUT SE VACÍA
    newTask.focus();    // EL FOCUS VA AL INPUT
}

// IMPRIME EL ARRAY DE TAREAS
const renderTasks = () =>  {
    // LocalStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // MUESTRA UN MENSAJE SI EL ARRAY DE TAREAS ESTÁ VACÍO
    if (taskList.length === 0) {
        containerTasks.innerHTML = `<h2>You don't have any task to do! 🤩</h2>`
        taskCount.innerHTML = ""
        return // EVITA QUE SE SIGA EJECUTANDO LA FUNCIÓN
    }

    // BUCLE QUE RECORRE EL ARRAY DE TAREAS
    containerTasks.innerHTML = ""
    taskList.forEach(task => {
        const clone = template.cloneNode(true); // CLON DEL TEMPLATE HTML

        // SE AGREGA LA INFORMACIÓN DE CADA OBJETO A UN CLON
        clone.querySelector(".task-input").value = task.text;

        // SI EL ESTADO CAMBIA A TRUE PASA LO SIGUIENTE
        if (task.status) {
            clone.querySelector(".task").classList.add("task-done"); // AGREGA UNA CLASE
            clone.querySelector(".check").classList.replace("fa-circle-check", "fa-rotate-right"); // CAMBIA EL ÍCONO
            clone.querySelector(".fa-pen").style.color = "transparent";
            clone.querySelector(".fa-pen").style.cursor = "auto";
        }

        // SE AGREGA EL ID A CADA ELEMENTO DE LA TAREA
        clone.querySelector(".check").dataset.id = task.id;
        clone.querySelector(".fa-pen").dataset.id = task.id;
        clone.querySelector(".fa-trash").dataset.id = task.id;
        clone.querySelector(".task-input").dataset.id = task.id;

        // SE AGREGA LA COPIA DEL TEMPLATE AL FRAGMENT
        fragment.appendChild(clone);
    })
    // SE AGREGA AL DOM TODAS LAS TAREAS DEL FRAGMENT
    containerTasks.appendChild(fragment);

    // SE CUENTAN LAS TAREAS HECHAS Y EL TOTAL
    let doneCount = 0
    taskList.forEach(task => {
        if (task.status === true){
            doneCount++
        }
    })
    taskCount.innerHTML = `<p>Done ${doneCount} of ${taskList.length} tasks</p>`
}

// ACCIONES AL CLICK DE LOS ELEMENTOS DEL CONTENEDOR DE TAREAS
const btnAction = e => {
    if (e.target.classList.contains("fa-circle-check")){                    // CLICK EN CHECK
        const index = taskList.findIndex(x => x.id == e.target.dataset.id); // BUSCA EL INDEX
        taskList[index].status = true;                                      // CAMBIA EL STATUS A TRUE
        let copy = taskList.splice(index, 1)[0];                            // HACE UNA COPIA DEL OBJETO
        taskList.splice(taskList.length, 0, copy);                          // PEGA EL OBJETO AL FINAL DEL ARRAY
        renderTasks();
    }

    if (e.target.classList.contains("fa-rotate-right")){                    // CLICK EN RESTAURAR
        const index = taskList.findIndex(x => x.id == e.target.dataset.id); // BUSCA EL INDEX
        taskList[index].status = false;                                     // CAMBIA EL STATUS A FALSE
        let copy = taskList.splice(index, 1)[0];                            // HACE UNA COPIA DEL OBJETO
        taskList.unshift(copy);                                             // PEGA EL OBJETO AL COMIENZO DEL ARRAY
        renderTasks();
    }

    if (e.target.classList.contains("fa-trash")){                           // CLICK EN BASURERO
        const index = taskList.findIndex(x => x.id == e.target.dataset.id); // BUSCA EL INDEX
        taskList.splice([index],1);                                         // ELIMINA LA TAREA
        renderTasks();
    }

    if (e.target.classList.contains("fa-pen")){                             // CLICK EN EDITAR
        const index = taskList.findIndex(x => x.id == e.target.dataset.id); // BUSCA EL INDEX
        let input = document.getElementsByClassName("task-input")[index]; 
        input.readOnly = false                                              // CAMBIA LA PROPIEDAD READONLY A FALSE
        input.focus();                                                      // CAMBIA EL FOCUS AL INPUT
        let edit = document.getElementsByClassName("edit")[index];
        edit.classList.replace("fa-pen", "fa-arrow-turn-down");             // CAMBIA EL ÍCONO
        
        input.addEventListener("keyup", (e) => { 
            if (e.key === "Enter") {                                        // ESCUCHA LA TECLA ENTER
                taskList[index].text = input.value;                         // CAMBIA EL TEXT DEL OBJETO AL VALOR DEL INPUT
                input.readOnly = true;                                      // CAMBIA LA PROPIEDAD READONLY A TRUE
                renderTasks();
                newTask.focus();                                            // CAMBIA EL FOCUS AL INPUT DE NUEVA TAREA
            }
        })
    }
}