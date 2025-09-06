//tasksArray stors all the tasks for the userID1
let tasksArray = []
let userTask = ''
const url = `https://jsonplaceholder.typicode.com/users/1/todos`
//DOM
let userTaskInput = document.getElementById("userTaskInput")
let sendBtn = document.getElementById("sendBtn")
let updateBtn = document.getElementById("updateBtn")

//To get the previous tasks of the user from the server
async function getTheTasks() {
    let response = await fetch(url)
    let data = await response.json()
    tasksArray = data
    displayAllTasks()
}

//To display the tasks of the user
function displayAllTasks() {
    let cartoona = ``
    for (let i = 0; i < tasksArray.length; i++) {
        cartoona += ` <div class="aTaskBlock p-3 shadow rounded-2" style="${tasksArray[i].completed ? "background-color: #d8f2d8" : "background-color: #fae2e2ff"}">
                <p id="taskContext">${tasksArray[i].title}</p>
                <div class="buttons d-flex justify-content-end">
                    <button id="completedBtn" onclick=completedTask(${i}) class="fw-bold btn btn-outline-success me-3 ${tasksArray[i].completed ? "d-none" : "d-block"}" >Completed</button>
                    <button id="updateBtn" onclick=updateATask(${i}) class="fw-bold btn btn-outline-secondary me-3">Update</button>
                    <button id="deleteBtn" onclick=deleteATask(${i}) class="fw-bold btn btn-outline-danger">Delete</button>
                </div>
            </div>`
    }
    document.getElementById("allTasks").innerHTML = cartoona
}

getTheTasks()

//To stop the default value of form to refresh the page
document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault()
})

//To get the enterd task
userTaskInput.addEventListener("blur", function (e) {
    userTask = e.target.value
})

async function addATask() {
    let newTask = {
        userId: 1,
        title: userTask,
        completed: false
    }
    try {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask)
        })
        if (!response.ok)
            throw new Error("There is an error")
        let data = await response.json()
        tasksArray.push(data)
    } catch (error) {
        console.log(error);
    }
}

//Here when click on send btn it suppose to add a task
sendBtn.addEventListener("click", async function (e) {
    console.log("you clicked on send");
    await addATask()
    displayAllTasks()
    userTaskInput.value = ''
})

//Updating a task
let updatedTaskID
async function updateATask(taskID) {
    updatedTaskID = taskID
    //This is updating for the UI
    userTaskInput.value = tasksArray[taskID].title
    sendBtn.classList.add("d-none")
    updateBtn.classList.remove("d-none")
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}

//When the user finish updating the task title and click on the update btn
updateBtn.addEventListener("click", async function (e) {
    tasksArray[updatedTaskID].title = userTask
    displayAllTasks()
    userTaskInput.value = ''
    sendBtn.classList.remove("d-none")
    updateBtn.classList.add("d-none")
    //This will update the data in the server
    try {
        let response = await fetch(`https://jsonplaceholder.typicode.com/todos/${updatedTaskID + 1}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: userTask
            })
        })
        if (!response.ok)
            throw new Error("This task not found on the server")

    } catch (error) {
        console.log(error);
    }

})

//To delete a task from the UI and the server
async function deleteATask(taskID) {
    try {
        let response = await fetch(`https://jsonplaceholder.typicode.com/todos/${taskID + 1}`, {
            method: "DELETE"
        })
        tasksArray.splice(taskID, 1)
        displayAllTasks()
    } catch (error) {
        console.log(error);
    }
}

//when completing a task
async function completedTask(taskID) {
    try {
        let response = await fetch(`https://jsonplaceholder.typicode.com/todos/${taskID + 1}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                completed: true
            })
        })
        tasksArray[taskID].completed = true
        document.getElementsByClassName("aTaskBlock")[taskID].style = 'background-color: #d8f2d8;'
        document.getElementsByClassName("aTaskBlock")[taskID].querySelector("#completedBtn")
        .classList.add("d-none");
    } catch (error) {
        console.log(error);

    }
}