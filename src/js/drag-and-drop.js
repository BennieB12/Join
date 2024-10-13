document.addEventListener("mousedown", handleRotateStart);
document.addEventListener("mouseup", handleRotateEnd);
document.addEventListener("mouseleave", handleRotateEnd);
document.addEventListener("dragend", handleRotateEnd);

let cachedElement = null;
let currentDraggedElement;


/**
 * Starts the dragging process by setting the current dragged task's key.
 *
 * @param {string} taskkey - The unique key of the task being dragged.
 */
function startDragging(taskkey) {
  currentDraggedElement = taskkey;
}


/**
 * Adds the "rotate" class to the closest ".board-task-container" element when dragging starts.
 * 
 * @param {Event} event - The event object from the event listener.
 */
function handleRotateStart(event) {
  cachedElement = event.target.closest(".board-task-container");
  if (cachedElement) {
    cachedElement.classList.add("rotate");
  }
}


/**
 * Removes the "rotate" class from the previously cached ".board-task-container" element.
 * 
 * @param {Event} event - The event object from the event listener.
 */
function handleRotateEnd(event) {
  if (cachedElement) {
    cachedElement.classList.remove("rotate");
    cachedElement = null;
  }
}


/**
 * Allows the dragged item to be dropped on a valid target by preventing the default behavior.
 *
 * @param {DragEvent} ev - The drag event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}


/**
 * Handles the drop event by retrieving the target category and initiating the move.
 *
 * @param {DragEvent} event - The drop event.
 */
function onDrop(event) {
  event.preventDefault();
  const newCategory = event.target.dataset.category;
  moveTo(newCategory);
}


async function moveTo(category) {
  if (currentDraggedElement) {
    const currentElement = document.getElementById(`parentContainer${currentDraggedElement}`);
    if (currentElement) {
      currentElement.remove();
    }

    try {
      await updateTaskInFirebase({
        id: currentDraggedElement,
        boardCategory: category,
      });
    } catch (error) {
      console.error("Error updating Firebase:", error);
    }

    await updateSingleTask(currentDraggedElement);
    let dragArea = document.getElementById(category);
    dragArea.classList.remove("highlight");
    currentDraggedElement = null;
  } else {
    console.error("No task is being dragged.");
  }

  updateStatusMessages();
}



async function updateSingleTask(taskId) {
  try {
    let updatedTask = await fetchTaskFromFirebase(taskId);
    const { category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks, subtaskStatus } = updatedTask;

    let currentTaskElement = document.getElementById(`parentContainer${taskId}`);
    if (currentTaskElement) {
      currentTaskElement.remove();
    }
    positionOfHTMLBlockBoard(
      taskId,
      category,
      description,
      dueDate,
      prio,
      title,
      boardCategory,
      assignedTo,
      subtasks,
      subtaskStatus
    );
    searchIndexUrlBoard(taskId, assignedTo);
    searchprioBoard(taskId, prio);
    subtasksRenderBoard(taskId, subtasks);
    CategoryColor(taskId, category);
    progressBar(taskId, subtasks, subtaskStatus);
  } catch (error) {
    console.error("Error updating task HTML:", error);
  }
}



/**
 * Fetches the updated task data from Firebase.
 * 
 * @param {string} taskId - The ID of the task to fetch.
 * @returns {Promise<Object>} - A promise that resolves to the updated task data.
 */
async function fetchTaskFromFirebase(taskId) {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}/0.json`);
    const taskData = await response.json();
    return taskData;
  } catch (error) {
    console.error("Error fetching task from Firebase:", error);
  }
}

/**
 * Clears and updates the HTML content of task categories on the board.
 * The function clears the content of predefined task categories and then
 * reloads the board data and updates the HTML content.
 *
 * @async
 */
async function updateHTML() {
  const categories = ["todo", "progress", "feedback", "done"];
  for (const category of categories) {
    const container = document.getElementById(category);
    container.innerHTML = "";
  }
  try {
    await initDataBoard();
  } catch (error) {
    console.error("Error updating HTML content:", error);
  }
}



/**
 * Updates the task's category in Firebase.
 *
 * @param {Object} task - The task object containing the ID and new category.
 * @param {string} task.id - The unique key of the task being updated.
 * @param {string} task.boardCategory - The new board category of the task.
 * @async
 */
async function updateTaskInFirebase(task) {
  try {
    await fetch(`${BASE_URL}/tasks/${task.id}/0.json`, {
      method: "PATCH",
      body: JSON.stringify({ boardCategory: task.boardCategory }),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating task in Firebase:", error);
  }
}

/**
 * to the specified drag area, visually indicating that the area is a valid drop target.
 *
 * @param {DragEvent} event - The drag event triggered when the draggable element enters the drop area.
 * @param {string} areaId - The ID of the drop area where the draggable element is entering.
 */
function handleDragEnter(event, areaId) {
  event.preventDefault();
  let dragArea = document.getElementById(areaId);
  dragArea.classList.add("highlight");
}


/**
 * Handles the drag leave event by removing the highlight effect from the drop area.
 * This function is triggered when a draggable element leaves the drop zone.
 * is not contained within the drop area. If it is not, it removes the "highlight"
 *
 * @param {DragEvent} event - The drag event triggered when the draggable element leaves the drop area.
 * @param {string} areaId - The ID of the drop area where the draggable element is leaving.
 */
function handleDragLeave(event, areaId) {
  event.preventDefault();
  let dragArea = document.getElementById(areaId);
  if (!dragArea.contains(event.relatedTarget)) {
    dragArea.classList.remove("highlight");
  }
}


/**
 * Moves a task to a specified category when a link is clicked.
 *
 * @param {string} taskKey - The unique key of the task being moved.
 * @param {string} newCategory - The new category to move the task to.
 */
async function moveTaskToCategory(taskKey, newCategory) {
  event.stopPropagation();
  try {
    task[taskKey]["boardCategory"] = newCategory;
    await updateTaskInFirebase({
      id: taskKey,
      boardCategory: newCategory,
    });
    await updateHTML();
    updateStatusMessages();
  } catch (error) {
    console.error("Error moving task:", error);
  }
}