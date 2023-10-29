var tasks = [];

var taskInput = document.getElementById("task-input");
var addButton = document.getElementById("add-btn");

addButton.addEventListener("click", function () {
  var currTime = new Date();
  activityLogsList.push("Task " + taskInput.value + " added at " + currTime);
  localStorage.setItem("activityLogs", JSON.stringify(activityLogsList));
  addTask();
});
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    var currTime = new Date();
    activityLogsList.push("Task " + taskInput.value + " added at " + currTime);
    localStorage.setItem("activityLogs", JSON.stringify(activityLogsList));
    addTask();
  }
});

document
  .getElementById("taskTags")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      var currTime = new Date();
      activityLogsList.push(
        "Task " + taskInput.value + " added at " + currTime
      );
      localStorage.setItem("activityLogs", JSON.stringify(activityLogsList));
      addTask();
    }
  });

document
  .getElementById("task_category")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      var currTime = new Date();
      activityLogsList.push(
        "Task " + taskInput.value + " added at " + currTime
      );
      localStorage.setItem("activityLogs", JSON.stringify(activityLogsList));
      addTask();
    }
  });

var IDcounter = 0,
  num = 0;

function addTask() {
  var task = taskInput.value;

  if (task.trim() !== "") {
    const priorityInput = document.getElementById("task_priority");
    const categoryInput = document.getElementById("task_category");
    const dueDateInput = document.getElementById("task_due_date");
    const reminderInput = document.getElementById("reminder");
    var inputTags = document.getElementById("taskTags");
    var tagsInput = inputTags.value;
    var tagsArray = tagsInput.split(",").map((tag) => tag.trim());

    var task_dueDate = extractDueDate(task);
    task = task_dueDate[0];
    var dueDate = task_dueDate[1];

    const reminderDateTime = new Date(reminderInput.value);
    const currentTime = new Date();
    if (reminderDateTime <= currentTime) {
      alert("Please choose a future date and time for the reminder.");
      return;
    }

    const newtask = {
      id: IDcounter++,
      text: task,
      done: false,
      subtask: [],
      priority: priorityInput.value,
      category: categoryInput.value,
      dueDate: dueDate,
      IDcounterSub: num,
      tags: tagsArray,
      reminder: reminderInput.value,
    };
    tasks.push(newtask);
    taskInput.value = "";
    categoryInput.value = "";
    dueDateInput.value = "";
    priorityInput.value = "Low";
    inputTags.value = "";
    reminderInput.value = "";
    setReminder(newtask);

    taskInput.focus();
    localStorage.setItem("ToDoListItems", JSON.stringify(tasks));
    localStorage.setItem("counter", JSON.stringify(IDcounter));
    sortby.value = "None";
    searchInput.value = "";
    document.getElementById("start_date").value = "";
    document.getElementById("end_date").value = "";
    document.getElementById("filter_category").value = "";
    document.getElementById("filter_priority").value = "All";
    displayTasks(tasks.filterTasks().searchTasks().sortBy());
  }
}

function extractDueDate(todoText) {
  const dateRegex =
    /(\d{1,2}(?:st|nd|rd|th)? (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{1,2}(?::\d{2})? [ap]m)/i;
  const todayRegex = /by today/i;
  const tomorrowRegex = /by tomorrow/i;

  let dueDate = null;
  let textWithoutDate = todoText.trim();

  const dateMatch = todoText.match(dateRegex);
  if (dateMatch) {
    dueDate = new Date(dateMatch[0]);
    textWithoutDate = textWithoutDate.replace(dateRegex, "").trim();
  } else if (todayRegex.test(todoText)) {
    dueDate = new Date();
    textWithoutDate = textWithoutDate.replace(todayRegex, "").trim();
  } else if (tomorrowRegex.test(todoText)) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dueDate = tomorrow;
    textWithoutDate = textWithoutDate.replace(tomorrowRegex, "").trim();
  }

  if (textWithoutDate === "") {
    textWithoutDate = todoText.trim();
  }

  if (dueDate) {
    const day = dueDate.getDate();
    const month = dueDate.getMonth() + 1;
    const year = dueDate.getFullYear();

    dueDate = day + "-" + month + "-" + year;
    return [textWithoutDate, dueDate];
  } else {
    return [textWithoutDate, ""];
  }
}

