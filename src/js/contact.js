let allContacts = {
  names: [],
  mails: [],
  phones: [],
  images: [],
};

async function initContact() {
  try {
    await getData("/");
    sortContacts();
    setupForm();
    renderContactList();
  } catch (error) {
    console.log("Error:", error);
  }
}

async function getData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  updateContacts(responseToJson);
  console.log(responseToJson);
}

async function deleteData(index) {
  try {
    let contactId = await getContactId(index);
    if (contactId) {
      await fetch(`${BASE_URL}/${contactId}.json`, {
        method: "DELETE"
      });
      console.log(`Kontakt ${allContacts.names[index]} erfolgreich gelöscht.`);

      allContacts.names.splice(index, 1);
      allContacts.mails.splice(index, 1);
      allContacts.phones.splice(index, 1);
      allContacts.images.splice(index, 1);

      renderContactList();
    } else {
      console.error("Kontakt-ID nicht gefunden.");
    }
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
  }
}

async function postData(contact) {
  try {
    let response = await fetch(BASE_URL + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

    let responseToJson = await response.json();
    console.log("Erfolgreich hochgeladen:", responseToJson);

    await getData("/");
  } catch (error) {
    console.error("Fehler beim Hochladen:", error);
  }
  renderContactList();
}

//async function editData(i){}





async function getContactId(index) {                      // um eindeutige ID des Kontaktes der Firebase Datenbank zu identifizieren
  let response = await fetch(BASE_URL + ".json");
  let responseToJson = await response.json();
  let keys = Object.keys(responseToJson);
  for (let i = 0; i < keys.length; i++) {
    let contact = responseToJson[keys[i]];
    if (contact.name === allContacts.names[index] &&
        contact.mail === allContacts.mails[index] &&
        contact.phone === allContacts.phones[index] &&
        contact.img === allContacts.images[index]) {
      return keys[i];
    }
  }
  return null;
}

function isContactExisting(contact) {                     // prüft ob ein Kontakt bereits exisistiert
  return (
    allContacts.names.includes(contact.name) &&
    allContacts.mails.includes(contact.mail) &&
    allContacts.phones.includes(contact.phone) &&
    allContacts.images.includes(contact.img)
  );
}

function generateProfileImage(name) {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#F3FF33", "#33FFF3"]; 
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const initials = name.split(" ").map(word => word[0].toUpperCase()).join("");

  const svg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="${randomColor}" />
      <text x="50%" y="50%" dy=".3em" text-anchor="middle" font-size="32" fill="#FFF" font-family="Inter, sans-serif">${initials}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function sortContacts() {
  let sortedIndices = [...Array(allContacts.names.length).keys()].sort((a, b) => {
    return allContacts.names[a].localeCompare(allContacts.names[b]);
  });

  allContacts.names = sortedIndices.map(i => allContacts.names[i]);
  allContacts.mails = sortedIndices.map(i => allContacts.mails[i]);
  allContacts.phones = sortedIndices.map(i => allContacts.phones[i]);
  allContacts.images = sortedIndices.map(i => allContacts.images[i]);
}

function renderCurrentLetter(contactList, letter) {
  contactList.innerHTML += `
    <div class="contactlist-order-letter">${letter}</div>
    <div class="contactlist-seperator"></div>
  `;
}

function processContacts(contactList) {
  let currentLetter = "";
  for (let i = 0; i < allContacts.names.length; i++) {
    let firstLetter = allContacts.names[i].charAt(0).toUpperCase();
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      renderCurrentLetter(contactList, currentLetter);
    }
    let imageSrc = allContacts.images[i] ? allContacts.images[i] : generateProfileImage(allContacts.names[i]);

    contactList.innerHTML += `
      <div id="contactlist-overlay(${i})" class="contactlist-overlay" onclick="openContact(${i})">
        <img class="pll-24" src="${imageSrc}" alt="Contact Image"/>
        <div class="contactlist-databox">
          <div class="contactlist-databox-name">${allContacts.names[i]}</div>
          <a class="contactlist-databox-mail" href="mailto:${allContacts.mails[i]}">${allContacts.mails[i]}</a>
        </div>
      </div>
    `;
  }
}

function renderContactList() {
  let contactList = document.getElementById("contactlist-content");
  contactList.innerHTML = "";
  processContacts(contactList);
}

function openContact(index) {
  let contactSection = document.getElementById('contact-section');
  let contactList = document.getElementById(`contactlist-overlay(${index})`);

  contactList.classList.add('bg-color-dg');
  contactSection.classList.remove('d-none');

  renderContactSection(index);
}

function renderContactSection(index) { // cleancode: header und information-content seperat rendern  //renderContactInformation(index);
  let contactSection = document.getElementById("contact-section");
  contactSection.innerHTML = "";

  contactSection.innerHTML = `
    <div class="contact-section-content">
      <img src="${allContacts.images[index]}" alt="Profile Image" />
      <div class="contact-section-data">
        <p>${allContacts.names[index]}</p>
        <div class="contact-section-btn-box">
          <button onclick="editContact(${index})" id="edit-btn">Edit<img src="./img/edit.png"></button>
          <button onclick="deleteData(${index})" id="del-btn">Delete<img src="./img/delete.png"></button>
        </div>
      </div>
    </div>

    <div id="contact-information-content">
      <p>Contact Information</p>
      <div class="contact-information-data">
        <p><b>Email</b></p>
        <a href="mailto:${allContacts.mails[index]}">${allContacts.mails[index]}</a>
        <p><b>Phone</b></p>
        <p>${allContacts.phones[index]}</p>
      </div>
    </div>`
}

function updateContacts(responseToJson) {     
  let keys = Object.keys(responseToJson);
  for (let i = 0; i < keys.length; i++) {
    let contact = responseToJson[keys[i]];
    if (!isContactExisting(contact)) {
      allContacts.names.push(contact.name);
      allContacts.mails.push(contact.mail);
      allContacts.phones.push(contact.phone);
      allContacts.images.push(contact.img);
    }
  }
}

function formSubmit(event) {
  event.preventDefault();

  const newContact = {
    name: document.getElementById("name").value,
    mail: document.getElementById("mail").value,
    phone: document.getElementById("phone").value,
    img: document.getElementById("prof-img").value,
  };

  postData(newContact);
  closeFormfield();
}

function setupForm() {
  const form = document.getElementById("contact-form");
  form.addEventListener("submit", formSubmit);
}

function showFormField() {
  document.getElementById("add-contact-section").classList.remove("d-none");
  document.addEventListener("click", outsideForm);
}

function outsideForm(event) {
  let section = document.getElementById("add-contact-section");
  if (!section.contains(event.target) && !event.target.closest('#add-contact-btn')) {
    closeFormfield();
  }
}

function closeFormfield() {
  document.getElementById("contact-form").classList.add("d-none");
  document.getElementById("add-contact-section").classList.add("d-none");
}

function closeEditForm() {
  document.getElementById("edit-contact-overlay").classList.add("d-none");
}
