function searchBooks() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const resultsContainer = document.getElementById('results');
  const descriptionContainer = document.getElementById('descriptionContainer');
  
  resultsContainer.innerHTML = '';
  descriptionContainer.innerHTML = '';



  fetch(`https://openlibrary.org/subjects/${searchInput}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Category not found. Please check your spelling and try again.');
      }
      return response.json();
    })
    .then(data => {
      if (!data.works || data.works.length === 0) {
        throw new Error('No books found for the given category. Please check your spelling and try again.');
      }

      data.works.forEach(work => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        bookElement.textContent = `Title: ${work.title}, Authors: ${work.authors.map(author => `${author.name}`).join(', ')}`;
        bookElement.addEventListener('click', () => {
          getBookDescription(work.key);

          // Hide the search input and button
          searchInputElem.style.display = 'none';
          searchButtonElem.style.display = 'none';
        });
        resultsContainer.appendChild(bookElement);
      });
    })
    .catch(error => {
      console.error('Error:', error.message);
      resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}
//resets the page
function resetPage() {
  const searchInputElem = document.getElementById('searchInput');
  const searchButtonElem = document.getElementById('searchButton');
  searchInputElem.style.display = 'block';
  searchButtonElem.style.display = 'block';

  //  h1 element
  const h1Elem = document.querySelector('h1');
  h1Elem.style.display = 'block';

  // Clear description container
  const descriptionContainer = document.getElementById('descriptionContainer');
  descriptionContainer.innerHTML = '';

  // Clear results container
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';
}

//gets book description and appends div

function getBookDescription(bookKey) {
  const descriptionContainer = document.getElementById('descriptionContainer');
  const h1Elem = document.querySelector('h1');

  // Hide the h1 elem after loading descriptions
  h1Elem.style.display = 'none';

  fetch(`https://openlibrary.org${bookKey}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Book not found. Please check your spelling and try again.');
      }
      return response.json();
    })
    .then(book => {
      // div for the description
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
