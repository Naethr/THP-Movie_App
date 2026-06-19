# Movie Finder

Static front-end project built with HTML, CSS, and vanilla JavaScript using the OMDb API.

## API Key

The `.env` file is only used to avoid pushing your OMDb API key to GitHub. The browser does not read `.env` directly.

To run the project locally:

1. Open `.env` and replace `COLLE_TA_CLE_API_ICI` with your real OMDb API key.
2. Open `config.js` and copy the same value into:

```js
window.OMDB_API_KEY = "COLLE_TA_CLE_API_ICI";
```

The `.env` and `config.js` files are ignored by Git to avoid pushing the API key to GitHub.

## Run

Open `index.html` directly in your browser.

If your browser blocks some local requests, use an extension such as Live Server. No backend, npm dependency, or build step is required.

## Deployment

The project can be deployed to GitHub Pages or an equivalent static hosting service.

Because `config.js` is ignored by Git, for a GitHub Pages deployment you must either temporarily add the key to `config.js` before deploying if the repository is private or if exposing the key is acceptable, or create the `config.js` file directly in the deployment environment if possible.

This project does not hide the key on the browser side. It remains visible in the front end and in network requests.