function setReminder(task) {
  if (task.reminder == "") {
    return;
  }
  const reminderDateTime = new Date(task.reminder);
  const currentTime = new Date();

  const timeDifference = reminderDateTime.getTime() - currentTime.getTime();

  setTimeout(() => {
    alert("Reminder: " + task.text);
  }, timeDifference);
}

function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("ToDoListItems", JSON.stringify(tasks));
  displayTasks(tasks.filterTasks().searchTasks().sortBy());
}

function editTask(index) {
  const taskElement = document.getElementById("listItem_" + index);
  var childElements = taskElement.childNodes;

  var edittedTask = document.createElement("input");
  edittedTask.type = "text";
  edittedTask.value = tasks[index].text;
  childElements[0].childNodes[1].replaceWith(edittedTask);
  childElements[0].childNodes[0].remove();
  edittedTask.focus();

  var saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.className = "save-btn";
  childElements[1].childNodes[0].replaceWith(saveButton);
  childElements[1].childNodes[1].remove();

  function saveTask() {
    if (edittedTask.value.trim() !== "") {
      tasks[index].text = edittedTask.value;
      localStorage.setItem("ToDoListItems", JSON.stringify(tasks));
      displayTasks(tasks.filterTasks().searchTasks().sortBy());
    } else {
      deleteTask(index);
    }
  }
  saveButton.addEventListener("click", function () {
    var currTime = new Date();
    activityLogsList.push(
      "Task " +
        tasks[index].text +
        "'s name cahnged to  " +
        edittedTask.value +
        " at " +
        currTime
    );
    localStorage.setItem("activityLogs", JSON.stringify(activityLogsList));
    saveTask();
  });
  edittedTask.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      var currTime = new Date();
      activityLogsList.push(
        "Task " +
          tasks[index].text +
          "'s name cahnged to  " +
          edittedTask.value +
          " at " +
          currTime
      );
      localStorage.setItem("activityLogs", JSON.stringify(activityLogsList));
      saveTask();
    }
  });
}

function completeTask(index) {
  const taskElement = document.getElementById("listItem_" + index);
  var childElements = taskElement.childNodes;
  childElements[0].childNodes[1].style.textDecoration = "line-through";
  childElements[0].childNodes[0].childNodes[0].checked = true;
  childElements[0].style.opacity = 0.4;
  childElements[1].childNodes[0].remove();
  tasks[index].done = true;
  localStorage.setItem("ToDoListItems", JSON.stringify(tasks));
}

function restoreTask(index) {
  const taskElement = document.getElementById("listItem_" + index);
  var childElements = taskElement.childNodes;
  childElements[0].style.textDecoration = "None";
  childElements[0].childNodes[0].childNodes[0].checked = false;
  tasks[index].done = false;
  localStorage.setItem("ToDoListItems", JSON.stringify(tasks));
  displayTasks(tasks.filterTasks().searchTasks().sortBy());
}

function deleteSubTask(taskIndex, subTaskIndex) {
  var subTasks = tasks[taskIndex].subtask;
  subTasks.splice(subTaskIndex, 1);
  localStorage.setItem("ToDoListItems", JSON.stringify(tasks));
  displaySubTasks(taskIndex);
}

function editSubTask(taskIndex, subTaskIndex) {
  var taskElement = document.getElementById("subTaskList_" + taskIndex)
    .childNodes[subTaskIndex];
  var childElements = taskElement.childNodes;

  var edittedTask = document.createElement("input");
  edittedTask.type = "text";
  edittedTask.value = tasks[taskIndex].subtask[subTaskIndex].text;
  childElements[0].childNodes[1].replaceWith(edittedTask);
  childElements[0].childNodes[0].remove();
  edittedTask.focus();

  var saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.className = "save-btn";
  childElements[1].childNodes[0].replaceWith(saveButton);
  childElements[1].childNodes[1].remove();

  function saveSubTask() {
    if (edittedTask.value.trim() !== "") {
      tasks[taskIndex].subtask[subTaskIndex].text = edittedTask.value;
      localStorage.setItem("ToDoListItems", JSON.stringify(tasks));
      displaySubTasks(taskIndex);
    } else {
      deleteSubTask(taskIndex, subTaskIndex);
    }
  }
  saveButton.addEventListener("click", saveSubTask);
  edittedTask.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      saveSubTask();
    }
  });
}

