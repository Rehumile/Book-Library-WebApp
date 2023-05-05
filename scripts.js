import { BOOKS_PER_PAGE, authors, genres, books, html} from './data.js'

window.scrollTo({ top: 0, behavior: 'smooth' });


let matches = books
let page = 1;

if (!books && !Array.isArray(books)) {
    throw new Error('Source required') 
}

    let startIndex = (page -1) * BOOKS_PER_PAGE
    let endIndex = BOOKS_PER_PAGE

let range = [startIndex, endIndex]
if (!range && range.length < 2) {
    throw new Error('Range must be an array with two numbers')
}



/**
 * A function that takes a book as an object literal and converts it into an HTML element that can be appended to the DOM. Creating book elements individually prevents the JS having to re-render the entire DOM every time a new book is created
 * @param {object} props 
 * @returns {HTMLElement}
 */
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


    /**
     * This function will take the books object and the number of books required per page and the page number. It will create a document Fragment whereby all the book previews made from the createPreview function will be looped through and add to the document fragment 
     * @param {Array} booksArray 
     * @param {number} bookRange 
     * @returns {DocumentFragment}
     */
    const createPreviewFragment = (booksArray, bookRange) => {
        const previewFragment = document.createDocumentFragment()
        let extractedBooks = booksArray.slice(bookRange[0], bookRange[1])

        for (let i =0; i < extractedBooks.length;i++) {
            const {author,  id, image, title} = extractedBooks[i]

            const preview = createPreview( {author, id, image, title})
            previewFragment.appendChild(preview)
        }

return previewFragment
    }

/**
 * The purpose of this function is to add the values of the genres and authours objects into the form select. Although it is for the population of the form select of the authors and genre object. This function can be reused for other form selects
 * @param {Object} objectSource - object from where the values will be created 
 * @param {String} formLabel - The title of the form select
 * @param {Node} formSource - Dom node which where the values will be appended
 */
 const dropDownPopulate = (objectSource, formLabel, formSource) => {

    const fragment = document.createDocumentFragment()
    let optionElement = document.createElement('option')
    optionElement.value = 'any'
    optionElement.textContent = `All ${formLabel}`
    fragment.appendChild(optionElement)

    for (const [key, value] of Object.entries(objectSource)) {
        const formElement = document.createElement ('option')
        formElement.value = value
        formElement.innerText = value
        fragment.appendChild(formElement)
    }

    formSource.appendChild(fragment)

 }
 dropDownPopulate(genres, "Genre", html.search.genre)
 dropDownPopulate(authors, "Author", html.search.author)



/**
 * This object literal stores the settings of the colors of the dark and night mode in 'RGB' form. This will update the css settings when user chooses between dark and night mode
 */
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


/**
 * This will check for a preference of dark in the css . If there is then the theme setting will update to the value in {@link css} object
 */
const themeValue = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 

if (themeValue) {
    document.documentElement.style.setProperty('--color-dark', css.night.dark)
    document.documentElement.style.setProperty('--color-light', css.night.light)
} else {
    document.documentElement.style.setProperty('--color-light', css.day.dark)
    document.documentElement.style.setProperty('--color-light', css.day.light)
}


/**
 * This event handler will fire when the user changes value of dropdown in settings and clicks on the "Save" button. It can toggle between a light mode and dark mode so that a user can use the app comfortably at night.
 * @param {Event} event 
 */
const settingsSubmitHandler = (event) => { 
    event.preventDefault()
    const formData = new FormData(event.target)
    const result = Object.fromEntries(formData)

    document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
    document.documentElement.style.setProperty('--color-light', css[result.theme].light);
   html.settings.overlay.style.display = 'none';
}



/**
 * This function will fire when book previews are added to the web page. This will add event listeners so they will be able to be clicked and view the open active Preview with the {@link bookPreviewHandler}
 */
const addBookPreviewHandler = () => {
    const previewsArray = Array.from(document.querySelectorAll('[preview]'))

    for (const preview of previewsArray) {
        preview.addEventListener('click', bookPreviewHandler )
    }
}
html.list.item.appendChild(createPreviewFragment(matches, range))


/** 
 * This function will uodate the "Show more" button and the remaining books left to display on the web page 
 * @param {Array} booksArray - current books that will be display which stored in the 'matches' variable 
 * @param {Number} bookPage - current page number
 */
