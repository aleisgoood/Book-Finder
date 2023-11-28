function searchBooks() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const resultsContainer = document.getElementById('results');
    const descriptionContainer = document.getElementById('descriptionContainer');
    const h1Element = document.querySelector('h1'); // Select the h1 element

    resultsContainer.innerHTML = '';
    descriptionContainer.innerHTML = '';

    function searchBooks() {
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
                bookElement.textContent = `Title: ${work.title}, Authors: ${work.authors.map(author => `${author.name}`).join(', ')}`;
                bookElement.addEventListener('click', () => {
                    getBookDescription(work.key);
                    
                });
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
  const h1Element = document.querySelector('h1'); // Select the h1 element

  // Hide the h1 element when the description is displayed
  h1Element.style.display = 'none';

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

          // Clear the description container before appending a new one
          descriptionContainer.innerHTML = '';

          // Append the description div to the descriptionContainer
          descriptionContainer.appendChild(descriptionDiv);
          
      })
      .catch(error => {
          console.error('Error:', error.message);
          descriptionContainer.innerHTML = `<p>Error: ${error.message}</p>`;
      });
}
