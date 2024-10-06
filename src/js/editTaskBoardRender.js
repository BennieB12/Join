/**
 * Generates HTML for a checkbox with an associated label and image.
 *
 * @param {number} index - The index used to uniquely identify the checkbox.
 * @param {string} names - The name to be displayed next to the checkbox.
 * @param {string} urls - The URL of the image to be displayed next to the name.
 *
 * @returns {string} - The generated HTML string for the checkbox element.
 */
function showSubtaskControlsEdit(index, subtasks) {
    if (subtasks === undefined && arrayForSubtasks.length > 0) {
        subtasks = arrayForSubtasks.join(',');
    }
    document.getElementById(`subtasksEdit${index}`).classList.remove('add-task-input-edit');
    document.getElementById(`subtasksEdit${index}`).classList.add('subtasks-input-edit');

    let position = document.getElementById(`subtasksControl${index}`);
    position.innerHTML = `<button onclick="resetSubtaskInputEdit('${index}','${subtasks}')" type="button" class="subtask-button-edit">
                                <img src="../public/img/closeAddTask.png" alt="Reset">
                            </button>
                            <div class="seperator-subtasks"></div>
                            <button onclick="addSubtaskEdit('${index}','${subtasks}')" type="button" class="subtask-button-edit">
                                <img src="../public/img/checkAddTask.png" alt="Add">
                            </button>`;
}

/**
 * Enables editing mode for a specific subtask by updating its HTML content.
 * 
 * @param {number} index - The index of the subtask to edit.
 */
function editSubtaskEdit(i, indexHTML, subtask) {
    let position = document.getElementById(`supplementarySubtaskEdit${i}`);
    position.classList.remove('subtasks-edit');
    position.classList.add('subtasks-edit-input');

    arrayForSubtasks = subtask.split(',')
        .map(subtask => subtask.trim())
        .filter(subtask => subtask !== 'undefined' && subtask !== "");
    console.log(arrayForSubtasks);
    
    if (i >= arrayForSubtasks.length) {
        console.error(`Index ${i} liegt außerhalb der Grenzen des Subtasks-Arrays.`);
        return;
    }
    
    let arrayPosition = arrayForSubtasks[i];
    console.log(arrayPosition);

    position.innerHTML = editSubtaskHTMLEdit(i, indexHTML, arrayPosition);
}

/**
 * Renders an editable input field for a subtask with options to delete or finish editing.
 *
 * @param {number} i - The index of the subtask being edited.
 * @param {number} indexHTML - The index of the HTML element related to the main task.
 * @param {string} arrayPosition - The current value of the subtask being edited.
 */
function editSubtaskHTMLEdit(i, indexHTML, arrayPosition) {
    return `
        <input id="inputEditSubtasks${i}" class="inputAddTaskSubtasks fs-16" value="${arrayPosition}">
        <div class="d-flex item-center">
            <img class="img-24 pointer p-4" onclick="deleteSubtaskEdit('${i}','${indexHTML}')" src="../public/img/delete.png">
            <div class="seperator-subtasks"></div>
            <img class="img-24 pointer p-4" onclick="validateAndFinishEdit('${i}','${indexHTML}')" src="../public/img/checkAddTask.png" alt="Add">
        </div>`;
}

/**
 * Validates the input length for the subtask and finishes editing if valid.
 * 
 * @param {number} i - The index of the subtask being edited.
 * @param {number} indexHTML - The index of the HTML element related to the main task.
 */
function validateAndFinishEdit(i, indexHTML) {
    const input = document.getElementById(`inputEditSubtasks${i}`);
    const trimmedValue = input.value.trim();

    if (trimmedValue.length >= 2) {
        finishSubtaskEdit(i, indexHTML);
    } else {
        console.error('Der Subtask muss mindestens 2 Zeichen lang sein.');
    }
}

/**
 * Finishes editing a subtask by updating its value in the subtasks array and re-rendering the list of subtasks.
 *
 * @param {number} i - The index of the subtask being edited.
 * @param {number} indexHTML - The index of the HTML element related to the main task.
 */
function finishSubtaskEdit(i, indexHTML) {
    let input = document.getElementById(`inputEditSubtasks${i}`);
    arrayForSubtasks[i] = input.value;
    console.log(arrayForSubtasks);

    subtasksRenderOpenEdit(indexHTML, arrayForSubtasks);
}

/**
 * Resets the input field for adding a subtask and updates the UI accordingly.
 *
 * @param {number} index - The index of the main task associated with the subtask input.
 */
function resetSubtaskInputEdit(index) {
    let input = document.getElementById(`subtasksEdit${index}`);
    input.value = '';
    document.getElementById(`subtasksEdit${index}`).classList.add('add-task-input-edit');
    document.getElementById(`subtasksEdit${index}`).classList.remove('subtasks-input-edit');
    
    let position = document.getElementById(`subtasksControl${index}`);
    position.innerHTML = `<button onclick="showSubtaskControlsEdit(${index})" type="button" class="add-task-button-edit">
                                +
                            </button>`;
}

/**
 * Renders user images in the edit mode based on the provided user data.
 *
 * @param {number} index - The index of the task for which user images are to be rendered.
 */
function userImageRenderEdit(index) {
    let position = document.getElementById(`userImageBoardOpenEdit${index}`);
    
    if (usersEdit == null) {
        return;
    } else {
        position.innerHTML = '';
        
        for (let i = 0; i < usersEdit.length; i++) {
            const usersAdd = usersEdit[i];
            const urls = fetchImagesEdit[usersAdd];
            position.innerHTML += `<img class="img-24" src="${urls}">`;
        }
    }
}
