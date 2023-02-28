const API = "http://localhost:8000/students";

let surname = document.querySelector("#surname");
let name = document.querySelector("#name");
let number = document.querySelector("#number");
let weekKPI = document.querySelector("#weekKPI");
let monthKPI = document.querySelector("#monthKPI");

let btnAdd = document.querySelector("#btn-add");

let editSurname = document.querySelector("#edit-surname");
let editName = document.querySelector("#edit-name");
let editNumber = document.querySelector("#edit-number");
let editWeekKPI = document.querySelector("#edit-wKPI");
let editMonthKPI = document.querySelector("#edit-mKPI");

let editSaveBtn = document.querySelector("#btn-save-edit");
let exampleModal = document.querySelector("#exampleModal");

let list = document.querySelector("#product-list");

let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let currentPage = 1;
let pageTotalCount = 1;

let searchInp = document.querySelector("#search");
let searchVal = "";

btnAdd.addEventListener("click", async (e) => {
  let obj = {
    surname: surname.value,
    name: name.value,
    number: number.value,
    weekKPI: weekKPI.value,
    monthKPI: monthKPI.value,
  };

  if (
    !obj.surname.trim() ||
    !obj.name.trim() ||
    !obj.number.trim() ||
    !obj.weekKPI.trim() ||
    !obj.monthKPI.trim()
  ) {
    alert("Заполните все поля");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });

  surname.value = "";
  name.value = "";
  number.value = "";
  weekKPI.value = "";
  monthKPI.value = "";

  render();
});

async function render() {
  let res = await fetch(`${API}?q=${searchVal}&_page=${currentPage}&_limit=3`);
  let students = await res.json();

  drawPaginationButtons();

  list.innerHTML = "";
  students.forEach((element) => {
    let newElem = document.createElement("div");
    newElem.id = element.id;
    newElem.style.displayFlex = "";

    newElem.innerHTML = `
    <div class="card m-5" style="width: 25rem; text-align: center; background-color: orange; color: white; ">
    <div>
  <img src="https://t4.ftcdn.net/jpg/01/64/58/41/360_F_164584108_O4v6uZDZg4wPvPz8Z5Iad5pvoWjMAqEP.jpg" class="card-img-top" style="width: 60px; height: 60px;border-radius: 35px;margin: auto; margin-top: 10px; padding: 5px; border: white 2px solid; box-shadow: 8px 15px 15px black" alt="...">
  </div>
  <div class="card-body">
    <h6 class="card-title">${element.surname}</h6>
    <h4 class="card-text">${element.name}</h4>
    <p class="card-text">${element.number}</p>
    <p class="card-text">${element.weekKPI}</p>
    <p class="card-text">${element.monthKPI}</p>
    <a href="#" id=${element.id} class="btn btn-outline-danger btn-delete">Удалить</a>
    <a href="#" id=${element.id} class="btn btn-outline-success btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal">Внести изменение</a>
  </div>
</div>
    `;
    list.append(newElem);
  });
}

render();

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    let id = e.target.id;
    fetch(`${API}/${id}`, { method: "DELETE" }).then(() => render());
  }
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;

    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editSurname.value = data.surname;
        editName.value = data.name;
        editNumber.value = data.number;
        editWeekKPI.value = data.weekKPI;
        editMonthKPI.value = data.monthKPI;

        editSaveBtn.setAttribute("id", data.id);
      });
  }
});

editSaveBtn.addEventListener("click", function () {
  let id = this.id;

  let surname = editSurname.value;
  let name = editName.value;
  let number = editNumber.value;
  let weekKPI = editWeekKPI.value;
  let monthKPI = editMonthKPI.value;

  if (
    !surname.trim() ||
    !name.trim() ||
    !number.trim() ||
    !weekKPI.trim() ||
    !monthKPI.trim()
  ) {
    alert("Заполните поле");
    return;
  }

  let editedProduct = {
    surname: surname,
    name: name,
    number: number,
    weekKPI: weekKPI,
    monthKPI: monthKPI,
  };

  saveEdit(editedProduct, id);
});

function saveEdit(editedProduct, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedProduct),
  }).then(() => render());

  let modal = bootstrap.Modal.getInstance(exampleModal);
  modal.hide();
}

function drawPaginationButtons() {
  fetch(`${API}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      pageTotalCount = Math.ceil(data.length / 3);

      paginationList.innerHTML = "";
      for (let i = 1; i <= pageTotalCount; i++) {
        if (currentPage == i) {
          let page1 = document.createElement("li");
          page1.innerHTML = `
          <li class="page-item active"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.append(page1);
        } else {
          let page1 = document.createElement("li");
          page1.innerHTML = `
            <li class="page-item"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.append(page1);
        }
      }

      if (currentPage == 1) {
        prev.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
      }

      if (currentPage == pageTotalCount) {
        next.classList.add("disabled");
      } else {
        next.classList.remove("disabled");
      }
    });
}

prev.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }

  currentPage--;
  render();
});

next.addEventListener("click", () => {
  if (currentPage >= pageTotalCount) {
    return;
  }

  currentPage++;
  render();
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("page_number")) {
    currentPage = e.target.innerText;

    render();
  }
});

searchInp.addEventListener("input", () => {
  searchVal = searchInp.value;
  render();
});
