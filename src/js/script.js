let BASE_URL = "https://join-19628-default-rtdb.firebaseio.com/contacts";

async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let element of includeElements) {
    const file = element.getAttribute("w3-include-html");
    try {
      let sanitizedUrl = new URL(file, window.location.href);
      sanitizedUrl.username = '';
      sanitizedUrl.password = '';
      let resp = await fetch(sanitizedUrl);
      if (resp.ok) {
        element.innerHTML = await resp.text();
        if (file.includes('addTask.html'))  {
          initTask();
        } else if (file.includes('contacts.html'))  {
          initContact();
        }
      } else {
        element.innerHTML = 'Page not found';
      }
    } catch (error) {
      console.error('Error fetching file:', file, error);
      element.innerHTML = 'Error loading page';
    }
  }
}

function changeSite(page) {
  document.querySelector('.main-content').setAttribute('w3-include-html', page);
  includeHTML();
}

document.addEventListener('DOMContentLoaded', () => {
  includeHTML();
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const mainContent = document.querySelector('.main-content');
    const currentPage = mainContent.getAttribute('w3-include-html');
    if (currentPage && currentPage.includes('summary.html')) {
      summaryGreeting();
    }
  }
});

function toggleElement(elementClass, className) {
  const element = document.querySelector(elementClass);
  if (element) {
    if (element.classList.contains(className)) {
      element.classList.remove(className);
    } else {
      element.classList.add(className);
    }
  } else {
    console.error(`Element with id "${elementId}" not found.`);
  }
}
