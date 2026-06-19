const API_BASE_URL = "https://www.omdbapi.com/";
const API_KEY_PLACEHOLDER = "COLLE_TA_CLE_API_ICI";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const statusMessage = document.querySelector("#status-message");
const resultsGrid = document.querySelector("#results-grid");
const movieModalElement = document.querySelector("#movie-modal");
const movieModalTitle = document.querySelector("#movie-modal-title");
const movieModalBody = document.querySelector("#movie-modal-body");

let movieObserver = null;
let bootstrapMovieModal = null;

function getApiKey() {
  return typeof window.OMDB_API_KEY === "string" ? window.OMDB_API_KEY.trim() : "";
}

function hasValidApiKey() {
  const apiKey = getApiKey();
  return apiKey !== "" && apiKey !== API_KEY_PLACEHOLDER;
}

function setStatus(message, type = "info") {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", type === "error");
}

function buildApiUrl(params) {
  const url = new URL(API_BASE_URL);
  url.search = new URLSearchParams({
    apikey: getApiKey(),
    ...params,
  }).toString();
  return url;
}

async function searchMovies(query) {
  const response = await fetch(buildApiUrl({ s: query }));

  if (!response.ok) {
    throw new Error("The OMDb request failed.");
  }

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "No result found.");
  }

  return data.Search || [];
}

async function getMovieDetails(imdbID) {
  const response = await fetch(buildApiUrl({ i: imdbID, plot: "full" }));

  if (!response.ok) {
    throw new Error("The OMDb detail request failed.");
  }

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "Movie details are unavailable.");
  }

  return data;
}

function createPosterMarkup(movie, className = "") {
  if (movie.Poster && movie.Poster !== "N/A") {
    return `<img src="${movie.Poster}" alt="Poster for ${escapeHtml(movie.Title)}" class="${className}" />`;
  }

  return `<div class="poster-fallback ${className}">Poster not available</div>`;
}

function renderResults(movies) {
  resultsGrid.innerHTML = "";

  const cardsMarkup = movies
    .map((movie) => {
      return `
        <article class="movie-card">
          <div class="poster-wrap">
            ${createPosterMarkup(movie)}
          </div>
          <div class="card-body">
            <h2 class="movie-title">${escapeHtml(movie.Title)}</h2>
            <p class="movie-year">${escapeHtml(movie.Year || "Unknown year")}</p>
            <button class="btn btn-primary read-more-button" type="button" data-imdb-id="${escapeHtml(movie.imdbID)}">
              Read more
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  resultsGrid.insertAdjacentHTML("beforeend", cardsMarkup);
  resultsGrid.querySelectorAll(".read-more-button").forEach((button) => {
    button.addEventListener("click", handleReadMoreClick);
  });

  initializeMovieObserver();
}

function initializeMovieObserver() {
  if (movieObserver) {
    movieObserver.disconnect();
  }

  movieObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  document.querySelectorAll(".movie-card").forEach((card) => {
    movieObserver.observe(card);
  });
}

function renderMovieModal(movie) {
  movieModalTitle.textContent = movie.Title || "Movie details";
  movieModalBody.innerHTML = `
    <div class="modal-layout">
      <div class="modal-poster">
        ${createPosterMarkup(movie)}
      </div>
      <div>
        <p class="plot">${escapeHtml(movie.Plot && movie.Plot !== "N/A" ? movie.Plot : "No plot available.")}</p>
        <div class="details-list">
          ${createDetailRow("Year", movie.Year)}
          ${createDetailRow("Genre", movie.Genre)}
          ${createDetailRow("Director", movie.Director)}
          ${createDetailRow("Actors", movie.Actors)}
          ${createDetailRow("IMDb rating", movie.imdbRating)}
        </div>
      </div>
    </div>
  `;

  bootstrapMovieModal.show();
}

function createDetailRow(label, value) {
  if (!value || value === "N/A") {
    return "";
  }

  return `
    <div class="detail-row">
      <span class="detail-label">${escapeHtml(label)}</span>
      <span class="detail-value">${escapeHtml(value)}</span>
    </div>
  `;
}

async function handleSearchSubmit(event) {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (!hasValidApiKey()) {
    setStatus("Add your OMDb API key in config.js before searching.", "error");
    resultsGrid.innerHTML = "";
    return;
  }

  if (!query) {
    setStatus("Please enter a movie or series title.", "error");
    resultsGrid.innerHTML = "";
    return;
  }

  setStatus("Loading results...");
  resultsGrid.innerHTML = "";

  try {
    const movies = await searchMovies(query);

    if (movies.length === 0) {
      setStatus("No result found.");
      return;
    }

    setStatus(`${movies.length} result${movies.length > 1 ? "s" : ""} found.`);
    renderResults(movies);
  } catch (error) {
    setStatus(error.message, "error");
  }
}

async function handleReadMoreClick(event) {
  const imdbID = event.currentTarget.dataset.imdbId;

  if (!hasValidApiKey()) {
    setStatus("Add your OMDb API key in config.js before opening movie details.", "error");
    return;
  }

  movieModalTitle.textContent = "Loading...";
  movieModalBody.innerHTML = `<p class="mb-0">Loading movie details...</p>`;
  bootstrapMovieModal.show();

  try {
    const movie = await getMovieDetails(imdbID);
    renderMovieModal(movie);
  } catch (error) {
    movieModalTitle.textContent = "Details unavailable";
    movieModalBody.innerHTML = `<p class="mb-0 text-danger">${escapeHtml(error.message)}</p>`;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initializeApp() {
  bootstrapMovieModal = new bootstrap.Modal(movieModalElement);
  searchForm.addEventListener("submit", handleSearchSubmit);

  if (!hasValidApiKey()) {
    setStatus("OMDb API key is missing. Replace COLLE_TA_CLE_API_ICI in config.js before searching.", "error");
  }
}

initializeApp();
