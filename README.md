# Movie Finder

Projet front-end statique en HTML, CSS et JavaScript vanilla utilisant l'API OMDb.

## Cle API

Le fichier `.env` sert uniquement a eviter de pousser ta cle OMDb sur GitHub. Le navigateur ne lit pas directement `.env`.

Pour lancer le projet localement :

1. Ouvre `.env` et remplace `COLLE_TA_CLE_API_ICI` par ta vraie cle OMDb.
2. Ouvre `config.js` et copie la meme valeur dans :

```js
window.OMDB_API_KEY = "COLLE_TA_CLE_API_ICI";
```

Les fichiers `.env` et `config.js` sont ignores par Git pour eviter de pousser la cle sur GitHub.

## Lancement

Ouvre directement `index.html` dans ton navigateur.

Si ton navigateur bloque certaines requetes locales, utilise une extension comme Live Server. Aucun backend, aucune dependance npm et aucun build step ne sont necessaires.

## Deploiement

Le projet peut etre mis en ligne sur GitHub Pages ou equivalent.

Comme `config.js` est ignore par Git, pour un deploiement GitHub Pages il faut soit renseigner temporairement la cle dans `config.js` avant de deployer si le depot est prive ou si l'exposition de la cle est acceptee, soit creer `config.js` directement dans l'environnement de deploiement si possible.

Ce projet ne cache pas la cle cote navigateur. Elle reste visible dans le front et dans les requetes reseau.