function completeSubTask(taskIndex, subTaskIndex) {
  var taskElement = document.getElementById("subTaskList_" + taskIndex)
    .childNodes[subTaskIndex];
  var childElements = taskElement.childNodes;
  childElements[0].childNodes[1].style.textDecoration = "line-through";
  childElements[0].childNodes[0].childNodes[0].checked = true;
  childElements[0].style.opacity = 0.4;
  childElements[1].childNodes[0].remove();
  tasks[taskIndex].subtask[subTaskIndex].done = true;
  localStorage.setItem("ToDoListItems", JSON.stringify(tasks));
}

function restoreSubTask(taskIndex, subTaskIndex) {
  var taskElement = document.getElementById("subTaskList_" + taskIndex)
    .childNodes[subTaskIndex];
  var childElements = taskElement.childNodes;
  childElements[0].style.textDecoration = "None";
  childElements[0].childNodes[0].childNodes[0].checked = false;
  tasks[taskIndex].subtask[subTaskIndex].done = false;
  localStorage.setItem("ToDoListItems", JSON.stringify(tasks));
  displaySubTasks(taskIndex);
}

function slideWindow(index) {
  const taskElement = document.getElementById("slideContainer_" + index);
  const toggleElement = document.getElementById("toggleButton_" + index);
  if (taskElement.style.maxHeight) {
    taskElement.style.maxHeight = null;
    toggleElement.textContent = "Show Subtasks";
  } else {
    toggleElement.textContent = "Hide";
    displaySubTasks(index);
  }
}

function addSubTask(index) {
  var taskInputSub = document.getElementById("taskInputSub_" + index);

  var taskName = taskInputSub.value;

  var subTasks = tasks[index].subtask;
  if (taskName.trim() !== "") {
    const newSubtask = {
      id: tasks[index].IDcounterSub++,
      text: taskName,
      done: false,
    };
    taskInputSub.value = "";
    taskInputSub.focus();
    subTasks.push(newSubtask);
    localStorage.setItem("ToDoListItems", JSON.stringify(tasks));
    displaySubTasks(index);
  }
}

function displaySubTasks(index) {
  const taskElement = document.getElementById("slideContainer_" + index);
  var subTaskList = document.getElementById("subTaskList_" + index);

  var addButton = document.getElementById("addButtonSub_" + index);

  subTaskList.innerHTML = "";

  subTasks = tasks[index].subtask;
  if (subTasks.length == 0) {
    var noTask = document.createElement("h3");
    noTask.className = "no-task-message";
    noTask.textContent = "No sub-task added!";
    subTaskList.appendChild(noTask);
  }
  for (var j = 0; j < subTasks.length; j++) {
    var taskText = subTasks[j].text;

    var listItem = document.createElement("li");
    listItem.style.backgroundColor = "#eeeee4";
    listItem.id = "listItemSub_" + j;
    listItem.draggable = true;

    // Add dragstart and dragover event listeners for subtasks
    (function (subTaskID) {
      listItem.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", subTaskID);
      });
    })(subTasks[j].id);

    (function (index) {
      listItem.addEventListener("dragover", (event) => {
        event.preventDefault();
      });
    })(j);

    var listItemContainer = document.createElement("div");
    listItemContainer.className = "list-Item-Container";
    listItemContainer.id = "listItemContainerSub_" + j;

    var textContainer = document.createElement("div");
    textContainer.className = "text-Container";
    textContainer.textContent = taskText;
    textContainer.id = "textContainerSub_" + j;

    var listButtonContainer = document.createElement("div");
    listButtonContainer.className = "list-btn-container";
    listButtonContainer.id = "listButtonContainerSub_" + j;

    var editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-btn";
    editButton.id = "editButtonSub_" + j;

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.id = "deleteButtonSub_" + j;

    var completeButtonContainer = document.createElement("div");
    completeButtonContainer.className = "complete-btn-container";
    completeButtonContainer.id = "completeButtonContainerSub_" + j;

    var completeButton = document.createElement("input");
    completeButton.type = "checkbox";
    completeButton.textContent = "Complete";
    completeButton.className = "complete-btn";
    completeButton.id = "completeButtonSub_" + j;

    (function (taskIndex, subTaskIndex) {
      deleteButton.addEventListener("click", function () {
        deleteSubTask(taskIndex, subTaskIndex);
      });
    })(index, j);

    (function (taskIndex, subTaskIndex) {
      editButton.addEventListener("click", function () {
        taskElement.style.maxHeight =
          taskElement.scrollHeight + addButton.scrollHeight + "px";
        editSubTask(taskIndex, subTaskIndex);
      });
    })(index, j);

    (function (taskIndex, subTaskIndex) {
      completeButton.addEventListener("change", function () {
        if (tasks[taskIndex].subtask[subTaskIndex].done == false) {
          completeSubTask(taskIndex, subTaskIndex);
        } else {
          restoreSubTask(taskIndex, subTaskIndex);
        }
      });
    })(index, j);

    listButtonContainer.appendChild(editButton);
    listButtonContainer.appendChild(deleteButton);
    completeButtonContainer.appendChild(completeButton);
    listItemContainer.appendChild(completeButtonContainer);
    listItemContainer.appendChild(textContainer);
    listItem.appendChild(listItemContainer);
    listItem.appendChild(listButtonContainer);
    subTaskList.appendChild(listItem);
  }
  taskElement.style.maxHeight = taskElement.scrollHeight + "px";

  for (var j = 0; j < subTasks.length; j++) {
    if (subTasks[j].done) {
      completeSubTask(index, j);
    }
  }
}

