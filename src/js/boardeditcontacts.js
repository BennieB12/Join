
/**
 * Renders the HTML for editing a task on the board.
 *
 * @param {number} index - The index of the task to be edited.
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
 * @returns {void} This function does not return a value.
 */
function EditTaskToBoardRender(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus) {
  let position = document.getElementById("openTask");
  position.innerHTML = "";
  position.innerHTML = editTaskHtml(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus);
  CategoryColorOpenEdit(index, category);
  subtasksRenderOpenEdit(index, subtasks);
  checkboxIndexFalse(index);
  dueDateEditTask(index, dueDate); 
  subtaskUpdateEdit(index, subtaskStatus);
  assignedToDelivery(index, assignedTo);
  prioFilter(prio);
}


/**
 * Renders images for assigned users in a specified HTML position and clears the previous content.
 * in the specified HTML element (determined by `indexHTML`) and clears any existing content 
 * in that element before rendering.
 * 
 * @param {number} indexHTML - The index used to find the HTML element where images will be rendered.
 * @param {string|string[]} assignedTo - A string (comma-separated) or an array of assigned users. 
 *                                       If it's a string, it will be split into an array. 
 *                                       If it's 'undefined', the function will exit early.
 */
function assignedToDelivery(indexHTML, assignedTo) {
    let position = document.getElementById(`userImageBoardOpenEdit${indexHTML}`);
    position.innerHTML = '';
    if (assignedTo === 'undefined') return;
    let deliveryImage = Array.isArray(assignedTo) ? assignedTo : assignedTo.split(',').map(a => a.trim());
    for (let index = 0; index < deliveryImage.length; index++) {
      const element = deliveryImage[index];
      const url = imageUrlBoard[element];
      position.innerHTML += `<img class="img-24" src="${url}">`;
      assignedToUserArray.push(element);
    }
  }


/**
 * Renders images for assigned users in a given HTML position and clears the previous content.
 * 
 * This function takes an index and a list of assigned users. If the list is a string, 
 * it splits the string into an array. It then loops through the list and, for each user, 
 * fetches their image URL from the `imageUrlBoard` object. It renders the image in the specified 
 * HTML element (determined by `indexHTML`) and clears any existing content in that element before rendering.
 * 
 * @param {number} indexHTML - The index used to find the HTML element where images will be rendered.
 * @param {string|string[]} assignedTo - A string (comma-separated) or an array of assigned users. 
 *                                       If it's a string, it will be split into an array.
 */
function assignedToDeliveryRender(indexHTML, assignedTo){
  let position = document.getElementById(`userImageBoardOpenEdit${indexHTML}`);
  position.innerHTML = '';
  if (Array.isArray(assignedTo)) {
    deliveryImage = assignedTo; 
  } else {
    deliveryImage = assignedTo.split(',').map(assignedTo => assignedTo.trim()); 
  }
  for (let index = 0; index < deliveryImage.length; index++) {
    const element = deliveryImage[index];
    const url = imageUrlBoard[element];
    position.innerHTML += `<img class="img-24" src="${url}">`;}
  }

  /**
 * Toggles the assignment of a user to a task based on the provided index.
 *
 * @param {number} index - The index of the user in the global user list.
 * @param {string} element - The name of the user to be assigned or unassigned.
 * @param {string} imgSrc - The image source URL associated with the user.
 *
 * @async
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
async function assignedToUserEdit(index, imgSrc, indexHTML) {
    const image = imageUrlsGlobal[index];
    const arrayIndex = assignedToUserArray.indexOf(index);
    if (arrayIndex !== -1) {
      assignedToUserArray.splice(arrayIndex, 1);
      imageUrlsGlobal.splice(arrayIndex, 1);
      assignedtoUserHighlightRemoveEdit(index);
    } else {
      assignedToUserArray.push(index);
      imageUrlsGlobal.push(imgSrc);
      assignedtoUserHighlightAddEdit(index);
    }
     assignedToDeliveryRender(indexHTML, assignedToUserArray);
  }


  /**
 * Highlights the assigned user in the user interface by changing the styles of the associated elements.
 *
 * @param {number} index - The index of the user in the global user list, which is used to select 
 * the corresponding elements in the DOM.
 *
 * @returns {void} - This function does not return a value.
 */
