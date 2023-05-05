import { BOOKS_PER_PAGE, authors, genres, books, html} from './data.js'

window.scrollTo({ top: 0, behavior: 'smooth' });


let matches = books
let page = 1;

if (!books && !Array.isArray(books)) {
    throw new Error('Source required') 
}

let range = [(page - 1) * BOOKS_PER_PAGE, BOOKS_PER_PAGE]
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
     * @param {Array} booksArr 
     * @param {number} booksPerPage 
     * @param {number} Page 
     * @returns {DocumentFragment}
     */
    const createPreviewFragment = (booksArr, bookRange) => {
        const previewFragment = document.createDocumentFragment()
        let extractedBooks = booksArr.slice(bookRange[0], bookRange[1])

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


// //Adding the "All genres" in the select
// const genresFrag = document.createDocumentFragment()
// let optionElement = document.createElement('option') //creating the <select><option><option><select>
// optionElement.value = 'any'
// optionElement.innerText = 'All Genres'
// genresFrag.appendChild(optionElement)

// // add the rest of the genres
// for (const [id, genreValue] of Object.entries(genres)) {

//     const genreElement = document.createElement('option')
//     genreElement.value = genreValue //specifies value to be sent to a server
//     genreElement.innerText = genreValue
//     genresFrag.appendChild(genreElement)
// }
// //appending to frag
// // const genreSelect = document.querySelector('[data-search-genres]')
// html.search.genre.appendChild(genresFrag)

// //add the "All authors" select
// const authorsFrag = document.createDocumentFragment()
// let allAuthorsElement = document.createElement('option')
// allAuthorsElement.value = 'any'
// allAuthorsElement.innerText = 'All Authors'
// authorsFrag.appendChild(allAuthorsElement)


// //adding the rest of the authors
// for (const [id, authorValue] of Object.entries(authors)) {
//     const authorElement = document.createElement('option')
//     authorElement.value = authorValue
//     authorElement.innerText = authorValue
//     authorsFrag.appendChild(authorElement)
// }
// //appedning to the frag
// // const authorSelect = document.querySelector('[data-search-authors]')
// html.search.author.appendChild(authorsFrag)




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


//----------Example

const addPreviewEventListeners = () => {
    const previewsArray = Array.from(document.querySelectorAll('[preview]'))

    for (const preview of previewsArray) {
        preview.addEventListener('click', bookPreviewHandler )
    }
}
html.list.item.appendChild(createPreviewFragment(matches, range))



const displayBooks = (booksArr, Currentpage) => {
    let remaining = booksArr.length - (Currentpage * BOOKS_PER_PAGE)

    let hasRemaining = remaining > 0

    html.list.button.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${hasRemaining === true ? remaining : 0})</span>
    `

    if (hasRemaining === false) {
        html.list.button.disabled = true
    }
}
displayBooks(matches, page)


// show more books 

// const displayBooks = () => {
//     let startIndex = (page -1) * BOOKS_PER_PAGE
//     let endIndex = startIndex + BOOKS_PER_PAGE
//     let booksToDisplay = books.slice(startIndex, endIndex)

//     // const listItems = document.querySelector('[data-list-items]')
//     html.list.item.appendChild(createPreviewFragment(booksToDisplay, BOOKS_PER_PAGE, page))
 


// let itemsLeft = books.length - endIndex
// let itemsLeftText = `Show more (${itemsLeft}) `
// // const listButton = document.querySelector('[data-list-button]')
// html.list.button.innerText = itemsLeftText
// if (itemsLeft <= 0) {
//     listButton.style.display = "none"
// }
// page=page+1
// }
//  displayBooks();
// //  const listButton = document.querySelector('[data-list-button]')

const showMoreHandler = () => {
    page = page + 1
    range = [(page - 1) * BOOKS_PER_PAGE, page * BOOKS_PER_PAGE]

    html.list.item.appendChild(createPreviewFragment(matches, range))
    addPreviewEventListeners()

    displayBooks(matches, page)
}

html.list.button.addEventListener('click', showMoreHandler)
 




// ***EVENT HANDLERS **


const headerSearchHandler = () => { 
    
    html.search.overlay.style.display = 'block'
html.search.title.focus();
}

const headerSearchCancelHandler = () => { 
   html.search.overlay.style.display = 'none'
}

const headerSettingsHandler = () => {
    html.settings.overlay.style.display = 'block'
}

const headerSettingsCancelHandler = () => {
   html.settings.overlay.style.display = 'none'
}


    

//--------------------------------------------------------
/**
 * This handler will fire when a user clicks on submit button of the search overlay. When the user manipulates the input fields of Title, genre or author so that it can be filtered to the books they desire, the filtered books will then be shown on the webpage 
 * @param {Event} event 
 */
  
//--------------------------------------------------------------------------------
const handleSearchSubmit = (event) => {
    html.search.overlay.style.display = 'none'
    event.preventDefault()
    

    const formData = new FormData(event.target)
    
    const filters = Object.fromEntries(formData)
    
    let result = []


    if (filters.title === "" && filters.genre === 'any' && filters.author === 'any') {
        result.push(books) 
    } else {  
        
             
        for (let singleBook in books) {
            
            const titleMatch = filters.title.trim() === '' || (books[singleBook].title.toLowerCase()).includes(filters.title.toLowerCase())

            
            const authorMatch = filters.author === 'any' || books[singleBook].author === filters.author

          
            let genreMatch = false

                for (let singleGenre in books[singleBook].genres) {
                    if (filters.genre === 'any') {
                        genreMatch = true
                    }
                    else if (books[singleBook].genres[singleGenre] === filters.genre) {
                        genreMatch = true
                    }
                }
                
        
            if (titleMatch && authorMatch && genreMatch) {
                result.push(books[singleBook])
            }
        }
    }
    
    matches = result
    console.log(result)

   
    matches.length === 0 ? html.list.message.style.display = 'block' : html.list.message.style.display = 'none'

    // the page and range values are reset to initial conditions, since results are displayed starting on a new page
    page = 1
    range = [(page - 1) * BOOKS_PER_PAGE, page * BOOKS_PER_PAGE]
    html.list.button.disabled = false

    // exisiting results are overwritten with an empty string and then the HTML containing the new list of previews is inserted
    html.list.item.innerHTML = ""
    html.list.item.appendChild(createPreviewFragment(result, range))
    addPreviewEventListeners()

  displayBooks(matches, page)
    html.search.form.reset()
}
html.search.form.addEventListener('submit', handleSearchSubmit)
//---------------------------------------------------------------
// const searchSubmitHandler = (event) => {
//     html.search.overlay.style.display = 'none'
//     event.preventDefault()
//     const formData = new FormData(event.target)
//     const filters = Object.fromEntries(formData)
//     let results = []


//     const noResultsMessage = document.querySelector('[data-list-message]')

//     const selectedGenre =filters.genre
//     const selectedAuthor =filters.author
//     const titleFilter = filters.title.toLowerCase()

    
//     // function swapKeysAndValues(obj) {
//     //     const swappedObj = {};
//     //     for (const [key, value] of Object.entries(obj)) {
//     //       swappedObj[value] = key;
//     //     }
//     //     return swappedObj;
//     //   }
//     // const swappedgenres = swapKeysAndValues(genres)
      
   

//     for (let i = 0; i < books.length; i++) {
//         const book = books[i];
// //    if (titleFilter === '' && selectedGenre === 'any' && selectedAuthor === 'any') {
// //             results = books
// //         }

//         const matchesAuthor = selectedAuthor === "any" || authors[book.author] === selectedAuthor;
//         const matchesTitle = titleFilter === ''|| book.title.toLowerCase().includes(titleFilter);

//         let matchesGenre = selectedGenre === 'any'
    
//                const genreId = Object.keys(swappedgenres).find(key => swappedgenres[key].includes(selectedGenre));
//                 books.filter(book => book.genres.includes(genreId));
//                 console.log(genreId)
    
//                 //     for (let j = 0; j < book.genres.length; j++) {
//                 //         if(swappedgenres.includes(selectedGenre)){
//                 //             console.log(true)
//                 //         }
//                 //         genres.filter(([key]) => key.includes(selectedGenre))
//                 //         if (book.genres[j] === ) { 
                       
//                 //        matchesGenre = true 
//                 //        console.log('true')
//                 //     }
//                 //  }

//         if ( matchesAuthor && matchesTitle) {
//            results.push(book)
//         }

//     }    

//     console.log(results)


//       const allItems = html.list.item.querySelectorAll('.preview')

//       for (const item of allItems){
//         item.remove()
//       }
//       for (let i =0; i<results.length; i++){
//        html.list.item.appendChild(createPreview(results[i]))
//       }
      
// // html.list.item.appendChild(createPreviewFragment(results, BOOKS_PER_PAGE, page))

// if (results.length > BOOKS_PER_PAGE) {
    
//     let startIndex = (page -1) * BOOKS_PER_PAGE
//     let endIndex = startIndex + BOOKS_PER_PAGE
//     let booksToDisplay = books.slice(startIndex, endIndex)

//     // const listItems = document.querySelector('[data-list-items]')
//     html.list.item.appendChild(createPreviewFragment(booksToDisplay, BOOKS_PER_PAGE, page))
 


// let itemsLeft = results.length - endIndex
// let itemsLeftText = `Show more (${itemsLeft}) `
// html.list.button.innerText = itemsLeftText
// if (itemsLeft <= 0) {
//     listButton.style.display = "none"
// }


// }
// if (results.length < BOOKS_PER_PAGE) {
//     let itemsLeftText = `Show more (${0}) `
// html.list.button.innerText = itemsLeftText
// html.list.button.removeEventListener('click', displayBooks)

// }
    
//         if (results.length === 0) {
//             noResultsMessage.classList.add('list__message_show')
//             html.list.button.disabled = true
//         } else {
//              noResultsMessage.classList.remove('list__message_show')
//              html.list.button.disabled = false
//         }


//     }
    //-------------------------------------------------------------



/**
 * This handler will fire when a user click on a any book displayed. In order to determine which book the user is currently clicking on the entire event buble path is checked with event.path or event.composedPath(). The bubbling path is looped over until an element with a preview ID is found. Once found the book preview overlay will appear
 * @param {Event} event 
 *
 */
const bookPreviewHandler= (event) => { // when you click on book 
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
addPreviewEventListeners()

/**
 * This handler will fire when the book Preview overlay is closed. The overlay will be closed
 */
const bookPreviewCloseHandler = () => {
    html.preview.active.style.display= 'none';
}



// ***EVENT LISTENERS **

html.settings.form.addEventListener('submit', settingsSubmitHandler) //toggling dark and light mode

html.search.cancel.addEventListener('click', headerSearchCancelHandler)

html.other.search.addEventListener('click', headerSearchHandler) 

html.other.settings.addEventListener('click', headerSettingsHandler) 

html.settings.cancel.addEventListener('click', headerSettingsCancelHandler) 



html.preview.close.addEventListener('click', bookPreviewCloseHandler)

html.list.item.addEventListener('click', bookPreviewHandler)