function showTaskInfo(index) {
  var task = tasks[index];
  var taskInfoSpan = document.querySelector("#task_info_" + index);
  const isInfoVisible = taskInfoSpan.innerHTML !== "";
  if (isInfoVisible) {
    taskInfoSpan.innerHTML = "";
  } else {
    taskInfoSpan.innerHTML = `<br>Priority: ${task.priority}<br>Category: ${task.category}<br>Due Date: ${task.dueDate}<br>Tags: ${task.tags}`;
  }
}

var filterButton = document.getElementById("filter_button");
filterButton.addEventListener("click", function () {
  displayTasks(tasks.filterTasks().searchTasks().sortBy());
});

Array.prototype.filterTasks = function () {
  return this.filter((task) => {
    return (
      isPriorityMatching(task) &&
      isCategoryMatching(task) &&
      isDueDateMatching(task)
    );
  });
};

function isPriorityMatching(task) {
  const priority = document.getElementById("filter_priority").value;
  return priority === "All" || priority == task.priority;
}

function isCategoryMatching(task) {
  const category = document.getElementById("filter_category").value;
  return (
    category === "" || category.toLowerCase() == task.category.toLowerCase()
  );
}

function isDueDateMatching(task) {
  const startDate = document.getElementById("start_date").value;
  const endDate = document.getElementById("end_date").value;
  return (
    (startDate == "" && endDate == "") ||
    (task.dueDate != "" && startDate == "" && task.dueDate <= endDate) ||
    (task.dueDate != "" && endDate == "" && task.dueDate >= startDate) ||
    (task.dueDate != "" && task.dueDate >= startDate && task.dueDate <= endDate)
  );
}

var sortby = document.getElementById("sorting");
sortby.addEventListener("change", function () {
  displayTasks(tasks.filterTasks().searchTasks().sortBy());
});

Array.prototype.sortBy = function () {
  var str = sortby.value;
  var temp = [...this]; // shallow copy
  if (str == "Priority") {
    return sortByPriority(temp);
  } else if (str == "Due Date") {
    return sortByDueDate(temp);
  } else if (str == "Name") {
    return sortByName(temp);
  } else {
    return this;
  }
};

function sortByPriority(temp) {
  const priorityMap = {
    Low: 1,
    Medium: 2,
    High: 3,
  };
  temp.sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);
  return temp;
}

function sortByDueDate(temp) {
  temp.sort((a, b) => {
    if (a.dueDate == "") return 1;
    if (b.dueDate == "") return -1;
    return a.dueDate - b.dueDate;
  });
  return temp;
}

function sortByName(temp) {
  temp.sort((a, b) => a.text.localeCompare(b.text));
  return temp;
}

var searchButton = document.getElementById("search-button");
var searchInput = document.getElementById("search-input");

searchButton.addEventListener("click", function () {
  displayTasks(tasks.filterTasks().searchTasks().sortBy());
});

searchInput.addEventListener("input", function () {
  displayTasks(tasks.filterTasks().searchTasks().sortBy());
});

