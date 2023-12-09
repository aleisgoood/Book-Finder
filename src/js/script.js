// Fetch books
function fetchBooks(searchInput) {
    const api = `https://openlibrary.org/subjects/${searchInput}.json`;
    return fetch(api)
        .then(response => {
            if (!response.ok) {
                throw new Error('Category not found. Please check your spelling and try again.');
            }
            return response.json();
        });
}

// Render book elem
function renderBookElem(work, onClickHandler) {
    const bookElem = document.createElement('div');
    bookElem.classList.add('book');
    bookElem.textContent = `Title: ${work.title}, Authors: ${work.authors.map(author => `${author.name}`).join(', ')}`;
    bookElem.addEventListener('click', onClickHandler);
    return bookElem;
}
// error handling
function handleError(error, container) {
    console.error('Error:', error.message);
    container.innerHTML = `<p>Error: ${error.message}</p>`;
}

// Search books
function searchBooks() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const resultsContainer = document.getElementById('results');
    const descriptionContainer = document.getElementById('descriptionContainer');
    const searchInputElem = document.getElementById('searchInput');
    const searchButtonElem = document.getElementById('searchButton');
    const h1Elem = document.querySelector('h1');
    h1Elem.style.display = 'none';

    const displayBooks = (works) => {
        works.forEach(work => {
            const bookElement = renderBookElem(work, () => getBookDescription(work.key));
            resultsContainer.appendChild(bookElement);
        });
    };

    fetchBooks(searchInput)
        .then(data => {
            if (!data.works || data.works.length === 0) {
                throw new Error('No books found for the given category. Please try again.');
            }

            displayBooks(data.works);
        })
        .catch(error => {
            handleError(error, resultsContainer);
        });

    // Clear buttons / empty containers 
    searchInputElem.style.display = 'none';
    searchButtonElem.style.display = 'none';
    resultsContainer.innerHTML = '';
    descriptionContainer.innerHTML = '';
}

// Get book description
function getBookDescription(bookKey) {
    const descriptionContainer = document.getElementById('descriptionContainer');
    const h1Elem = document.querySelector('h1');
    h1Elem.style.display = 'none';

    const api = `https://openlibrary.org${bookKey}.json`;

    fetch(api)
        .then(response => {
            if (!response.ok) {
                throw new Error('Book not found. Please check your spelling and try again.');
            }
            return response.json();
        })
        .then(book => {
            const descriptionDiv = createDesDiv(book);
            descriptionContainer.innerHTML = '';
            descriptionContainer.appendChild(descriptionDiv);
        })
        .catch(error => {
            handleError(error, descriptionContainer);
        });
}

// description div
function createDesDiv(book) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('book-description');
    descriptionDiv.innerHTML = `<p>Synopsis:</p><p>${book.description}</p>`;
    return descriptionDiv;
}

// Reset / Refresh the page
function resetPage() {
    const searchInputElem = document.getElementById('searchInput');
    const searchButtonElem = document.getElementById('searchButton');
    const h1Elem = document.querySelector('h1');
    searchInputElem.style.display = 'block';
    searchButtonElem.style.display = 'block';

    // Clear containers / results
    const descriptionContainer = document.getElementById('descriptionContainer');
    descriptionContainer.innerHTML = '';

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    h1Elem.style.display = 'block';
}
