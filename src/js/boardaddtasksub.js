    
  /**
   * Clears the list of displayed subtasks by resetting the innerHTML of the subtasksPosition element.
   */
  function clearSubtasks2() {
    let position = document.getElementById("subtasksPosition2");
    position.innerHTML = "";
    subtasksStatusArray = [];
  }
  
  /**
   * Validates the input length for the subtask and finishes editing if valid.
   *
   * @param {number} index - The index of the subtask being edited.
   */
  function validateAndFinish2(index) {
    const input = document.getElementById(`inputAddTaskSubtasks2${index}`);
    if (input.value.length >= 2) {
      finishSubtask2(index);
    }
  }
  
  /**
   * Finishes editing a subtask and updates its value in the subtasks array.
   *
   * @param {number} index - The index of the subtask being finished.
   */
  function finishSubtask2(index) {
    let input = document.getElementById(`inputAddTaskSubtasks2${index}`);
    subtasksArray[index] = input.value;
    updateSubtasksList2();
  }


  /**
 * Adds a new subtask to the subtasks array if the input is not empty, then updates the UI.
 */
function addSubtask2() {
  let input = document.getElementById("subtasks-board");
  let inputValue = input.value.trim();

  if (inputValue !== "") {
    subtasksArray.push(inputValue);
    input.value = "";
    subtasksStatusArray.push(false);
    updateSubtasksList2();
    resetSubtaskInput2();
 }
}

/**
 * Deletes a subtask and updates the UI accordingly.
 *
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubtask2(index) {
  let position = document.getElementById(`supplementarySubtask2${index}`);
  position.innerHTML = "";
  subtasksArray.splice([index], 1);
  updateSubtasksList2();
}

/**
 * Enables editing mode for a specific subtask by updating its HTML content.
 *
 * @param {number} index - The index of the subtask to edit.
 */
function editSubtask2(index) {
  let position = document.getElementById(`supplementarySubtask2${index}`);
  position.classList.remove("subtasks-edit");
  position.classList.add("subtasks-edit-input");
  let arrayPosition = subtasksArray[index];
  position.innerHTML = editSubtaskHTML2(index, arrayPosition);
}