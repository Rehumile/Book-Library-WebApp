import { BOOKS_PER_PAGE, authors, genresObj, books } from "./data.js";
import { selectors, css } from "./domData.js";

const innerHTML = (book, index) => {
  const booksElement = document.createElement("div");
  booksElement.dataset.index = `${index}`;
  booksElement.className = "preview";
  booksElement.id = book.id;
  booksElement.innerHTML = ` <img src = ${
    book.image
  } class = 'preview__image'  alt="${book.title} book image"></img>
  <div class="preview__info">
    <h3 class="preview__title">${book.title}</h3>
    <div class="preview__author">${authors[book.author]}</div>
    </div>`;
  return booksElement;
};

for (let i = 0; i < BOOKS_PER_PAGE; i++) {
  selectors.list.appendChild(innerHTML(books[i], i));
}

let newlyLoaded = 0;

selectors.loadMore.innerHTML = `<span>Show more</span>
<span class = "list__remaining">(${books.length - BOOKS_PER_PAGE})</span>`;

const moreBooksHandler = (e) => {
  e.stopPropagation();
  newlyLoaded += BOOKS_PER_PAGE;
  let booksLeft = books.length - BOOKS_PER_PAGE - newlyLoaded;
  let btnText = booksLeft > 0 ? booksLeft : 0;
  selectors.loadMore.querySelector(
    ".list__remaining"
  ).textContent = `(${btnText})`;

  let booksLoaded = BOOKS_PER_PAGE + newlyLoaded;
  for (let i = newlyLoaded; i < booksLoaded; i++) {
    if (i === books.length - 1) {
      selectors.loadMore.disabled = true;
      break;
    } else {
      selectors.list.appendChild(innerHTML(books[i], i));
    }
  }
};

const openOverlayHandler = (e) => {
  const overlay = selectors.previewOverlay.overlay;
  const bookPreview = e.target.closest(".preview");
  const index = bookPreview.dataset.index;

  selectors.previewOverlay.overlayBlur.src = books[index].image;
  selectors.previewOverlay.overlayImage.src = books[index].image;
  selectors.previewOverlay.titleOverlay.textContent = books[index].title;
  let dateOverlay = new Date(books[index].published).getFullYear();
  selectors.previewOverlay.dataOverlay.textContent = `${
    authors[books[index].author]
  } (${dateOverlay})`;
  selectors.previewOverlay.infoOverlay.textContent = books[index].description;

  overlay.show();
};

const themeToggleHandler = (e) => {
  const darkMode =
    getComputedStyle(document.body).backgroundColor ===
    `rgb(${css.night.light})`;
  selectors.theme.themeSelect.value = darkMode ? "night" : "day";

  const overlay = selectors.theme.themeOverlay;
  const closeBtn = selectors.theme.themeCancelBtn;
  overlay.show();
  if (e.target === closeBtn) {
    overlay.close();
  }
};

const themeSubmitHandler = (e) => {
  e.preventDefault();

  const overlay = selectors.theme.themeOverlay;
  const formData = new FormData(e.target);
  const themeChoice = Object.fromEntries(formData);
  const theme = themeChoice.theme;
  document.documentElement.style.setProperty("--color-dark", css[theme].dark);
  document.documentElement.style.setProperty("--color-light", css[theme].light);
  overlay.close();
};

let formValues;
const searchToggleHandler = (e) => {
  const overlay = selectors.search.searchOverlay;
  const closeBtn = selectors.search.searchCancelBtn;
  overlay.show();
  if (formValues) {
    selectors.genresSelect.value = formValues.genre;
    selectors.authorSelect.value = formValues.author;
    selectors.title.value = formValues.title;
  }
  if (e.target === closeBtn) {
    overlay.close();
  }
};

let filteredBooks;
let filteredLoad;
const searchSubmitHandler = (e) => {
  e.preventDefault();
  const overlay = selectors.search.searchOverlay;
  const formData = new FormData(e.target);
  const filters = Object.fromEntries(formData);
  const result = [];
  books.forEach((book, index) => {
    const { title, author, genres } = book;
    const categories = [...genres];
    const genreMatch =
      categories.includes(filters.genre) || filters.genre === "All";
    const authorMatch = author === filters.author || filters.author === "All";
    const titleMatch =
      title.toLowerCase().includes(filters.title.toLowerCase()) ||
      filters.title === "";

    if (authorMatch && genreMatch && titleMatch) {
      result.push([book, index]);
    }
  });

  const previews = selectors.list.querySelectorAll(".preview");
  for (const book of previews) {
    book.remove();
  }

  if (result.length === 0) {
    selectors.message.classList.add("list__message_show");
    selectors.loadMore.disabled = true;
    selectors.loadMore.querySelector(".list__remaining").textContent = `(0)`;
  } else {
    selectors.message.classList.remove("list__message_show");
    selectors.loadMore.disabled = false;
  }

  if (result.length < BOOKS_PER_PAGE) {
    for (let i = 0; i < result.length; i++) {
      let book = result[i][0];
      let index = result[i][1];
      selectors.list.appendChild(innerHTML(book, index));
      selectors.loadMore.disabled = true;
      selectors.loadMore.querySelector(".list__remaining").textContent = `(0)`;
    }
  } else {
    for (let i = 0; i < BOOKS_PER_PAGE; i++) {
      let book = result[i][0];
      let index = result[i][1];
      selectors.list.appendChild(innerHTML(book, index));
      selectors.loadMore.querySelector(".list__remaining").textContent = `(${
        result.length - BOOKS_PER_PAGE
      })`;
      selectors.loadMore.removeEventListener("click", moreBooksHandler);
    }
  }

  overlay.close();
  filteredBooks = result;
  filteredLoad = 0;
  formValues = filters;
};

const filterMoreHandler = (e) => {
  if (!filteredBooks) {
    return;
  }
  filteredLoad += BOOKS_PER_PAGE;
  let booksLeft = filteredBooks.length - BOOKS_PER_PAGE - filteredLoad;
  let btnText = booksLeft > 0 ? booksLeft : 0;
  selectors.loadMore.querySelector(
    ".list__remaining"
  ).textContent = `(${btnText})`;

  let booksLoaded = BOOKS_PER_PAGE + filteredLoad;
  for (let i = filteredLoad; i < booksLoaded; i++) {
    if (i === filteredBooks.length - 1) {
      selectors.loadMore.disabled = true;
      break;
    } else {
      let book = filteredBooks[i][0];
      let index = filteredBooks[i][1];
      selectors.list.appendChild(innerHTML(book, index));
    }
  }
};

selectors.loadMore.addEventListener("click", moreBooksHandler);
selectors.loadMore.addEventListener("click", filterMoreHandler);
selectors.list.addEventListener("click", openOverlayHandler);
selectors.previewOverlay.overlayBtn.addEventListener("click", () => {
  selectors.previewOverlay.overlay.close();
});

selectors.theme.themeBtn.addEventListener("click", themeToggleHandler);
selectors.theme.themeCancelBtn.addEventListener("click", themeToggleHandler);
selectors.theme.themeForm.addEventListener("submit", themeSubmitHandler);
selectors.search.searchBtn.addEventListener("click", searchToggleHandler);
selectors.search.searchCancelBtn.addEventListener("click", searchToggleHandler);
selectors.search.searchForm.addEventListener("submit", searchSubmitHandler);