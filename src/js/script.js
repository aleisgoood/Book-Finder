// Fetch books 
function fetchBooks(searchInput) {
    const apiUrl = `https://openlibrary.org/subjects/${searchInput}.json`;

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Category not found. Please check your spelling and try again.');
            }
            return response.json();
        });
}

// Create one book element
function createBookElem(work, onClickHandler) {
    const bookElem = document.createElement('div');
    bookElem.classList.add('book');
    bookElem.textContent = `Title: ${work.title}, Authors: ${work.authors.map(author => `${author.name}`).join(', ')}`;
    bookElem.addEventListener('click', onClickHandler);
    return bookElem;
}
function ErrorMessage(error, container) {
    console.error('Error:', error.message);
    container.innerHTML = `<p>Error: ${error.message}</p>`;
}

// Display books 
function displayBooks(works, resultsContainer) {
    works.forEach(work => {
        const bookElem = createBookElem(work, () => BookDescription(work.key));
        resultsContainer.appendChild(bookElem);
    });
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

            displayBooks(data.works, resultsContainer);
        })
        .catch(error => {
            ErrorMessage(error, resultsContainer);
        });

    // Clear buttons / empty containers 
    searchInputElem.style.display = 'none';
    searchButtonElem.style.display = 'none';
    resultsContainer.innerHTML = '';
    descriptionContainer.innerHTML = '';
}

// book descriptions / display them
function BookDescription(bookKey) {
    const descriptionContainer = document.getElementById('descriptionContainer');
    const h1Elem = document.querySelector('h1');
    h1Elem.style.display = 'none';

    const apiUrl = `https://openlibrary.org${bookKey}.json`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Book not found. Please check your spelling and try again.');
            }
            return response.json();
        })
        .then(book => {
            const descriptionDiv = createDiv(book);
            descriptionContainer.innerHTML = '';
            descriptionContainer.appendChild(descriptionDiv);
        })
        .catch(error => {
            ErrorMessage(error, descriptionContainer);
        });
}

// Create description div
function createDiv(book) {
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
