// ====== Setup UI ======
document.body.innerHTML = `
  <h2>Todo App</h2>
  
  <input id="title" placeholder="Task title" />
  <select id="priority">
    <option value="LOW">LOW</option>
    <option value="MEDIUM">MEDIUM</option>
    <option value="HIGH">HIGH</option>
  </select>
  <input id="dueDate" type="date" />
  <button onclick="addTask()">Add Task</button>

  <br><br>

  <input id="search" placeholder="Search..." oninput="renderTasks()" />

  <select id="filterStatus" onchange="renderTasks()">
    <option value="">All Status</option>
    <option value="PENDING">PENDING</option>
    <option value="IN_PROGRESS">IN_PROGRESS</option>
    <option value="COMPLETED">COMPLETED</option>
  </select>

  <select id="filterPriority" onchange="renderTasks()">
    <option value="">All Priority</option>
    <option value="LOW">LOW</option>
    <option value="MEDIUM">MEDIUM</option>
    <option value="HIGH">HIGH</option>
  </select>

  <div id="tasks"></div>
`;

// ====== Storage ======
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ====== Add Task ======
function addTask() {
  const title = document.getElementById("title").value;
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("dueDate").value;

  const task = {
    id: Date.now(),
    title,
    status: "PENDING",
    priority,
    dueDate,
    active: true,
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString()
  };

  tasks.push(task);
  save();
}

// ====== Save ======
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// ====== Update Task ======
function updateTask(id) {
  const newTitle = prompt("Update title:");
  tasks = tasks.map(t => {
    if (t.id === id) {
      t.title = newTitle || t.title;
      t.updatedAt = new Date().toLocaleString();
    }
    return t;
  });
  save();
}

// ====== Delete (Soft Delete) ======
function deleteTask(id) {
  tasks = tasks.map(t => {
    if (t.id === id) t.active = false;
    return t;
  });
  save();
}

// ====== Change Status ======
function changeStatus(id) {
  tasks = tasks.map(t => {
    if (t.id === id) {
      if (t.status === "PENDING") t.status = "IN_PROGRESS";
      else if (t.status === "IN_PROGRESS") t.status = "COMPLETED";
      t.updatedAt = new Date().toLocaleString();
    }
    return t;
  });
  save();
}

// ====== View Task by ID ======
function viewTaskById(id) {
  const task = tasks.find(t => t.id === id);
  alert(JSON.stringify(task, null, 2));
}

// ====== Render ======
function renderTasks() {
  const search = document.getElementById("search").value.toLowerCase();
  const filterStatus = document.getElementById("filterStatus").value;
  const filterPriority = document.getElementById("filterPriority").value;

  const filtered = tasks.filter(t =>
    t.active &&
    t.title.toLowerCase().includes(search) &&
    (filterStatus ? t.status === filterStatus : true) &&
    (filterPriority ? t.priority === filterPriority : true)
  );

  document.getElementById("tasks").innerHTML = filtered.map(t => `
    <div style="border:1px solid #ccc; padding:10px; margin:5px;">
      <b>${t.title}</b><br>
      Status: ${t.status} | Priority: ${t.priority}<br>
      Due: ${t.dueDate || "N/A"}<br>
      Created: ${t.createdAt}<br>
      Updated: ${t.updatedAt}<br>

      <button onclick="updateTask(${t.id})">Edit</button>
      <button onclick="deleteTask(${t.id})">Delete</button>
      <button onclick="changeStatus(${t.id})">Change Status</button>
      <button onclick="viewTaskById(${t.id})">View</button>
    </div>
  `).join("");
}

// ====== Initial Render ======
renderTasks();
