import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '40069190-73f08e8403c307c87b63f7284';
const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery-item');
const loader = document.querySelector('.loader');

let page = 1;
let currentQuery = '';

loadMoreBtn.style.display = 'none';
loader.style.display = 'none';

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

    const imgLink = document.createElement('a');
    imgLink.classList.add('gallery-item');
    imgLink.href = image.largeImageURL;

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.classList.add('info');

    info.innerHTML = `
      <p class="info-item"><b>Likes:</b> <span class="info-value">${image.likes}</span></p>
      <p class="info-item"><b>Views:</b> <span class="info-value">${image.views}</span></p>
      <p class="info-item"><b>Comments:</b> <span class="info-value">${image.comments}</span></p>
      <p class="info-item"><b>Downloads:</b> <span class="info-value">${image.downloads}</span></p>
    `;

    imgLink.appendChild(img);
    card.appendChild(imgLink);
    card.appendChild(info);
    gallery.appendChild(card);
  });

  lightbox.refresh();
}

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const searchInput = event.target.searchQuery;
  const query = searchInput.value.trim();

  if (query) {
    gallery.innerHTML = '';
    page = 1;
    currentQuery = query;

    showLoader();

    searchImages(currentQuery, page);
  } else {
    Notiflix.Notify.failure('Please enter a search query.');
  }
});

async function searchImages(query, pageNum) {
  const images = await fetchImages(query, pageNum);
  if (images.length > 0) {
    renderImages(images);
    loadMoreBtn.style.display = 'block';

    Notiflix.Notify.success('Search results successfully loaded.');

    hideLoader();
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    hideLoader();
    loadMoreBtn.style.display = 'none';
  }
}

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}