const displayBooks = (booksArray, bookPage) => {
    let itemsLeft = booksArray.length - (bookPage * BOOKS_PER_PAGE)

    let hasRemaining = itemsLeft > 0

    html.list.button.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${hasRemaining === true ? itemsLeft : 0})</span>
    `

    if (hasRemaining === false) {
        html.list.button.disabled = true
    }
}
displayBooks(matches, page)


/**
 * This handler will fire when a user clicks on the "Show More" button. The page number will increase by 1 and new book items will be appended to the webpage. The new book items will now be able to be clicke on to view the book overlay and the "show more" button with number of items left will be updated
 */
const showMoreHandler = () => {
    page = page + 1
    range = [(page - 1) * BOOKS_PER_PAGE, page * BOOKS_PER_PAGE]

    html.list.item.appendChild(createPreviewFragment(matches, range))
    addBookPreviewHandler()

    displayBooks(matches, page)
}

html.list.button.addEventListener('click', showMoreHandler)
 




// ***EVENT HANDLERS **

/**
 * This event handler will fire when a user click on the "search button". The form overlay will appear allowing user to filter books by genre, author or title
 */
const headerSearchHandler = () => { 
    html.search.overlay.style.display = 'block'
    html.search.title.focus();
}
/**
 * This event handler will fire when a user clicks on the "cancel" button in the search overlay
 */
const headerSearchCancelHandler = () => { 
   html.search.overlay.style.display = 'none'
}

/**
 * This event handler will fire when a user clicks on the "settings" button. The form overlay will appear allowing the user to toggle the dark and light mode
 */
const headerSettingsHandler = () => {
    html.settings.overlay.style.display = 'block'
}

/**
 * This event handler will fire when a user clicks on the "cancel" button in the settings overlay
 */
const headerSettingsCancelHandler = () => {
   html.settings.overlay.style.display = 'none'
}

    
/**
 * This handler will fire when a user clicks on submit button of the search overlay. When the user manipulates the input fields of Title, genre or author so that it can be filtered to the books they desire, the filtered books will then be shown on the webpage 
 * @param {Event} event 
 */
  

const searchSubmitHandler = (event) => {
    html.search.overlay.style.display = 'none'
    event.preventDefault()
    

    const formData = new FormData(event.target)
    
    const filters = Object.fromEntries(formData)
    
    let result = []


    if (filters.title === "" && filters.genre === 'any' && filters.author === 'any') {
        result = books
    } else {  
          
        for (let i = 0; i < books.length; i++) {
            const book= books[i] 
            
            const titleMatch = filters.title.trim() === '' || (book.title.toLowerCase()).includes(filters.title.toLowerCase())

            
            const authorMatch = filters.author === 'any' || authors[book.author] === filters.author

          
            let genreMatch = false

                for (let j = 0; j < book.genres.length; j++) {
                    if (filters.genre === 'any') {
                        genreMatch = true
                    }
                    else if (book.genres[j] === filters.genre) {
                        genreMatch = true
                    }
                }
                
        
            if (titleMatch && authorMatch && genreMatch) {
                result.push(book)
            }
        }
    }
    
    matches = result
    console.log(result)

    page = 1
    range = [(page - 1) * BOOKS_PER_PAGE, page * BOOKS_PER_PAGE]
    html.list.button.disabled = false

    html.list.item.innerHTML = ""
    html.list.item.appendChild(createPreviewFragment(result, range))
    addBookPreviewHandler()

  displayBooks(matches, page)
    html.search.form.reset()
}
html.search.form.addEventListener('submit', searchSubmitHandler)




/**
 * This handler will fire when a user clicks on any book displayed. In order to determine which book the user is currently clicking on the entire event buble path is checked with event.path or event.composedPath(). The bubbling path is looped over until an element with a preview ID is found. Once found the book preview overlay will appear and the Image, title containing, subtitle containing the author's name and the year the book was publised as well a short description of the book
 * @param {Event} event 
 *
 */
const bookPreviewHandler= (event) => { 

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
    
    html.preview.active.style.display= 'block';
    html.preview.blur.src = active.image
    html.preview.image.src = active.image
    html.preview.title.innerText = active.title
    html.preview.subtitle.innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
    html.preview.description.innerText = active.description

}
addBookPreviewHandler()

/**
 * This handler will fire when the book Preview overlay is closed. The overlay will be closed
 */
const bookPreviewCloseHandler = () => {
    html.preview.active.style.display= 'none';
}



// ***EVENT LISTENERS **

html.settings.form.addEventListener('submit', settingsSubmitHandler) 

html.search.cancel.addEventListener('click', headerSearchCancelHandler)

html.other.search.addEventListener('click', headerSearchHandler) 

html.other.settings.addEventListener('click', headerSettingsHandler) 

html.settings.cancel.addEventListener('click', headerSettingsCancelHandler) 

html.list.button.addEventListener('click', showMoreHandler)

html.preview.close.addEventListener('click', bookPreviewCloseHandler)

html.list.item.addEventListener('click', bookPreviewHandler)

html.search.form.addEventListener('submit', searchSubmitHandler)







