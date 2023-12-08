// Fetch books
function fetchBooks(searchInput) {
    return fetch(`https://openlibrary.org/subjects/${searchInput}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Category not found. Please check your spelling and try again.');
            }
            return response.json();
        });
}

// Render one book
function renderBook(work) {
    const bookElement = document.createElement('div');
    bookElement.classList.add('book');
    bookElement.textContent = `Title: ${work.title}, Authors: ${work.authors.map(author => `${author.name}`).join(', ')}`;
    bookElement.addEventListener('click', () => {
        getBookDescription(work.key);
    });
    return bookElement;
}

function handleBookFetchError(error, resultsContainer) {
    console.error('Error:', error.message);
    resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
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

    fetchBooks(searchInput)
        .then(data => {
            if (!data.works || data.works.length === 0) {
                throw new Error('No books found for the given category. Please try again.');
            }

            data.works.forEach(work => {
                const bookElement = renderBook(work);
                resultsContainer.appendChild(bookElement);
            });
        })
        .catch(error => {
            handleBookFetchError(error, resultsContainer);
        });

    // Clear buttons / empty containers 
    searchInputElem.style.display = 'none';
    searchButtonElem.style.display = 'none';
    resultsContainer.innerHTML = '';
    descriptionContainer.innerHTML = '';
}

// Displaying description
function getBookDescription(bookKey) {
    const descriptionContainer = document.getElementById('descriptionContainer');
    const h1Elem = document.querySelector('h1');
    h1Elem.style.display = 'none';

    fetch(`https://openlibrary.org${bookKey}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Book not found. Please check your spelling and try again.');
            }
            return response.json();
        })
        .then(book => {
            const descriptionDiv = createDescriptionDiv(book);
            descriptionContainer.innerHTML = '';
            descriptionContainer.appendChild(descriptionDiv);
        })
        .catch(error => {
            handleBookFetchError(error, descriptionContainer);
        });
}

// Creating description div
function createDescriptionDiv(book) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('book-description');
    descriptionDiv.innerHTML = `<p>Synopsis:</p><p>${book.description}</p>`;
    return descriptionDiv;
}

// Reset / Refresh
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
