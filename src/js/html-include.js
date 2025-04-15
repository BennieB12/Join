let isLoading = false; 

/**
 * Dynamically includes HTML content into elements with the `w3-include-html` attribute.
 * Fetches the content from the specified file and inserts it into the element.
 * Handles errors and displays an error message if the content cannot be loaded.
 *
 * @async
 */

async function includeHTML() {
  if (isLoading) return;
  isLoading = true;
  const includeElements = document.querySelectorAll("[w3-include-html]");
  
  for (let element of includeElements) {
    const file = element.getAttribute("w3-include-html");
    try {
      const resp = await fetch(new URL(file, window.location.href));
      await whichChangeSite(resp, element, file);
    } catch (error) {
      console.error(`Error fetching file: ${file}`, error);
      element.innerHTML = "Error loading page";
    }
  }
  
  isLoading = false;
}

/**
 * Inserts the fetched HTML content into the element and initializes the page-specific logic.
 * Calls different initialization functions based on the file name.
 *
 * @param {Response} resp - The response object returned by the fetch request.
 * @param {HTMLElement} element - The element where the fetched HTML content will be inserted.
 * @param {string} file - The name of the file being fetched.
 * @async
 */
async function whichChangeSite(resp, element, file) {
  if (resp.ok) {
    element.innerHTML = await resp.text();
    if (file.includes("../public/addTask.html")) {
      await init();
    } else if (file.includes("../public/contacts.html")) {
      await initContacts();
    } else if (file.includes("../public/board.html")) {
      await initDataBoard();
      updateStatusMessages();
    } else if (file.includes("../public/summary.html")) {
      await initSmry();
    } 
  } else {
    element.innerHTML = "Page not found";
  }
}

 /**
 * Dynamically changes the current page by loading a new HTML file into the main content area.
 * If the loaded page is "contacts.html", it toggles the visibility of the contact list section.
 *
 * @param {string} page - The relative path to the new HTML file to be loaded.
 * @async
 * @returns {Promise<void>} Resolves when the new HTML content has been successfully loaded.
 */
async function changeSite(page, clickedElement) {
  if (isLoading) return;
  document.querySelectorAll('.nav-mid a').forEach(link => {
    link.classList.remove('active');
  });
  if (clickedElement) {
    clickedElement.classList.add('active');
  }
  document.querySelector(".main-content").setAttribute("w3-include-html", page);
  await includeHTML();
  if (page === 'contacts.html') {
    toggleElement('.contactlist-section-responsive', 'd-none');
  }
}


document.addEventListener("DOMContentLoaded", () => {
  includeHTML();
});
