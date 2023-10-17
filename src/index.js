import Notiflix from 'notiflix';
import { fetchImages } from './api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery-item');
const loader = document.querySelector('.loader');

let page = 1;
let currentQuery = '';

loadMoreBtn.style.display = 'none';
loader.style.display = 'none';

function renderImages(images) {
  const galleryHTML = images
    .map(
      image => `
      <div class="photo-card">
        <a class="gallery-item" href="${image.largeImageURL}">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
        </a>
        <div class="info">
          <p class="info-item"><b>Likes:</b> <span class="info-value">${image.likes}</span></p>
          <p class="info-item"><b>Views:</b> <span class="info-value">${image.views}</span></p>
          <p class="info-item"><b>Comments:</b> <span class="info-value">${image.comments}</span></p>
          <p class="info-item"><b>Downloads:</b> <span class="info-value">${image.downloads}</span></p>
        </div>
      </div>`
    )
    .join('');

  gallery.innerHTML = galleryHTML;
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

function loadMoreImages() {
  page += 1;
  searchImages(currentQuery, page);
}

loadMoreBtn.addEventListener('click', loadMoreImages);