Array.prototype.searchTasks = function () {
  // Check if the input is an exact task name
  var input = searchInput.value;
  const exactMatch = this.filter(
    (task) => task.text.toLowerCase() === input.toLowerCase()
  );

  // Check if the input is a tag search
  const isTagSearch = input.startsWith("#");
  if (isTagSearch) {
    const tag = input.slice(1).toLowerCase();
    if (tag) {
      const tagMatches = tasks.filter((task) =>
        task.tags.map((t) => t.toLowerCase()).includes(tag)
      );
      return tagMatches;
    }
  }

  // Check if the input contains a partial keyword
  const partialMatches = this.filter((task) =>
    task.text.toLowerCase().includes(input.toLowerCase())
  );

  // Check if the input matches any subtask
  const subtaskMatches = this.filter((task) => {
    return task.subtask.some(
      (subtask) => subtask.text.toLowerCase() === input.toLowerCase()
    );
  });

  const allMatches = [...exactMatch, ...partialMatches, ...subtaskMatches];
  const uniqueMatches = allMatches.filter(
    (task, index, self) => index === self.findIndex((t) => t.id === task.id)
  );
  return uniqueMatches;
};

var isBacklogButttonToggled = false;

var backlogButton = document.getElementById("backlog-btn");
backlogButton.addEventListener("click", function () {
  sortby.value = "None";
  searchInput.value = "";
  document.getElementById("start_date").value = "";
  document.getElementById("end_date").value = "";
  document.getElementById("filter_category").value = "";
  document.getElementById("filter_priority").value = "All";
  isBacklogButttonToggled = !isBacklogButttonToggled;
  if (isBacklogButttonToggled) {
    displayTasks(tasks.filterTasks().searchTasks().sortBy().backlogs());
    backlogButton.textContent = "Close Backlogs";
  } else {
    backlogButton.textContent = "Show Backlogs";
    displayTasks(tasks.filterTasks().searchTasks().sortBy());
  }
});

var isactivitylogButttonToggled = false;

var activitylogButton = document.getElementById("activitylog-btn");
activitylogButton.addEventListener("click", function () {
  sortby.value = "None";
  searchInput.value = "";
  document.getElementById("start_date").value = "";
  document.getElementById("end_date").value = "";
  document.getElementById("filter_category").value = "";
  document.getElementById("filter_priority").value = "All";
  isactivitylogButttonToggled = !isactivitylogButttonToggled;
  if (isactivitylogButttonToggled) {
    displayActivitylogs();
    activitylogButton.textContent = "Close activitylogs";
  } else {
    activitylogButton.textContent = "Show activitylogs";
    displayTasks(tasks.filterTasks().searchTasks().sortBy());
  }
});

var activityLogsList = [];

function displayActivitylogs() {
  var taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  for (var i = activityLogsList.length - 1; i >= 0; i--) {
    var listItem = document.createElement("li");
    listItem.textContent = activityLogsList[i];
    taskList.appendChild(listItem);
  }
}

Array.prototype.backlogs = function () {
  const currentDateTime = new Date();

  const day = currentDateTime.getDate();
  const month = currentDateTime.getMonth() + 1;
  const year = currentDateTime.getFullYear();

  const currentDate = year + "-" + month + "-" + day;
  return this.filter(
    (task) => task.dueDate != "" && task.dueDate < currentDate
  );
};

var taskList = document.getElementById("task-list");
taskList.addEventListener("dragend", handleDrop);
taskList.addEventListener("drop", handleDrop);

function handleDrop(event) {
  event.preventDefault();
  const data = JSON.parse(event.dataTransfer.getData("text/plain"));
  const target = event.target;
  const parentList = target.closest("ul");

  if (parentList.id == "task-list") {
    const newData = tasks.find((task) => task.id === data);
    tasks.splice(tasks.indexOf(newData), 1);
    tasks.splice(target.id.split("_")[1], 0, newData);
    localStorage.setItem("ToDoListItems", JSON.stringify(tasks));
    var currTime = new Date();
    activityLogsList.push(
      "Task " +
        tasks[tasks.indexOf(newData)].text +
        "'s position changed at " +
        currTime
    );
    localStorage.setItem("activityLogs", JSON.stringify(activityLogsList));
    localStorage.setItem("ToDoListItems", JSON.stringify(tasks));
    displayTasks(tasks);
  }
}

function handleDropSub(event, index) {
  event.preventDefault();
  const data = JSON.parse(event.dataTransfer.getData("text/plain"));
  const target = event.target;
  const parentList = target.closest("ul");

  if (parentList.className == "subTask-list") {
    var subtasks = tasks[index].subtask;
    const newData = subtasks.find((subtask) => subtask.id === data);
    tasks[index].subtask.splice(subtasks.indexOf(newData), 1);
    tasks[index].subtask.splice(target.id.split("_")[1], 0, newData);
    localStorage.setItem("ToDoListItems", JSON.stringify(tasks));
    displaySubTasks(index);
  }
}