function assignedtoUserHighlightAddEdit(index) {
    let position = document.getElementById(`checkboxColorEdit${index}`);
    let positionOfImage = document.getElementById(`assignedToUserImageBorderEdit${index}`)
    positionOfImage.classList.add('assignedToUserImage');
    position.style.backgroundColor = '#2a3647';
    position.style.color = '#ffffff';
  }


  /**
 * Removes the highlight effect from the assigned user in the user interface.
 *
 * @param {number} index - The index of the user in the global user list, which is used to select 
 * the corresponding elements in the DOM.
 *
 * @returns {void} - This function does not return a value.
 */
function assignedtoUserHighlightRemoveEdit(index) {
    let position = document.getElementById(`checkboxColorEdit${index}`);
    let positionOfImage = document.getElementById(`assignedToUserImageBorderEdit${index}`)
    positionOfImage.classList.remove('assignedToUserImage');
    position.style.backgroundColor = '#ffffff';
    position.style.color = '#2a3647';
  }


  /**
 * Hides the checkboxes for assigning users to the task during editing.
 *
 * @param {number} index - The index of the task being edited.
 */
function checkboxIndexFalse(index) {
    let checkboxes = document.getElementById(`checkboxesEdit${index}`);
    checkboxes.style.display = "none";
    expandedEdit = false;
  }
  

/**
 * Toggles the display of the user checkboxes for editing.
 * 
 * @param {number} indexHTML - The index used to identify the specific set of checkboxes to show or hide.
 * @returns {void} - This function does not return a value.
 */
function showCheckboxesEdit(indexHTML, assignedTo) {
  let checkboxes = document.getElementById(`checkboxesEdit${indexHTML}`);
  if (!expandedEdit) {
      checkboxes.style.display = "block";
      expandedEdit = true;
      checkboxes.innerHTML = "";
      for (let index = 0; index < userNamesBoard.length; index++) {
          const names = userNamesBoard[index];
          const urls = imageUrlBoard[index];
          checkboxes.innerHTML += checkBoxRenderEdit(index, names, urls, indexHTML);
      }
      for (let i = 0; i < assignedToUserArray.length; i++) {
          const highlight = assignedToUserArray[i];
          assignedtoUserHighlightAddEdit(highlight);
          let checkbox = document.getElementById(`checkbox-${highlight}`);
          if (checkbox) {
              checkbox.checked = true;
          }
      }
  } else {
      checkboxes.style.display = "none";
      expandedEdit = false;
  }
}

/**
 * Updates the task board with edited task details and navigates to the board page.
 * 
 * @param {number} index - The index of the task being edited.
 * @param {string} category - The category of the task.
 * @async
 */
async function updateTaskBoard(index, category) {
  defineTaskObjectsEdit(index, category);
  let positionTask = `/tasks/${taskkeys[index]}`;
  await saveToFirebaseEdit(positionTask);
  resetFormStateEdit();
  changeSite("../public/board.html");
}


/**
 * Resets the form state after editing a task.
 */
function resetFormStateEdit() {
  addTaskArrayEdit = [];
  selectedPrioEdit  = null;
  assignedToUserArrayNamesGlobal = [];
  assignedToUserArray = [];
  subtasksArray = [];
  subtasksStatusArray = [];
  subtasksStatusArrayEdit = [];
  subtasksArrayEdit = [];
  subtasksedit = [];
  usersEdit = [];
  imageUrlsGlobal = [];
  fetchImagesEdit = [];
  assignedToUserArrayEdit = [];
  assignedToUserArrayNamesGlobalEdit = [];
  isEditingSubtask = false;
  assignedToUserArray = [];
}