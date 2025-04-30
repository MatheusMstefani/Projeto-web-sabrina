// Esperar o HTML carregar

  document.addEventListener("DOMContentLoaded", function() {
  const taskInput = document.getElementById("Task-input");
  const addTaskBtn = document.getElementById("add-task");
  const taskList = document.getElementById("task-list");
  const filter = document.querySelectorAll(".filter"); 
  const toggleThereBtn = document.getElementById("toggle-theme");

  // LocalStored - Armazenar os dados salvos no navegador
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let theme = localStorage.getItem("theme") || "light";

  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  }
    toggleThereBtn.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    if(document.body.classList.contains("dark-mode")){
      theme = "dark";
    } else {
      theme = "light";
    }
    localStorage.setItem("theme", theme);
  });

  function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // função para me mostrar as tarefas na tela
  function renderTasks(currentFilter = "all") {
    taskList.innerText = "";

    tasks.forEach(function (task, index){
      if(currentFilter === "pending" && task.completed) return;
      if(currentFilter === "completed" && !task.completed) return;

      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";

      li.innerHTML = `
          <span class="task-text">${task.text}</span>
          <button class="edit"><img class="btnTaks" src="assets/editar.png"></button>
          <button class="delete"><img class="btnTaks" src="assets/lixeira.png"></button>
      `;

      li.addEventListener("click", function(e) {
        const isDelete = e.target.closest(".delete");
        const isEdit = e.target.closest(".edit");

        if(isDelete){
          tasks.splice(index, 1);
        } else if (isEdit){
          const newText = prompt("Editar tarefas: ", task.text);
          if(newText) tasks[index].text = newText;
        } else {
          tasks[index].completed = !tasks[index].completed;
        }

        saveTasks();
        renderTasks(currentFilter);
      });

      taskList.appendChild(li);
    });

  }

  addTaskBtn.addEventListener("click", function(){
    const text = taskInput.value.trim();
    if(text) {
      tasks.push({ text: text, completed: false });
      saveTasks();
      renderTasks(); 
      taskInput.value = "";
    }

  });

  filter.forEach(function(button) {
    button.addEventListener("click", function(){
      filter.forEach(function(btn){
        btn.classList.remove("active");
      });
      button.classList.add("active");
      renderTasks(button.dataset.filter);
    });

  });

  renderTasks();
});