const slideButtonBottom = document.getElementById("slideButtonBottom");
const slidingElementBottom = document.getElementById("slidingElementBottom");

slideButtonBottom.addEventListener("click", () => {
  // Check if the element is already visible
  const isVisible = slidingElementBottom.style.display === "block";

  // Slide in or out based on the current visibility
  if (isVisible) {
    slidingElementBottom.style.display = "none"; // Slide out
    slideButtonBottom.textContent = "Add a task";
  } else {
    slidingElementBottom.style.display = "block"; // Slide in
    slideButtonBottom.textContent = "Slide down";
  }
});

slideButtonFilter.addEventListener("click", () => {
  // Check if the element is already visible
  const isVisible = slidingElementFilter.style.display === "block";

  // Slide in or out based on the current visibility
  if (isVisible) {
    slidingElementFilter.style.display = "none"; // Slide out
    slideButtonFilter.textContent = "Filter tasks";
  } else {
    slidingElementFilter.style.display = "block"; // Slide in
    slideButtonFilter.textContent = "Close filter";
  }
});

function displayTasks(TasksArray) {
  var taskList = document.getElementById("task-list");
  taskList.innerHTML = "";
  if (isBacklogButttonToggled) {
    TasksArray = TasksArray.backlogs();
  }
  if (TasksArray.length === 0) {
    var noTask = document.createElement("h3");
    noTask.className = "no-task-message";
    noTask.textContent = "No task found!";
    taskList.appendChild(noTask);
  } else {
    for (const task of TasksArray) {
      var taskText = task.text;
      var i = tasks.indexOf(task);
      // for (var i = 0; i < TasksArray.length; i++) {
      //   var taskText = TasksArray[i].text;
      //   var task = TasksArray[i];
      var listOuter = document.createElement("div");
      listOuter.className = "list-outer";
      listOuter.id = "listOuter_" + i;

      var listItem = document.createElement("li");
      listItem.id = "listItem_" + i;
      listItem.draggable = true;

      (function (taskID) {
        listItem.addEventListener("dragstart", (event) => {
          event.dataTransfer.setData("text/plain", taskID);
        });
      })(task.id);

      (function (index) {
        listItem.addEventListener("dragover", (event) => {
          event.preventDefault();
        });
      })(i);

      var listItemContainer = document.createElement("div");
      listItemContainer.className = "list-Item-Container";
      listItemContainer.id = "listButtonContainer_" + i;

      var textContainer = document.createElement("div");
      textContainer.className = "text-Container";
      textContainer.textContent = taskText;
      textContainer.id = "textContainer_" + i;

      var listButtonContainer = document.createElement("div");
      listButtonContainer.className = "list-btn-container";
      listButtonContainer.id = "listButtonContainer_" + i;

      var editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.className = "edit-btn";
      editButton.id = "editButton_" + i;

      var deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete-btn";
      deleteButton.id = "deleteButton_" + i;

      var completeButtonContainer = document.createElement("div");
      completeButtonContainer.className = "complete-btn-container";
      completeButtonContainer.id = "completeButtonContainer_" + i;

      var completeButton = document.createElement("input");
      completeButton.type = "checkbox";
      completeButton.textContent = "Complete";
      completeButton.className = "complete-btn";
      completeButton.id = "completeButton_" + i;

      var toggleButton = document.createElement("button");
      toggleButton.className = "toggle-btn";
      toggleButton.textContent = "Show Subtasks";
      toggleButton.id = "toggleButton_" + i;

      var slideContainer = document.createElement("div");
      slideContainer.className = "slideContainer";
      slideContainer.id = "slideContainer_" + i;

      var subTaskList = document.createElement("ul");
      subTaskList.className = "subTask-list";
      subTaskList.id = "subTaskList_" + i;

      (function (index) {
        subTaskList.addEventListener("dragend", function () {
          handleDropSub(event, index);
        });
      })(i);

      (function (index) {
        subTaskList.addEventListener("drop", function () {
          handleDropSub(event, index);
        });
      })(i);

      var addButtonSub = document.createElement("button");
      addButtonSub.className = "add-btn-sub";
      addButtonSub.textContent = "Add";
      addButtonSub.id = "addButtonSub_" + i;

      var taskInputSub = document.createElement("input");
      taskInputSub.type = "text";
      taskInputSub.placeholder = "Enter a sub-task...";
      taskInputSub.id = "taskInputSub_" + i;

      var bottomBox = document.createElement("div");
      bottomBox.className = "bottom-box-sub";
      bottomBox.id = "bottomBox_" + i;

      bottomBox.appendChild(taskInputSub);
      bottomBox.appendChild(addButtonSub);

      (function (index) {
        addButtonSub.addEventListener("click", function () {
          var currTime = new Date();
          activityLogsList.push(
            "Subtask " +
              taskInputSub.value +
              " added to task " +
              taskText +
              " at " +
              currTime
          );
          localStorage.setItem(
            "activityLogs",
            JSON.stringify(activityLogsList)
          );
          addSubTask(index);
        });
      })(i);

      (function (index) {
        taskInputSub.addEventListener("keydown", function (event) {
          if (event.key === "Enter") {
            var currTime = new Date();
            activityLogsList.push(
              "Subtask " +
                taskInputSub.value +
                " added to task " +
                taskText +
                " at " +
                currTime
            );
            localStorage.setItem(
              "activityLogs",
              JSON.stringify(activityLogsList)
            );
            addSubTask(index);
          }
        });
      })(i);

      var infoButton = document.createElement("button");
      infoButton.innerHTML = "Info";
      infoButton.classList.add("info-btn");

      const taskInfoSpan = document.createElement("span");
      taskInfoSpan.id = "task_info_" + i;

      (function (index) {
        infoButton.addEventListener("click", function () {
          showTaskInfo(index);
        });
      })(i);

      (function (index) {
        deleteButton.addEventListener("click", function () {
          var currTime = new Date();
          activityLogsList.push(
            "Task " + tasks[index] + " deleted at " + currTime
          );
          localStorage.setItem(
            "activityLogs",
            JSON.stringify(activityLogsList)
          );
          deleteTask(index);
        });
      })(i);

      (function (index) {
        editButton.addEventListener("click", function () {
          editTask(index);
        });
      })(i);

      (function (index) {
        completeButton.addEventListener("change", function () {
          if (tasks[index].done == false) {
            var currTime = new Date();
            activityLogsList.push(
              "Task " + tasks[index] + " got completed at " + currTime
            );
            localStorage.setItem(
              "activityLogs",
              JSON.stringify(activityLogsList)
            );
            completeTask(index);
          } else {
            var currTime = new Date();
            activityLogsList.push(
              "Task " + tasks[index] + " got restored at " + currTime
            );
            localStorage.setItem(
              "activityLogs",
              JSON.stringify(activityLogsList)
            );
            restoreTask(index);
          }
        });
      })(i);

      (function (index) {
        toggleButton.addEventListener("click", function () {
          slideWindow(index);
        });
      })(i);

      listButtonContainer.appendChild(editButton);
      listButtonContainer.appendChild(deleteButton);
      listButtonContainer.appendChild(infoButton);
      listButtonContainer.appendChild(taskInfoSpan);
      completeButtonContainer.appendChild(completeButton);
      listItemContainer.appendChild(completeButtonContainer);
      listItemContainer.appendChild(textContainer);
      listItem.appendChild(listItemContainer);
      listItem.appendChild(listButtonContainer);
      listItem.appendChild(toggleButton);
      listOuter.appendChild(listItem);
      slideContainer.appendChild(subTaskList);
      slideContainer.appendChild(bottomBox);
      listOuter.appendChild(slideContainer);
      taskList.appendChild(listOuter);

      if (task.done) {
        completeTask(i);
      }
    }
  }
}

function getArrayFromLocalStorage() {
  var storedArrayString = localStorage.getItem("ToDoListItems");
  var IDcounterStored = localStorage.getItem("counter");
  var storedActivityLogs = localStorage.getItem("activityLogs");
  return [
    JSON.parse(storedArrayString),
    IDcounterStored,
    JSON.parse(storedActivityLogs),
  ];
}

document.addEventListener("DOMContentLoaded", function () {
  var myStoredArray = getArrayFromLocalStorage()[0];
  if (myStoredArray) {
    IDcounter = getArrayFromLocalStorage()[1];
    tasks = myStoredArray;
    activityLogsList = getArrayFromLocalStorage()[2];
    displayTasks(tasks);
    tasks.forEach((task) => setReminder(task));
  }
});
// localStorage.clear();
taskInput.focus();
