import { BOOKS_PER_PAGE, authors, genres, books} from './data.js'

window.scrollTo({ top: 0, behavior: 'smooth' });

//Html object reference
const html = {
    list: {
        item: document.querySelector('[data-list-items]'),
        message: document.querySelector('[data-list-message]'),
        button : document.querySelector('[data-list-button]')},
    preview : {
       active: document.querySelector('[data-list-active]'),
       blur : document.querySelector('[data-list-blur]'),
       image: document.querySelector('[data-list-image]'),
       title: document.querySelector('[data-list-title]'),
       subtitle: document.querySelector('[data-list-subtitle]'),
       description: document.querySelector('[data-list-description]'),
       close: document.querySelector('[data-list-close]')
    },
    search : {
        overlay : document.querySelector('[data-search-overlay]'),
        form: document.querySelector('[data-search-form]'),
        title: document.querySelector('[data-search-title]'),
        genre : document.querySelector('[data-search-genres]'),
        author: document.querySelector('[data-search-authors]'),
        cancel: document.querySelector('[data-search-cancel]')
    },
    settings : {
        overlay: document.querySelector('[data-settings-overlay]'),
        form: document.querySelector('[data-settings-form]'),
        theme: document.querySelector('[data-settings-theme]'),
        cancel: document.querySelector('[data-settings-cancel]')
    },
    other: {
        settings: document.querySelector('[data-header-settings]'),
        search: document.querySelector('[data-header-search]')
    }
    }

const matches = books
let page = 1;

// if (!books && !Array.isArray(books)) {
//     throw new Error('Source required') 
// }
// if (!range && range.length < 2) {
//     throw new Error('Range must be an array with two numbers')
// }



// This function will take an object as an argument and create HTMl for book to be display
     const createPreview = (props) => {
      const {author,  id, image, title} = props

        
        let BookElement = document.createElement('button')
        BookElement.classList = 'preview'
        BookElement.setAttribute('data-preview', id)

        BookElement.innerHTML = /* html */ `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `
        return BookElement
    }
    // This function will create a doc frag and loop through each book will be appended to the frag 
    const createPreviewFragment = (booksArr, booksPerPage, Page) => {
        const previewFragment = document.createDocumentFragment()
        const extractedBooks = booksArr.slice(0, booksPerPage)

        for (let i =0; i < extractedBooks.length;i++) {
            const {author,  id, image, title} = extractedBooks[i]

            const preview = createPreview( {author, id, image, title})
            previewFragment.appendChild(preview)
        }

return previewFragment
    }

    // const listItems = document.querySelector('[data-list-items]')
    // listItems.appendChild(createPreviewFragment(books, BOOKS_PER_PAGE, page))
 

//Adding the "All genres" in the select
const genresFrag = document.createDocumentFragment()
let optionElement = document.createElement('option') //creating the <select><option><option><select>
optionElement.value = 'any'
optionElement.innerText = 'All Genres'
genresFrag.appendChild(optionElement)

// add the rest of the genres
for (const [id, genreValue] of Object.entries(genres)) {

    const genreElement = document.createElement('option')
    genreElement.value = genreValue //specifies value to be sent to a server
    genreElement.innerText = genreValue
    genresFrag.appendChild(genreElement)
}
//appending to frag
// const genreSelect = document.querySelector('[data-search-genres]')
html.search.genre.appendChild(genresFrag)

//add the "All authors" select
const authorsFrag = document.createDocumentFragment()
let allAuthorsElement = document.createElement('option')
allAuthorsElement.value = 'any'
allAuthorsElement.innerText = 'All Authors'
authorsFrag.appendChild(allAuthorsElement)


//adding the rest of the authors
for (const [id, authorValue] of Object.entries(authors)) {
    const authorElement = document.createElement('option')
    authorElement.value = authorValue
    authorElement.innerText = authorValue
    authorsFrag.appendChild(authorElement)
}
//appedning to the frag
// const authorSelect = document.querySelector('[data-search-authors]')
html.search.author.appendChild(authorsFrag)




