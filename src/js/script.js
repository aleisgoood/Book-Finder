//  search/fetch books
function fetchBooks(searchInput) {
  return fetch(`https://openlibrary.org/subjects/${searchInput}.json`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Category not found. Please check your spelling and try again.');
          }
          return response.json();
      });
}

// render/fetch one book 
function renderBook(work, resultsContainer) {
  const bookElement = document.createElement('div');
  bookElement.classList.add('book');
  bookElement.textContent = `Title: ${work.title}, Authors: ${work.authors.map(author => `${author.name}`).join(', ')}`;
  bookElement.addEventListener('click', () => {
      getBookDescription(work.key);
  });
  resultsContainer.appendChild(bookElement);
}

function handleBookError(error, resultsContainer) {
  console.error('Error:', error.message); // error handling 
  resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
}

// render/fetch book(s)
function searchBooks() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const resultsContainer = document.getElementById('results');
  const descriptionContainer = document.getElementById('descriptionContainer');
  const h1Elem = document.querySelector('h1');
  const searchInputElem = document.getElementById('searchInput');
  const searchButtonElem = document.getElementById('searchButton');

  h1Elem.style.display = 'none';

  fetchBooks(searchInput)
      .then(data => {
          if (!data.works || data.works.length === 0) {
              throw new Error('No books found for the given category. Please try again.');
          }

          data.works.forEach(work => {
              renderBook(work, resultsContainer);
          });
      })
      .catch(error => {
          handleBookFetchError(error, resultsContainer);
      });

  // clear buttons / empty containers 
  searchInputElem.style.display = 'none';
  searchButtonElem.style.display = 'none';
  resultsContainer.innerHTML = '';
  descriptionContainer.innerHTML = '';
}

// displaying book description
function getBookDescription(bookKey) {
  const descriptionContainer = document.getElementById('descriptionContainer');
  const h1Elem = document.querySelector('h1');
  h1Elem.style.display = 'none'; //hide h1 after

  fetch(`https://openlibrary.org${bookKey}.json`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Book not found. Please check your spelling and try again.');
          }
          return response.json();
      })
      .then(book => {
          // and add divs
          const descriptionDiv = document.createElement('div');
          descriptionDiv.classList.add('book-description');
          descriptionDiv.innerHTML = `<p>Synopsis:</p><p>${book.description}</p>`;
          descriptionContainer.innerHTML = '';
          descriptionContainer.appendChild(descriptionDiv);
      })
      .catch(error => {
          console.error('Error:', error.message);
          descriptionContainer.innerHTML = `<p>Error: ${error.message}</p>`;
      });
}

// reset / refresh
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
