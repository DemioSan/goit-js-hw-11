import Notiflix from 'notiflix';
import axios from 'axios';

const API_KEY = '40069190-73f08e8403c307c87b63f7284';
const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let currentQuery = '';

async function fetchImages(query, pageNum) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: pageNum,
        per_page: 40,
      },
    });

    return response.data.hits;
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

function renderImages(images) {
  images.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('photo-card');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.classList.add('info');
    info.innerHTML = `
            <p class="info-item"><b>Likes:</b> ${image.likes}</p>
            <p class="info-item"><b>Views:</b> ${image.views}</p>
            <p class="info-item"><b>Comments:</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        `;

    card.appendChild(img);
    card.appendChild(info);
    gallery.appendChild(card);
  });
}

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  currentQuery = event.target.searchQuery.value;
  searchImages(currentQuery, page);
});

async function searchImages(query, pageNum) {
  const images = await fetchImages(query, pageNum);
  if (images.length > 0) {
    renderImages(images);
    loadMoreBtn.style.display = 'block';
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMoreBtn.style.display = 'none';
  }
}

loadMoreBtn.addEventListener('click', () => {
  page += 1;
  searchImages(currentQuery, page);
});
