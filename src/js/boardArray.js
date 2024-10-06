let taskArrayBoard = [];
let titleBoard = [];
let descriptionBoard =[];
let imageUrlBoard = [];
let userNamesBoard = [];
let ToDoBoard = [];

let subtasksOpenArray = [];
let subtasksEditArrayFinish = [];
let subtasksEditArrayOrigin = [];
let assignedToUserArrayOpen = [];
let subtaskStatusArray = [];
let assignedToEditName = []
let assignedToEditUrl = [];
let showSubtasksEdit = [];
let subtasksStatusArrayEdit = [];
let subtasksEditArrayDelete = [];
let showSubtaskConrolFalse = false;
let subtasksControlGlobal = [];


async function initDataBoard() {
  taskArrayBoard = [];
  taskkeysGlobal.length = 0;
  try {
    const [task, fetchImageUrls, fetchUserNames] = await Promise.all([
      onloadDataBoard("/tasks"),
      fetchImagesUrlsBoardNew("/"),
      fetchUserNamesBoardNew("/")
    ]);
    if (!task || typeof task !== "object") {
      console.warn("No valid task data available.");
      return;
    }
    if (!Array.isArray(fetchImageUrls) || !Array.isArray(fetchUserNames)) {
      console.warn("No valid user data available.");
      return;
    }
    if (fetchImageUrls.length !== fetchUserNames.length) {
      console.warn("Mismatch in number of images and user names.");
      return;
    }
    fetchImageUrls.forEach((elementUrl, index) => {
      const elementNames = fetchUserNames[index]?.name;
      imageUrlBoard.push(elementUrl);
      if (elementNames) {
        userNamesBoard.push(elementNames);
      }
    });
    taskkeys = Object.keys(task);
    if (taskkeys.length === 0) {
      console.warn("No tasks found.");
      return;
    }
    taskkeysGlobal.push(...taskkeys);
    await generateHTMLObjectsBoard(taskkeys, task);
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

/**
 * Loads data from the specified path and returns the parsed JSON response.
 * 
 * @param {string} [path=""] - The path to the JSON data.
 * @returns {Promise<Object>} - A promise that resolves to the parsed JSON data.
 */
async function onloadDataBoard(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}

/**
 * Fetches image URLs from the contacts in the JSON data at the specified path.
 * 
 * @param {string} [path=""] - The path to the JSON data.
 * @returns {Promise<string[]>} - A promise that resolves to an array of image URLs.
 */
async function fetchImagesUrlsBoardNew(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  let contacts = responseToJson.contacts;
  let imageUrl = Object.values(contacts).map((contact) => contact.img);
  return imageUrl;
}

/**
 * Fetches user names from the contacts in the JSON data at the specified path.
 * 
 * @param {string} [path=""] - The path to the JSON data.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing user names.
 */
async function fetchUserNamesBoardNew(path = "") {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    if (!response.ok) {
      throw new Error(`Netzwerkfehler: ${response.status} ${response.statusText}`);
    }
    let responseToJson = await response.json();
    let contacts = responseToJson.contacts;
    if (!contacts || typeof contacts !== 'object') {
      console.warn("Keine gültigen Kontakte gefunden");
      return [];
    }
    const extractNamesBoard = (contacts) => {
      return Object.values(contacts).map((entry) => ({ name: entry.name }));
    };
    const names = extractNamesBoard(contacts);
    return names;
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzernamen:", error);
    return [];
  }
}

 /**
 * Generates HTML objects for the task board based on provided task keys and task data.
 * 
 * @param {Array<string>} taskkeys - An array of keys representing tasks.
 * @param {Object} task - An object containing task details for each key.
 */
async function generateHTMLObjectsBoard(taskkeys, task) {
  if (!Array.isArray(taskArrayBoard)) {
    console.error("taskArrayBoard ist nicht definiert oder kein Array.");
    return;
  }
  for (let index = 0; index < taskkeys.length; index++) {
    const taskData = task[taskkeys[index]];
    if (!Array.isArray(taskData) || taskData.length === 0) {
      console.warn(`Keine gültigen Daten für Task mit Schlüssel ${taskkeys[index]}`);
      continue;
    }
    const taskItem = taskData[0];
    const { category, description, dueDate, prio, title, boardCategory, assignedTo = [], subtasks = [], subtaskStatus = [] } = taskItem;
    taskArrayBoard.push({title, description, dueDate, category, prio, boardCategory, assignedTo, subtasks, subtaskStatus});
  }
  upstreamHTMLrender();
}

/**
 * Generates HTML objects for the task board based on provided task keys and task data.
 * 
 * @param {Array<string>} taskkeys - An array of keys representing tasks.
 * @param {Object} task - An object containing task details for each key.
 */
function upstreamHTMLrender() {
  let position = document.getElementById('todo') || 
                 document.getElementById('progress') || 
                 document.getElementById('feedback') || 
                 document.getElementById('done');
  if (!position) {
    console.error("Kein gültiges Positionselement gefunden.");
    return;
  }
  position.innerHTML = '';
  if (!Array.isArray(taskArrayBoard) || taskArrayBoard.length === 0) {
    console.warn("taskArrayBoard ist leer oder nicht definiert.");
    return;
  }
  for (let index = 0; index < taskArrayBoard.length; index++) {
    const element = taskArrayBoard[index];
    const { category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks, subtaskStatus } = element;
    positionOfHTMLBlockBoard(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks, subtaskStatus);
    searchIndexUrlBoard(index, assignedTo);
    searchprioBoard(index, prio);
    subtasksRenderBoard(index, subtasks);
    CategoryColor(index, category);
    progressBar(index, subtasks, subtaskStatus);
  }
}

/**
 * Updates the priority display for a specific task on the board based on the given priority level.
 * 
 * @param {number} index - The index of the task for which to display the priority.
 * @param {string} prio - The priority level of the task (e.g., "Urgent", "Medium", "Low").
 */    
function searchprioBoard(index, prio) {
  let position = document.getElementById(`prioPosition${index}`);
  position.innerHTML = "";
  if (prio == "Urgent") {
    position.innerHTML = `<img  src="../public/img/Prio alta.png" alt="">`;
  } else {
    if (prio == "Medium") {
      position.innerHTML = `<img  src="../public/img/prioOrange.png" alt="">`;
    } else {
      if (prio == "Low") {
        position.innerHTML = `<img src="../public/img/Prio baja.png" alt="">`;
      }
    }
  }
}

/**
 * Positions an HTML block for the board.
 * 
 * @param {number} index - The index of the task.
 * @param {string} category - The category of the task.
 * @param {string} description - The description of the task.
 * @param {string} dueDate - The due date of the task.
 * @param {string} prio - The priority of the task.
 * @param {string} title - The title of the task.
 * @param {string} boardCategory - The board category of the task.
 * @param {string} assignedTo - The user assigned to the task.
 * @param {string} subtasks - The subtasks associated with the task.
 * @param {string} subtaskStatus - The status of the subtasks.
 */
function positionOfHTMLBlockBoard(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks, subtaskStatus) {
  let position = document.getElementById(boardCategory);
  let taskContainer = document.createElement('div');
  taskContainer.id = `parentContainer${index}`;
  taskContainer.draggable = true;
  taskContainer.className = "board-task-container pointer bradius24 d-flex flex-d-col content-even mg-btt25";
  taskContainer.addEventListener('dragstart', () => startDragging(taskkeys[index]));
  taskContainer.addEventListener('click', () => openTaskToBoardRender(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks, subtaskStatus));
  taskContainer.innerHTML = `
    <div class="d-flex-between" style="position: relative;">
      <h1 id="categoryColor${index}" class="txt-center fs-16 mg-block-none bradius8 color-wh">${category}</h1>
      <img src="/public/img/dots.png" id="dots-parent-container${index}" alt="Options" />
      <div id="taskDropdown${index}" class="task-dropdown d-flex-start flex-d-col p-10 d-none">
        <span>Move to:</span>
        <a href="#" onclick="moveTaskToCategory('${taskkeys[index]}', 'todo')">ToDo</a>
        <a href="#" onclick="moveTaskToCategory('${taskkeys[index]}', 'progress')">Progress</a>
        <a href="#" onclick="moveTaskToCategory('${taskkeys[index]}', 'feedback')">Feedback</a>
        <a href="#" onclick="moveTaskToCategory('${taskkeys[index]}', 'done')">Done</a>
      </div>
      <img onclick="closeOpenTask(${index})" id="closeOpenTask${index}" class="d-none" src="../public/img/Close.png" alt="Close task" />
    </div>
    <div class="width220 mg-top-4">
      <h2 class="mg-block-none fs-16 fw-700">${title}</h2>
    </div>
    <div class="mg-bot-4 mg-top-4">
      <p class="mg-block-none fs-16 fw-400 color-gr width220" id="limitTextDesciption${index}">${description}</p>
    </div>
    <div class="progress-container d-flex-between width220">
      <div id="hideProgressBar${index}" class="width128">
        <div id="progressBar${index}" class="progress-bar pointer"></div>
      </div>
      <div id="hideProgressAmount${index}" class="d-flex">
        <div id="subtasksAmountTrue${index}" class="d-flex-center fs-12 fw-400 color-bl"></div>
        <div id="subtasks${index}" class="subtasksLength fs-12 fw-400 color-bl"></div>
      </div>
    </div>
    <div class="d-flex-between width220">
      <div class="user-image-bord-container" id="userImageBoard${index}"></div>
      <div class="img-32 d-flex-center" id="prioPosition${index}"></div>
    </div>
  `;
  position.appendChild(taskContainer);
}

/**
 * Updates the user images display on the board based on assigned users.
 * 
 * @param {number} indexHTML - The index of the task in the HTML to display user images.
 * @param {Array<number>} assignedTo - An array of indices representing users assigned to the task.
 */
function searchIndexUrlBoard(indexHTML, assignedTo) {
  let position = document.getElementById(`userImageBoard${indexHTML}`);
  position.innerHTML = "";
  if (!assignedTo || assignedTo.length === 0) {
    return;
  }
  const maxImages = Math.min(assignedTo.length, 4);
  const imagesHtml = [];
  for (let index = 0; index < maxImages; index++) {
    let imageUrlNumber = assignedTo[index];
    let imageUrlPositionFromArray = imageUrlBoard[imageUrlNumber];
    if (imageUrlPositionFromArray) {
      imagesHtml.push(`<img class="img-24" src="${imageUrlPositionFromArray}" alt="User Image" />`);
    }
  }
  position.innerHTML = imagesHtml.join("");
  if (assignedTo.length > 4) {
    const remaining = assignedTo.length - 4;
    position.innerHTML += `
      <div class="img-24 more-users-board">
        +${remaining}
      </div>`;
  }
}

/**
 * Updates the display of subtasks count on the board for a specific task.
 * 
 * @param {number} indexHtml - The index of the task in the HTML to display the count of subtasks.
 * @param {Array<string>} subtasks - An array of subtasks associated with the task.
 */
function subtasksRenderBoard(indexHtml, subtasks) {
  let subtaskCountElement = document.querySelector(`.subtasksLength${indexHtml}`);
  if (subtaskCountElement) {
    if (Array.isArray(subtasks)) {
      const count = subtasks.length;
      subtaskCountElement.innerHTML = `<p class="subtasks-board-task-text">${count} Subtasks</p>`;
    } else {
      subtaskCountElement.innerHTML = `<p class="subtasks-board-task-text">0 Subtasks</p>`;
    }
  } else {
    console.error(`Element mit der Klasse .subtasksLength${indexHtml} wurde nicht gefunden.`);
  }
}

/**
 * Sets the background color of a category element based on the specified category.
 * 
 * @param {number} index - The index of the category element to update.
 * @param {string} category - The category type (e.g., "TechnicalTask").
 */
function CategoryColor(index, category) {
  let position = document.getElementById(`categoryColor${index}`);
  if (!position) {
    console.error(`Element mit ID categoryColor${index} wurde nicht gefunden.`);
    return;
  }
  if (category === "TechnicalTask") {
    position.style.backgroundColor = "#1fd7c1";
  } else {
    position.style.backgroundColor = "#0038ff";
  }
}

/**
 * Updates the progress bar and displayed count of completed subtasks for a specific task.
 * 
 * @param {number} index - The index of the task for which to update the progress bar.
 * @param {Array} subtasks - An array of subtasks associated with the task.
 * @param {Array} subtaskStatus - An array representing the completion status of each subtask.
 */
function progressBar(index, subtasks, subtaskStatus) {
  let progressBar = document.getElementById(`progressBar${index}`);
  let positionOfTrueAmount = document.getElementById(`subtasksAmountTrue${index}`);
  if (!Array.isArray(subtasks) || subtasks.length === 0 || !Array.isArray(subtaskStatus)) {
    positionOfTrueAmount.innerHTML = "0/0";
    progressBar.style.width = "0%";
    return;
  }
  let { trueCount, totalCount } = calculateProgress(index, subtasks, subtaskStatus);
  if (totalCount === 0) {
    positionOfTrueAmount.innerHTML = "0/0";
    progressBar.style.width = "0%";
    return;
  }
  positionOfTrueAmount.innerHTML = `${trueCount}/${totalCount}`;
  let progressPercentage = (trueCount / totalCount) * 100;
  updateProgressBar(index, progressPercentage);
}

/**
 * Updates the progress bar width and color based on the percentage of completed subtasks.
 *
 * @param {number} index - The index of the task in the HTML structure.
 * @param {number} progressPercentage - The calculated percentage of completed subtasks.
 */
function updateProgressBar(index, progressPercentage) {
  let progressBar = document.getElementById(`progressBar${index}`);
  if (!progressBar) {
    console.error(`Element nicht gefunden: progressBar${index}`);
    return;
  }
  if (progressPercentage < 0 || progressPercentage > 100) {
    console.error(`Ungültiger Fortschrittsprozentsatz: ${progressPercentage}. Muss zwischen 0 und 100 liegen.`);
    return;
  }
  progressBar.style.width = `${progressPercentage}%`;
  if (progressPercentage === 100) {
    progressBar.style.backgroundColor = "#095a1b";
  } else {
    progressBar.style.backgroundColor = "#007bff";
  }
}

/**
 * Calculates the count of completed subtasks and the total number of subtasks for a given task.
 * 
 * @param {number} index - The index of the task for which to calculate progress.
 * @param {Array} subtasks - An array of subtasks associated with the task.
 * @param {Array} subtaskStatus - An array representing the completion status of each subtask.
 * @returns {{ trueCount: number, totalCount: number }} - An object containing the counts of completed and total subtasks.
 */
function calculateProgress(index, subtasks, subtaskStatus) {
  let trueCount = 0;
  if (!Array.isArray(subtasks) || !Array.isArray(subtaskStatus)) {
    console.warn(`Subtasks oder SubtaskStatus ist kein gültiges Array für Task ${index}`);
    return { trueCount: 0, totalCount: 0 };
  }
  let totalCount = subtasks.length;
  if (totalCount !== subtaskStatus.length) {
    console.warn(`Unterschiedliche Längen von Subtasks und SubtaskStatus für Task ${index}`);
    return { trueCount: 0, totalCount: totalCount };
  }
  for (let i = 0; i < totalCount; i++) {
    if (subtaskStatus[i] === true || subtaskStatus[i] === 1 || subtaskStatus[i] === 'true') {
      trueCount++;
    }
  }
  return { trueCount, totalCount };
}

/**
 * Renders the details of a task in a modal overlay on the board, displaying various task attributes.
 * 
 * @param {number} index - The index of the task to be opened.
 * @param {string} category - The category of the task.
 * @param {string} description - The description of the task.
 * @param {string} dueDate - The due date of the task.
 * @param {string} prio - The priority level of the task.
 * @param {string} title - The title of the task.
 * @param {string} boardCategory - The board category to which the task belongs.
 * @param {Array<number>} assignedTo - An array of user indices assigned to the task.
 * @param {Array<string>} subtasks - An array of subtasks related to the task.
 * @param {Array<boolean>} subtaskStatus - An array representing the completion status of each subtask.
 */
function openTaskToBoardRender(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks, subtaskStatus) {
  let opentaskIndex = index;
  let position = document.getElementById("openTask");
  if (!position) {
    console.error("Element with ID 'openTask' not found.");
    return;
  }
  if (position.classList.contains("modal-overlay")) {
    return;
  } else {
    position.classList.add("modal-overlay");
    position.classList.remove("d-none", "hidden");
    position.style.cssText = "visibility: visible; transform: translateX(100vw); animation: moveIn 200ms ease-in forwards";
    position.innerHTML = openTaskToBoardHtml(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks, subtaskStatus);
    CategoryColorOpen(index, category);
    subtasksRenderOpen(index, subtasks);
    searchIndexUrlOpen(index, assignedTo);
    searchprioBoardOpen(index, prio);
    loadSubtaskStatus(index, subtaskStatus);
    console.log(subtaskStatus);
  }
}

/**
 * Loads and updates the completion status of subtasks based on the provided status string.
 * 
 * @param {number} indexHtml - The index of the HTML element associated with the subtasks.
 * @param {string} subtaskStatus - A comma-separated string representing the completion status of each subtask.
 */
function loadSubtaskStatus(indexHtml, subtaskStatus) {
  console.log(subtaskStatus);
  if (!subtaskStatus || typeof subtaskStatus !== 'string' || subtaskStatus.trim() === '') {
    console.error('Invalid subtask status string provided.');
    return;
  }
  let subtaskStatusArrayDev = subtaskStatus.split(',').map(status => status.trim());
  for (let i = 0; i < subtaskStatusArrayDev.length; i++) {
    const subStatus = subtaskStatusArrayDev[i];
    console.log(subStatus);
    let checkbox = document.getElementById(`subtask-${indexHtml}-${i}`);
    if (checkbox) {
      checkbox.checked = (subStatus === 'true');
    } else {
      console.warn(`Checkbox with ID subtask-${indexHtml}-${i} not found.`);
    }
  }
}

/**
 * Saves the completion status of a subtask to Firebase based on the checkbox state.
 * 
 * @param {number} indexHtml - The index of the HTML element associated with the subtask.
 * @param {number} index - The index of the subtask to update.
 * @returns {Promise<void>} - A promise that resolves when the status is saved.
 */
async function subtaskStatus(indexHtml, index) {
  const checkbox = document.getElementById(`subtask-${indexHtml}-${index}`);
  if (!checkbox) {
    console.error(`Checkbox with ID subtask-${indexHtml}-${index} not found.`);
    return;
  }
  const isChecked = checkbox.checked;
  try {
    await statusSubtaskSaveToFirebase(isChecked, indexHtml, index);
    console.log(`Subtask status for index ${index} updated successfully to ${isChecked}.`);
  } catch (error) {
    console.error(`Failed to save subtask status for index ${index}:`, error);
  }
}

/**
 * Displays the priority icon for a task in the open task view based on the given priority level.
 * 
 * @param {number} index - The index of the task for which to display the priority.
 * @param {string} prio - The priority level of the task (e.g., "Urgent", "Medium", "Low").
 */
function searchprioBoardOpen(index, prio) {
  let position = document.getElementById(`prioPositionOpenTask${index}`);
  if (!position) {
      console.warn(`Element with ID prioPositionOpenTask${index} not found.`);
      return;
  }
  const priorityImages = {
      "Urgent": "../public/img/Prio alta.png",
      "Medium": "../public/img/prioOrange.png",
      "Low": "../public/img/Prio baja.png"
  };
  const imageSrc = priorityImages[prio] || "";
  if (imageSrc) {
      position.innerHTML = `<img src="${imageSrc}" alt="${prio} Priority">`;
  } else {
      position.innerHTML = "";
  }
}

/**
 * Displays user images and names for a specific task in the open task view based on the assigned users.
 * 
 * @param {number} index - The index of the task for which to display assigned user information.
 * @param {string} assignedTo - A comma-separated string of user IDs assigned to the task.
 */
function searchIndexUrlOpen(assignedTo) {
  console.log('assignedTo:', assignedTo, 'Type:', typeof assignedTo);
  if (typeof assignedTo !== 'string') {
      console.error(`Expected assignedTo to be a string, got ${typeof assignedTo}.`);
      return;
  }
  assignedTo = assignedTo.trim();
  let assignedToArray = assignedTo.split(',').map(user => user.trim());
  let position = document.getElementById(`userImageBoardOpen${index}`);
  position.innerHTML = "";
  for (let i = 0; i < assignedToArray.length; i++) {
      const element = assignedToArray[i];
      const images = imageUrlBoard[element];
      const names = userNamesBoard[element];
      if (images && names) {
          position.innerHTML += htmlBoardImageOpen(images, names, i);
      } else {
          console.warn(`No image or name found for user ID: ${element}`);
      }
  }
}

/**
 * Generates HTML for displaying a user's image and name in the open task view.
 * 
 * @param {string} imageUrl - The URL of the user's image.
 * @param {string} userName - The name of the user.
 * @param {number} index - The index of the user in the assigned list.
 * @returns {string} - The HTML string for the user's image and name.
 */
function htmlBoardImageOpen(imageUrl, userName, index) {
  const fallbackImageUrl = '../public/img/defaultUserImage.png';
  const validImageUrl = imageUrl ? imageUrl : fallbackImageUrl;
  return `
    <div class="d-flex pa-7-16">
      <img class="user-image-task-open" src="${validImageUrl}" alt="${userName}'s profile picture">
      <div class="d-flex item-center font-sf fs-19 fw-400">${userName}</div>
    </div>`;
}

async function subtasksRenderOpen(indexHtml, subtasks) {
  if (typeof subtasks !== 'string') {
      console.error(`Expected subtasks to be a string, got ${typeof subtasks}.`);
      return;
  }
  const subtasksArray = subtasks.split(',').map(subtask => subtask.trim());
  const position = document.getElementById(`subtasksBoardOpen${indexHtml}`);
  if (!position) {
      console.error(`Element mit der ID 'subtasksBoardOpen${indexHtml}' nicht gefunden.`);
      return;
  }
  position.innerHTML = "";
  subtasksArray.forEach((element, i) => {
      if (i < subtasksArray.length) {
          position.innerHTML += subtasksRenderOpenHtml(indexHtml, i, element);
      } else {
          console.error(`Index ${i} liegt außerhalb der Grenzen des Subtasks-Arrays.`);
      }
  });
}

/**
 * Generates HTML for a subtask checkbox.
 * 
 * @param {number} indexHtml - The index of the task.
 * @param {number} index - The index of the subtask.
 * @param {string} element - The name of the subtask.
 * @returns {string} The generated HTML for the subtask.
 */
function subtasksRenderOpenHtml(indexHtml, index, element) {
  return `
    <div class="d-flex item-center pa-7-16">
      <input onclick="subtaskStatus('${indexHtml}', '${index}')" class="checkbox-open-Task pointer" type="checkbox" id="subtask-${indexHtml}-${index}">
      <label for="subtask-${indexHtml}-${index}">${element}</label>
    </div>`;
}

/**
 * Saves the status of a subtask to Firebase.
 * 
 * @param {boolean} isChecked - The checked status of the subtask.
 * @param {number} indexHtml - The index of the task in the global task keys.
 * @param {number} index - The index of the subtask.
 */
async function statusSubtaskSaveToFirebase(isChecked, indexHtml, index) {
  if (!Array.isArray(taskkeysGlobal) || taskkeysGlobal.length === 0) {
    console.error("taskkeysGlobal is not defined or is empty.");
    return;
  }
  let successfulUpdates = 0;
  for (const taskKeyId of taskkeysGlobal.map(el => el[indexHtml])) {
    const path = `/tasks/${taskKeyId}/0/subtaskStatus/${index}`;
    try {
      const response = await fetch(`${BASE_URL}${path}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isChecked),
      });
      if (!response.ok) {
        console.error(`Error updating status of subtask checkbox ${index}:`, response.statusText);
      } else {
        successfulUpdates++;
      }
    } catch (error) {
      console.error(`Error saving status of subtask checkbox ${index}:`, error);
    }
  }
  console.log(`Successfully updated status of ${successfulUpdates} subtasks.`);
}

/**
 * Sets the background color of the category element based on the category type.
 *
 * @param {number} index - The index of the task.
 * @param {string} category - The category of the task.
 */
function CategoryColorOpen(index, category) {
  const position = document.getElementById(`categoryColorOpen${index}`);
  if (!position) {
    console.error(`Element with ID 'categoryColorOpen${index}' not found.`);
    return;
  }
  const categoryColors = {
    "Technical Task": "#1fd7c1",
    "Default": "#0038ff"
  };
  position.style.backgroundColor = categoryColors[category] || categoryColors["Default"];
}

/**
 * Closes the task modal when the modal overlay is clicked.
 * 
 * @param {Event} event - The click event that triggered the function.
 */
function closeTaskModalOnOverlayClick(event) {
  const openPosition = document.getElementById("openTask");
  if (!openPosition) {
    console.error("Element with ID 'openTask' not found.");
    return;
  }
  if (event.target.classList.contains("modal-overlay")) {
    openPosition.style.animation = "moveOut 200ms ease-out forwards";
    openPosition.addEventListener('animationend', () => {
      openPosition.classList.add("hidden", "d-none");
      openPosition.style.cssText = "visibility: hidden; transform: translateX(100vw)";
    }, { once: true });

    initDataBoard();
    resetFormStateEdit();
  }
}

/**
 * Generates HTML for displaying an open task on the board.
 *
 * @param {number} index - The index of the task.
 * @param {string} category - The category of the task.
 * @param {string} description - The description of the task.
 * @param {string} dueDate - The due date of the task.
 * @param {string} prio - The priority level of the task.
 * @param {string} title - The title of the task.
 * @param {string} boardCategory - The category for the board.
 * @param {string} assignedTo - A comma-separated list of users assigned to the task.
 * @param {string} subtasks - A comma-separated list of subtasks.
 * @param {string} subtaskStatus - A comma-separated list of subtask statuses.
 * 
 * @returns {string} The generated HTML markup for the open task.
 */
function openTaskToBoardHtml(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks, subtaskStatus) {
  function escapeHtml(text) {
      const element = document.createElement('div');
      element.innerText = text;
      return element.innerHTML;
  }

  if (typeof index !== 'number' || !category || !description || !dueDate || !prio || !title) {
      console.error('Invalid input parameters');
      return '';
  }

  return `
  <div class="board-task-container-open bradius24 bg-color-ww d-flex content-centr" id="parentContainer${index}">
      <div class="task-responsive width445">  
          <div class="d-flex-between margin-bt8">
              <h1 id="categoryColorOpen${index}" class="txt-center fs-16 mg-block-none bradius8 color-wh">${escapeHtml(category)}</h1>
              <img onclick="closeOpenTask(event, ${index})" id="closeOpenTask${index}" class="close-open-task-img" src="../public/img/Close.png" alt="Close Task">
          </div>
          <div class="margin-bt8">
              <h2 class="task-title mg-block-none fw-700 fs-61">${escapeHtml(title)}</h2>
          </div>
          <div class="margin-bt8">  
              <p class="description-open-task fs-20 fw-400 mg-block-none">${escapeHtml(description)}</p>
          </div> 
          <div class="d-flex item-center mg-btt25" id="dateTask${index}">
              <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Due date:</p>
              <p class="d-flex item-center fs-20 fw-400 mg-block-none margin-left-open-task">${escapeHtml(dueDate)}</p>
          </div>
          <div class="d-flex item-center mg-btt25" id="prioTask${index}">
              <p class="d-flex item-center fs-20 fw-700 color-dg mg-block-none">Priority:</p>
              <span class="d-flex item-center fs-16 fw-400 margin-left-open-task">${escapeHtml(prio)}</span>
              <div class="prio-board-image-container d-flex-center" id="prioPositionOpenTask${index}"></div>
          </div>
          <div class="mg-btt25">
              <p class="d-flex item-center fs-20 fw-700 color-dg mg-block-none">Assigned To:</p>
          </div>
          <div class="d-flex mg-btt25 assignedToScroll">
              <div class="user-image-bord-container-open" id="userImageBoardOpen${index}"></div>
          </div>
          <p class="d-flex item-center fs-20 fw-700 color-dg mg-block-inline">Subtasks:</p>    
          <div class="subtask-scrollbar" id="subtasksBoardOpen${index}"></div>
          <div class="d-flex-end">
              <div class="d-flex item-center">
                  <div onclick="deleteTask(${index})" class="d-flex item-center pointer">
                      <img class="open-task-delete-edit img" src="../public/img/deleteOpenTask.png" alt="Delete Task">
                      <p class="fs-16 mg-block-none">Delete</p>
                  </div>
                  <div class="seperator-opentask"></div>
                  <div onclick="EditTaskToBoardRender('${index}', '${escapeHtml(category)}', '${escapeHtml(description)}', '${escapeHtml(dueDate)}', '${escapeHtml(prio)}', '${escapeHtml(title)}', '${escapeHtml(boardCategory)}', '${escapeHtml(assignedTo)}', '${escapeHtml(subtasks)}', '${escapeHtml(subtaskStatus)}')" class="d-flex item-center pointer">
                      <img class="open-task-delete-edit img" src="../public/img/editOpenTask.png" alt="Edit Task">
                      <p class="fs-16 mg-block-none">Edit</p>
                  </div>
              </div>
          </div>
      </div>  
  </div>`;
};
