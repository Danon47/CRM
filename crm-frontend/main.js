const addBtn = document.getElementById("add");
const modalAdd = document.getElementById("modalAdd");
const modalChange = document.getElementById("modalChange");
const modalDel = document.getElementById("modalDel");
const backShadow = document.getElementById("overlay");
const btnClose = document.getElementById("btnClose");
const btnCloseC = document.getElementById("btnCloseC");
const btnCloseDel = document.getElementById("btnCloseDel");
const linkClose = document.getElementById("linkClose");
const linkCloseDel = document.getElementById("linkCloseDel");
const cTimeCol = document.getElementById("cTimeCol");
const uTimeCol = document.getElementById("uTimeCol");
const delCol = document.getElementById("delCol");

const table = document.getElementById("tbody");

async function getFromAPI(id = '') {
  let url = "http://localhost:3000/api/clients"

  if (id) {
      url+='/'+id;
  } 

  const data = await fetch(url);
  return data.json();
}

async function POSTtoAPI(obj) {
  const response = await fetch("http://localhost:3000/api/clients", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: { "Content-Type": "application/json" },
    });
  return await response.json();
}

async function PATCHonAPI(obj, id) {
  await fetch(`http://localhost:3000/api/clients/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
    });
}

async function DELETEfromAPI(id) {
  await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: "DELETE",
  });
}

function createitem(obj) {
  const row = document.createElement("tr");
  row.classList.add("row");

  const id = document.createElement("td");
  id.classList.add("IDDef");
  id.textContent = obj.id;

  const name = document.createElement("td");
  name.classList.add("nameDef");
  name.textContent = `${obj.surname} ${obj.name} ${obj.lastName}`;

  const fullCreateDate = new Date(obj.createdAt);

  const cDate = document.createElement("td");
  cDate.classList.add("cDate");
  cDate.textContent = `${fullCreateDate
    .getDate()
    .toString()
    .padStart(2, "0")}.${(fullCreateDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${fullCreateDate.getFullYear()}`;

  const cTime = document.createElement("td");
  const cTimeText = document.createElement("p");
  cTime.classList.add("cTime");
  cTimeText.classList.add("cTimeText");
  cTimeText.textContent = `${fullCreateDate.getHours()}:${fullCreateDate.getMinutes()}`;

  const fullUpdateDate = new Date(obj.updatedAt);

  const uDate = document.createElement("td");
  uDate.classList.add("uDate");
  uDate.textContent = `${fullUpdateDate
    .getDate()
    .toString()
    .padStart(2, "0")}.${(fullUpdateDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${fullUpdateDate.getFullYear()}`;

  const uTime = document.createElement("td");
  const uTimeText = document.createElement("p");
  uTime.classList.add("uTime");
  uTimeText.classList.add("uTimeText");
  uTimeText.textContent = `${fullUpdateDate.getHours()}:${fullUpdateDate.getMinutes()}`;

  const contact = document.createElement("td");
  contact.classList.add("linkBox");
  const contacts = obj.contacts;

  contacts.forEach((element) => {
    let link = document.createElement("a");
    link.classList.add("linkDef");

    if (element.type === "Телефон") {
      link.classList.add("phone");
      linkInfo(element.type, element.value, link);
    } else if (element.type === "Email") {
      link.classList.add("mail");
      linkInfo(element.type, element.value, link);
    } else if (element.type === "Facebook") {
      link.classList.add("fb");
      linkInfo(element.type, element.value, link);
    } else if (element.type === "Vk") {
      link.classList.add("vk");
      linkInfo(element.type, element.value, link);
    } else {
      link.classList.add("contact");
      linkInfo(element.type, element.value, link);
    }

    contact.append(link);
  });

  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  tooltip.hidden = true;
  document.body.appendChild(tooltip);

  function linkInfo(type, value, link) {
    link.addEventListener("mouseenter", function () {
      tooltip.textContent = `${type}: ${value}`;
      tooltip.hidden = false;

      const rect = link.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.top = `${
        rect.top + window.pageYOffset - tooltip.offsetHeight - 10
      }px`;
    });

    link.addEventListener("mouseleave", function () {
      tooltip.hidden = true;
    });
  }

  const change = document.createElement("td");
  const changeText = document.createElement("p");
  change.classList.add("changeDef");
  changeText.textContent = "Изменить";
  changeText.classList.add('changeText')

  changeText.addEventListener("click", async (event) => {
    backShadow.hidden = false;
    modalChange.hidden = false;

    const row = event.target.closest("tr");
    const cellWithID = row.querySelector(".IDDef");
    const clientId = cellWithID.textContent.trim();

    const data = await getFromAPI(clientId);

    const id = document.getElementById("modalID");
    id.textContent = `ID: ${data.id}`;

    const surnameC = document.getElementById("surnameC");
    surnameC.value = data.surname;

    const nameC = document.getElementById("nameC");
    nameC.value = data.name;

    const lastNameC = document.getElementById("lastNameC");
    lastNameC.value = data.lastName;

    const contactWrapper = document.getElementById("contactAddWrap");
    contactWrapper.innerHTML = "";

    if (data.contacts.length > 0) {
      data.contacts.forEach((element) => {
        createContactElement(contactAddWrap, element.value, element.type);
        addContactBtn.classList.add("added");
      });
    }

    document
      .getElementById("saveBtnC")
      .addEventListener("click", async function (event) {
        // event.preventDefault()
        const updatedData = {
          id: data.id,
          surname: surnameC.value,
          name: nameC.value,
          lastName: lastNameC.value,
          contacts: [],
        };

        const contactType = document.querySelectorAll(".typeOfContact");
        const contactValue = document.querySelectorAll(".inputContact");

        for (let i = 0; i < contactType.length; i++) {
          updatedData.contacts.push({
            type: contactType[i].value,
            value: contactValue[i].value,
          });
        }

        const response = await PATCHonAPI(updatedData, data.id);

        if (response.ok) {
          row.querySelector("nameDef") = `${updatedData.surname} ${updatedData.name} ${updatedData.lastName}`;

          backShadow.hidden = true;
          modalChange.hidden = true;
        } else {
          console.error("Failed to update client data");
        }
      });

    const linkCloseC = document.getElementById("linkCloseC");
    linkCloseC.addEventListener("click", async (event) => {
      modalChange.hidden = true;
      modalDel.hidden = false;

      const DelBtn = document.getElementById("DelBtn");
      DelBtn.addEventListener("click", async () => {
        await DELETEfromAPI(data.id);

        backShadow.hidden = true;
        modalDel.hidden = true;
        row.remove();
      });
    });
  });

  const cancel = document.createElement("td");
  const cancelText = document.createElement("p");
  cancel.classList.add("deleteDef");
  cancelText.textContent = "Удалить";
  cancelText.classList.add('cancelText')

  cancelText.addEventListener("click", async (event) => {
    backShadow.hidden = false;
    modalDel.hidden = false;

    const row = event.target.closest("tr");
    const cellWithID = row.querySelector(".IDDef");
    const clientId = cellWithID.textContent.trim();

    const DelBtn = document.getElementById("DelBtn");
    DelBtn.addEventListener("click", async () => {
      await DELETEfromAPI(clientId);

      backShadow.hidden = true;
      modalDel.hidden = true;
      row.remove();
    });
  });

  function makeTable() {
  if (window.innerWidth <= 1024) {
    cTime.remove()
    cTimeCol.remove()
    uTime.remove()
    uTimeCol.remove()
    cancel.remove()
    delCol.remove()
    uDate.append(uTimeText)
    cDate.append(cTimeText)
    change.append(changeText, cancelText)
    row.append(id, name, cDate, uDate, contact, change);
  } else {
    cTime.append(cTimeText);
    uTime.append(uTimeText);
    change.append(changeText);
    cancel.append(cancelText);
    row.append(id, name, cDate, cTime, uDate, uTime, contact, change, cancel);
  }

  table.append(row);
  };

  makeTable()
  window.addEventListener("resize", () => makeTable());
}

addBtn.addEventListener("click", () => {
  backShadow.hidden = false;
  modalAdd.hidden = false;
});

function modalHidden(modal) {
    backShadow.hidden = true;
    modal.hidden = true;
}

backShadow.addEventListener("click", () => {
  backShadow.hidden = true;
  modalAdd.hidden = true;
  modalChange.hidden = true;
  modalDel.hidden = true;
});

btnClose.addEventListener("click", () => {
  modalHidden(modalAdd);
});

btnCloseC.addEventListener("click", () => {
  modalHidden(modalChange);
});

btnCloseDel.addEventListener("click", () => {
  modalHidden(modalDel);
});

linkClose.addEventListener("click", () => {
  modalHidden(modalAdd);
});

linkCloseDel.addEventListener("click", () => {
  modalHidden(modalDel);
});

function createTable(arr) {
  table.innerHTML = "";
  for (let student of arr) {
    createitem(student);
  }
}

function createContactElement(parentElement, contactValue = "", selectValue = "") {
  // event.preventDefault()

  if (document.getElementsByClassName("typeOfContact").length >= 8) {
    const warning = document.createElement("p");
    warning.textContent = "Максимальное количество контактов";
    warning.classList.add("warning");

    parentElement.append(warning);
  } else {
    const divSelect = document.createElement("div");
    divSelect.classList.add("addContact", "flex");

    const select = document.createElement("select");
    select.classList.add("typeOfContact");

    [
      "Телефон",
      "Доп. телефон",
      "Email",
      "Vk",
      "Facebook",
      "Другое"
    ].forEach(optionText => {
        select.add(new Option(optionText, optionText));
    });

    const inputContact = document.createElement("input");
    inputContact.setAttribute("type", "text");
    inputContact.setAttribute("name", "contact");
    inputContact.setAttribute("placeholder", "Введите данные контакта");
    inputContact.classList.add("inputContact");

    if (contactValue) {
      select.value = selectValue;
      inputContact.value = contactValue;
    }

    const btnFormContactDel = document.createElement("button");
    btnFormContactDel.classList.add("bttnReset", "btnFormContactDel");
    
    btnFormContactDel.hidden = true;

    inputContact.addEventListener("input", function () {
        btnFormContactDel.hidden = inputContact.value === "";
    });


    if (contactValue) {
      btnFormContactDel.hidden = false;
    }

    btnFormContactDel.addEventListener("click", function () {
      divSelect.remove();
    });

    divSelect.append(select, inputContact, btnFormContactDel);

    parentElement.append(divSelect);
  }
}

const newForm = document.getElementById("newForm");

newForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const surname = document.getElementById("surname").value.trim();
  const lastName = document.getElementById("lastName").value.trim();

  const newStudent = {
    name,
    surname,
    lastName,
    contacts: [],
  };

  const contactType = document.querySelectorAll(".typeOfContact");
  const contactValue = document.querySelectorAll(".inputContact");
  for (let i = 0; i < contactType.length; i++) {
    newStudent.contacts.push({
      type: contactType[i].value,
      value: contactValue[i].value,
    });
  }

  const student = await POSTtoAPI(newStudent);
  createitem(student);

  newForm.reset();

  backShadow.hidden = true;
  modalAdd.hidden = true;

  const contactWrapper = document.getElementById("contactAddWrap1");
  contactWrapper.innerHTML = "";
});

const addContactBtn1 = document.getElementById("addContactBtn1");
addContactBtn1.addEventListener("click", () => {
  const parentElement = document.getElementById("contactAddWrap1");
  createContactElement(parentElement);

  addContactBtn1.classList.add("added");
});

const addContactBtn = document.getElementById("addContactBtn");
addContactBtn.addEventListener("click", () => {
  const parentElement = document.getElementById("contactAddWrap");
  createContactElement(parentElement);

  addContactBtn.classList.add("added");
});

function setupSorting(columnId, className, dataKey, isDate = false) {
    const column = document.getElementById(columnId);
    column.addEventListener("click", async () => {
      column.classList.toggle(className);
  
      const data = await getFromAPI();
  
      data.sort((a, b) => {
        let valueA = a[dataKey];
        let valueB = b[dataKey];
  
        if (isDate) {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        } else if (typeof valueA === 'string' && typeof valueB === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }
  
        return column.classList.contains(className)
          ? valueB > valueA ? 1 : -1
          : valueA > valueB ? 1 : -1;
      });
  
      createTable(data);
    });
  }
  
  setupSorting("nameCol", "a-b", (a) => `${a.surname}${a.name}${a.lastname}`);
  setupSorting("IDCol", "idFil", "id");
  setupSorting("cDateCol", "a-b", "createdAt", true);
  setupSorting("uDateCol", "a-b", "updatedAt", true);

const searchBox = document.getElementById("searchBox");

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

const handleInput = async () => {
  const data = await getFromAPI();

  const filteredData = data.filter((item) =>
    (item.surname + item.name + item.lastname)
      .toLowerCase()
      .includes(searchBox.value.toLowerCase())
  );

  createTable(filteredData);
};

searchBox.addEventListener("input", debounce(handleInput, 300));

document.addEventListener("DOMContentLoaded", async function () {
  const data = await getFromAPI();
  createTable(data);
});