// toggle dark and light mode
const css = { 
day: {
    dark: '10, 10, 20',
    light: '255, 255, 255',
},

night :{
    dark: '255, 255, 255',
    light: '10, 10, 20',
}
}
// *************Code I need to figure out *************
// themeValue === window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'
// const v = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' | 'day'

// //The setProperty() method sets a new or modifies an existing CSS property in a CSS declaration block.
// documentElement.style.setProperty('--color-dark', css[v].dark);
// documentElement.style.setProperty('--color-light', css[v].light);
// *************Code I need to figure out above *************

// const themeValue = document.querySelector('[data-settings-theme]').value

const settingsSubmitHandler = (event) => { // submit button
    event.preventDefault()
    const formData = new FormData(event.target)
    const result = Object.fromEntries(formData)

    document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
    document.documentElement.style.setProperty('--color-light', css[result.theme].light);
   html.settings.overlay.style.display = 'none';
}


// show more books 

const displayBooks = () => {
    let startIndex = (page -1) * BOOKS_PER_PAGE
    let endIndex = startIndex + BOOKS_PER_PAGE
    let booksToDisplay = books.slice(startIndex, endIndex)

    // const listItems = document.querySelector('[data-list-items]')
    html.list.item.appendChild(createPreviewFragment(booksToDisplay, BOOKS_PER_PAGE, page))
 


let itemsLeft = books.length - endIndex
let itemsLeftText = `Show more (${itemsLeft}) `
// const listButton = document.querySelector('[data-list-button]')
html.list.button.innerText = itemsLeftText
if (itemsLeft <= 0) {
    listButton.style.display = "none"
}
}
 displayBooks();
//  const listButton = document.querySelector('[data-list-button]')
html.list.button.addEventListener('click', function () {
    page = page + 1;
    displayBooks();

 })
 

//---------------------------------------------------------
// const listButton = document.querySelector('[data-list-button]')

// const booksRemaining = books.length - BOOKS_PER_PAGE
//  listButton.innerHTML = `Show more (${booksRemaining})`
 

// // listButton.disabled = !(matches.length - [page * BOOKS_PER_PAGE] > 0)

// listButton.innerHTML = /* html */ [
//     `<span>Show more</span>,
//     '<span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE) > 0 ? matches.length - (page * BOOKS_PER_PAGE) : 0)})</span>`,
// ]
// const loadMoreButton = (event) => {
//     const listItems = document.querySelector('[data-list-items]')
//     listItems.appendChild(createPreviewFragment(matches, (page * BOOKS_PER_PAGE), ((page + 1) * BOOKS_PER_PAGE)))
//     // actions.list.updateRemaining()
//     page = page + 1
// }

// listButton.addEventListener('click', loadMoreButton)


//     let initial = matches.length - [page * BOOKS_PER_PAGE]
//     let remaining = matches.length - (page * BOOKS_PER_PAGE) > 0 ? matches.length - (page * BOOKS_PER_PAGE) : 0;
// let hasRemaining = true;
//     listButton.disabled = remaining === hasRemaining ? initial : 0

//    listButton.innerHTML = /* html */ `
//         <span>Show more</span>
//         <span class="list__remaining"> (${remaining})</span>`
//--------------------------------------------------



// ***EVENT HANDLERS **
const headerSearchHandler = (event) => { //open Search
    // const searchOverlay = document.querySelector('[data-search-overlay]')
    html.search.overlay.style.display = 'block'
}

const headerSearchCancelHandler = (event) => { // press Cancel on search overlay
    // const searchOverlay = document.querySelector('[data-search-overlay]')
   html.search.overlay.style.display = 'none'
}

