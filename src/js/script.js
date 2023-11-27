function searchBooks() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const resultsContainer = document.getElementById('results');
  const descriptionContainer = document.getElementById('descriptionContainer');
  resultsContainer.innerHTML = '';
  descriptionContainer.innerHTML = '';

  
  


  function searchBooks() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const resultsContainer = document.getElementById('results');
    const descriptionContainer = document.getElementById('descriptionContainer');
    resultsContainer.innerHTML = '';
    descriptionContainer.innerHTML = '';

    if (!validGenres.includes(searchInput)) {
      resultsContainer.innerHTML = '<p>Error: Please enter a valid genre.</p>';
      return;
    }
  }
  
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
        bookElement.textContent = `Title: ${work.title}, Authors: ${work.authors.map(author => `<strong>${author.name}</strong>`).join(', ')}`;
        bookElement.addEventListener('click', () => getBookDescription(work.key));
        resultsContainer.appendChild(bookElement);
      });
    })
    .catch(error => {
      console.error('Error:', error.message);
      resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

function getBookDescription(bookKey) {
  const descriptionContainer = document.getElementById('descriptionContainer');

  fetch(`https://openlibrary.org${bookKey}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Book not found. Please check your spelling.');
      }
      return response.json();
    })
    .then(book => {
      descriptionContainer.innerHTML = `<p>Description:</p><p>${book.description}</p>`;
    })
    .catch(error => {
      console.error('Error:', error.message);
      descriptionContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}