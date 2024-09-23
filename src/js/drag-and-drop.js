document.addEventListener("mousedown", handleRotateStart);
document.addEventListener("mouseup", handleRotateEnd);
document.addEventListener("mouseleave", handleRotateEnd);
document.addEventListener("dragend", handleRotateEnd);

let cachedElement = null;

function startDragging(taskkey) {
  currentDraggedElement = taskkey;
}

function handleRotateStart(event) {
  cachedElement = event.target.closest(".board-task-container");
  if (cachedElement) {
    cachedElement.classList.add("rotate");
  }
}

function handleRotateEnd(event) {
  if (cachedElement) {
    cachedElement.classList.remove("rotate");
    cachedElement = null;
  }
}

async function drop(ev) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");
  let currentTargetId = ev.currentTarget.id;

  task = { id: data, boardCategory: currentTargetId };
  await updateTaskInFirebase(task);

  document.getElementById(data).parentElement.removeChild(document.getElementById(data));
  document.getElementById(currentTargetId).appendChild(document.getElementById(data));
}


function allowDrop(ev) {
  ev.preventDefault();
}

function onDragOver(ev) {
  allowDrop(ev);
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
    await updateTaskInFirebase({
      id: currentDraggedElement,
      boardCategory: category,
    });

    await updateHTML();
  } else {
    console.error("No task is being dragged.");
  }

  updateStatusMessages();
}


/**
 * Updates the task's category in Firebase using PUT.
 *
 * @param {Object} task - The task object containing the ID and new category.
 * @param {string} task.id - The unique key of the task being updated.
 * @param {string} task.boardCategory - The new board category of the task.
 * @async
 */
async function updateTaskInFirebase(task) {
  try {
   
    await fetch(`${BASE_URL}/tasks/${task.id}.json`, {
      method: "PUT",
      body: JSON.stringify({ boardCategory: task.boardCategory }),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating task in Firebase:", error);
  }
}