const headerSettingsHandler = (event) => {
    // const settingsOverlay = document.querySelector('[data-settings-overlay]')
    html.settings.overlay.style.display = 'block'
    // const searchTitle = document.querySelector('[data-search-title]')
    html.search.title.focus();
}
const headerSettingsCancelHandler = (event) => {
    // const settingsOverlay = document.querySelector('[data-settings-overlay]')
   html.settings.overlay.style.display = 'none'

}


     
const searchForm = document.querySelector('[data-search-form]')
const filtersHandler = (event) => {
    event.preventDefault()
    const formData = new FormData(searchForm)
    const filters = Object.fromEntries(formData)

    const noResultsMessage = document.querySelector('[data-list-message]')

    const selectedGenre =filters.genre
    const selectedAuthor =filters.author
    const titleFilter = filters.title.toLowerCase()
  
    let results = []
    for (let i = 0; i < books.length; i++) {

        const book = books[i];
   
       
        const matchesAuthor = selectedAuthor === "any" || authors[book.author] === selectedAuthor;
        const matchesTitle = book.title.toLowerCase().includes(titleFilter);

               let matchesGenre = selectedGenre === 'any'
    
                    for (let j = 0; j < book.genres.length; j++) {
                        if (book.genres[j] === genres[book.genres[j]]) { 
                        matchesGenre = true 
                    }
                 }

        if ( matchesAuthor && matchesTitle && matchesGenre) {
           results.push(book)
        
        }

    }


    //   const allItems = html.list.item.querySelectorAll('.preview')

    //   for (const item of allItems){
    //     item.remove()
    //   }
// html.list.item.appendChild(createPreviewFragment(results, BOOKS_PER_PAGE, page))
        

        if (results.length === 0) {
            noResultsMessage.classList.add('list__message_show')
            html.list.button.disabled = true
        } else {
             noResultsMessage.classList.remove('list__message_show')
             html.list.button.disabled = false
        }
// // if the results of the filtered books are less than the required 36 books
//         if (results.length < BOOKS_PER_PAGE) {
//             html.list.item.appendChild(createPreviewFragment(results, BOOKS_PER_PAGE, page))

//         } else {

//         }

    }

// filtersHandler({ preventDefault: () => {} })
    



// this event handler will open a book preview of whichever book is clicked on 
const handleBookPreview= (event) => { // when you click on book 

    //array from : static method creates a new, shallow-copied array instance from an array like object
    let pathArray = Array.from(event.path || event.composedPath())
    let active = null;
    

    for (const node of pathArray) {
const previewId = node.dataset.preview
        if (active)
         break;

        for (const singleBook of books) {
            if (singleBook.id === previewId) {
                active = singleBook
            }
        } 
 
    }
   
    if (!active) {return}

    // this will the info from the active object into the html for it to be display on the book preview
    html.preview.active.style.display= 'block';

html.preview.blur.src = active.image
html.preview.image.src = active.image

html.preview.title.innerText = active.title

    html.preview.subtitle.innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`

html.preview.description.innerText = active.description

}

const items = document.querySelector('[data-list-items')
items.addEventListener('click', handleBookPreview)

const handleBookPreviewClose = (event) => {
    html.preview.active.style.display= 'none';
}



// EVent listeners


html.settings.form.addEventListener('submit', settingsSubmitHandler) //toggling dark and light mode

// ***EVENT LISTENERS **
const searchCancel = document.querySelector('[data-search-cancel]')
html.search.cancel.addEventListener('click', headerSearchCancelHandler)

const searchButton = document.querySelector('[data-header-search]')
html.other.search.addEventListener('click', headerSearchHandler) 

const settingsButton = document.querySelector('[data-header-settings]')
html.other.settings.addEventListener('click', headerSettingsHandler) 

const settingsCancel = document.querySelector('[data-settings-cancel]')
html.settings.cancel.addEventListener('click', headerSettingsCancelHandler) 

html.search.form.addEventListener('submit', filtersHandler)

html.preview.close.addEventListener('click', handleBookPreviewClose)

