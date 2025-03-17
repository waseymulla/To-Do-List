document.addEventListener("DOMContentLoaded", () => {
  const task_form = document.getElementById("task-form");
  const task_list = document.getElementById("task-list");
  const filter_name = document.getElementById("filter-name");
  const filter_date = document.getElementById("filter-date");

  task_form.addEventListener("submit", handleTaskSubmission);
  filter_name.addEventListener("input", filterTasks);
  filter_date.addEventListener("change", filterTasks);

  function handleTaskSubmission(event) {
    event.preventDefault();

    const title = document.getElementById("task-name").value.trim();
    const date = document.getElementById("task-date").value.trim();
    const description = document.getElementById("task-desc").value.trim();

    if (!title || !date || !description) {
      alert("All fields are required!");
      return;
    }

    addTask(title, date, description);
    saveTasks();
    task_form.reset();
  }

  function addTask(title, date, description) {
    const task_item = createTaskElement(title, date, description);
    task_list.appendChild(task_item);
  }

  function createTaskElement(title, date, description) {
    const task_item = document.createElement("div");
    task_item.classList.add("task-item");

    const task_data = { title, date, description };
    task_item.dataset.task = JSON.stringify(task_data);

    const task_content = document.createElement("div");
    task_content.classList.add("task-content");
    task_content.textContent = `${title} - ${date} - ${description}`;

    const edit_button = document.createElement("button");
    edit_button.textContent = "Edit";
    edit_button.addEventListener("click", () => editTask(task_item));

    const delete_button = document.createElement("button");
    delete_button.textContent = "Delete";
    delete_button.addEventListener("click", () => {
      deleteTask(task_item);
      saveTasks();
    });

    task_item.appendChild(task_content);
    task_item.appendChild(edit_button);
    task_item.appendChild(delete_button);

    return task_item;
  }

  function editTask(task_item) {
    const task_data = JSON.parse(task_item.dataset.task);

    const title_input = document.createElement("input");
    title_input.type = "text";
    title_input.value = task_data.title;

    const date_input = document.createElement("input");
    date_input.type = "date";
    date_input.value = task_data.date;

    const desc_input = document.createElement("input");
    desc_input.type = "text";
    desc_input.value = task_data.description;

    const save_button = document.createElement("button");
    save_button.textContent = "Save";
    save_button.addEventListener("click", () => {
      saveTask(
        task_item,
        title_input.value,
        date_input.value,
        desc_input.value
      );
      saveTasks();
    });

    task_item.textContent = "";
    task_item.appendChild(title_input);
    task_item.appendChild(date_input);
    task_item.appendChild(desc_input);
    task_item.appendChild(save_button);
  }

  function saveTask(task_item, title, date, description) {
    if (!title || !date || !description) {
      alert("All fields are required!");
      return;
    }

    task_item.dataset.task = JSON.stringify({ title, date, description });

    const task_content = document.createElement("div");
    task_content.classList.add("task-content");
    task_content.textContent = `${title} - ${date} - ${description}`;

    const edit_button = document.createElement("button");
    edit_button.textContent = "Edit";
    edit_button.addEventListener("click", () => editTask(task_item));

    const delete_button = document.createElement("button");
    delete_button.textContent = "Delete";
    delete_button.addEventListener("click", () => {
      deleteTask(task_item);
      saveTasks();
    });

    task_item.textContent = "";
    task_item.appendChild(task_content);
    task_item.appendChild(edit_button);
    task_item.appendChild(delete_button);
  }

  function deleteTask(task_item) {
    task_item.remove();
  }

  function filterTasks() {
    const name_filter = filter_name.value.toLowerCase();
    const date_filter = filter_date.value;

    const tasks = document.querySelectorAll(".task-item");
    tasks.forEach((task) => {
      const task_data = JSON.parse(task.dataset.task);
      const matches_name = task_data.title.toLowerCase().includes(name_filter);
      const matches_date = !date_filter || task_data.date === date_filter;

      if (matches_name && matches_date) {
        task.style.display = "block";
      } else {
        task.style.display = "none";
      }
    });
  }

  function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".task-item").forEach((task) => {
      tasks.push(JSON.parse(task.dataset.task));
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => addTask(task.title, task.date, task.description));
  }

  loadTasks();
});
