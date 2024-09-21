document.addEventListener("mousedown", handleRotateStart);
document.addEventListener("mouseup", handleRotateEnd);
document.addEventListener("mouseleave", handleRotateEnd);
document.addEventListener("dragend", handleRotateEnd);

let cachedElement = null;

/**
 * Starts the dragging process by setting the current dragged task's key.
 *
 * @param {string} taskkey - The unique key of the task being dragged.
 */
function startDragging(taskkey) {
  currentDraggedElement = taskkey;
 // console.log("Dragging element with taskkey:", currentDraggedElement);
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

/**
 * Moves the dragged task to a new category and updates the task in Firebase.
 *
 * @param {string} category - The new category to move the task to.
 * @async
 */
/**
 * Moves the dragged task to a new category and updates it in Firebase.
 *
 * @param {string} category - The new category to move the task to.
 * @async
 */
async function moveTo(category) {
  if (currentDraggedElement) {
    const oldCategory = task[currentDraggedElement]["boardCategory"];
    
    task[currentDraggedElement]["boardCategory"] = category;
    await addTaskToFirebase({
      id: currentDraggedElement,
      boardCategory: category,
    });

    await deleteTaskFromFirebase(currentDraggedElement);
    await updateHTML();
  } else {
    console.error("No task is being dragged.");
  }

  updateStatusMessages();
}


async function addTaskToFirebase(task) {
  try {
    const response = await fetch(`${BASE_URL}/tasks.json`, {
      method: "POST",
      body: JSON.stringify(task),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    task.id = data.name;
  } catch (error) {
    console.error("Error adding task to Firebase:", error);
  }
}

async function deleteTaskFromFirebase(taskId) {
  try {
    await fetch(`${BASE_URL}/tasks/${taskId}/0.json`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting task from Firebase:", error);
  }
}






