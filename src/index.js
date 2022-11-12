import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
const gallery = document.querySelector('.gallery');
const inputBox = document.querySelector('.search-form input');
const searchForm = document.querySelector('.search-form');
const searchBtn = document.querySelector('.search-form button');
const loadMoreBtn = document.querySelector('.load-more');

const API_URL =
  'https://pixabay.com/api/?key=31180890-6e7b1107714fce14b72fdcb4e';
let searchedWord = '';
pageNumber = 1;
loadMoreBtn.style.display = "none";

const fetchImages = async function(searchedWord, pageNumber) {
  const response = await fetch(
    `${API_URL}&q=${searchedWord}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageNumber}`
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const fetchedImages = await response.json();
  return fetchedImages;
  
};


searchBtn.addEventListener('click', (event) => {
  event.preventDefault();
gallery.innerHTML = "";
searchedWord = inputBox.value;
pageNumber = 1;
  fetchImages(searchedWord, pageNumber).then((fetchedImages) => {

  
  if(fetchedImages.hits.length === 0) {
    gallery.innerHTML = "";
    loadMoreBtn.style.display = "none";
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    return
  }
  if(fetchedImages.total > 0) {
    Notiflix.Notify.success(`"Hooray! We found ${fetchedImages.total} images."`)}

   let galleryMarkup = [];
   fetchedImages.hits.map((fetchedImage) => {
    galleryMarkup += `<div class="photo-card"><a href="${fetchedImage.largeImageURL}" class="image-link"><img class="image" src="${fetchedImage.webformatURL}" alt="${fetchedImage.tags}" data-large-url="${fetchedImage.largeImageURL}" loading="lazy"/>
                </a><div class="info">
                  <p class="info-item">
                    <b>Likes</b>
                    ${fetchedImage.likes}
                  </p>
                  <p class="info-item">
                    <b>Views</b>
                    ${fetchedImage.views}
                  </p>
                  <p class="info-item">
                    <b>Comments</b>
                    ${fetchedImage.comments}
                  </p>
                  <p class="info-item">
                    <b>Downloads</b>
                    ${fetchedImage.downloads}
                  </p>
                </div>
                </div>`
      }).join("");
      gallery.insertAdjacentHTML("beforeend", galleryMarkup);
      showSimpleLightbox();

    if(fetchedImages.total > 40) {
      loadMoreBtn.style.display = 'block';}
  });
});



loadMoreBtn.addEventListener('click', () => {
  pageNumber += 1;

  fetchImages(searchedWord, pageNumber).then((fetchedImages) => {
    console.log(fetchedImages)

let numberOfPages = Math.ceil(fetchedImages.total / 40);
console.log(numberOfPages)

    if(pageNumber == numberOfPages) {
      loadMoreBtn.style.display = "none";
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
      
    }
  
   let nextImages = [];
   fetchedImages.hits.map((fetchedImage) => {
    nextImages += `<div class="photo-card"><a href="${fetchedImage.largeImageURL}" class="image-link"><img class="image" src="${fetchedImage.webformatURL}" alt="${fetchedImage.tags}" data-large-url="${fetchedImage.largeImageURL}" loading="lazy"/>
                </a><div class="info">
                  <p class="info-item">
                    <b>Likes</b>
                    ${fetchedImage.likes}
                  </p>
                  <p class="info-item">
                    <b>Views</b>
                    ${fetchedImage.views}
                  </p>
                  <p class="info-item">
                    <b>Comments</b>
                    ${fetchedImage.comments}
                  </p>
                  <p class="info-item">
                    <b>Downloads</b>
                    ${fetchedImage.downloads}
                  </p>
                </div>
                </div>`
      }).join("");
      
      gallery.insertAdjacentHTML("beforeend", nextImages);
  });
});





function showSimpleLightbox() {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
    captionsData: 'alt',
  });
  lightbox.on('show.simplelightbox');
  lightbox.refresh();
}
