# Nice to “Climb” You — NYC — Project 3

A small NYC climbing community site. Visitors answer a five-question personality quiz, add climbing preferences and an optional home gym, preview a card, and choose whether to publish it. The Community Wall can show all cards or only cards from one gym.

## Run

In project3, run `npm install`, then `npm start`. Open http://localhost:8081.

## Files

- `server.js`: page routes, quiz scoring, gym filtering, and card submissions.
- `views/`: Nunjucks pages and shared card content, draft fields, and gym options. Head settings and navigation are written directly in the pages.
- `public/style.css`: all styling. No inline CSS.
- `public/fonts/`: Bonices for the main titles and Grafipaint for body text, supplied for the project.
- `public/images/`: the supplied map illustration, used only as a scrolling background.

## Class methods

The structure follows classes 12–15: Express, form submissions, Nunjucks, includes, loops, and a server array. The hold wall uses class 10 positioning. Quiz scoring uses four explicit counters and a single loop through the answers. Hidden inputs carry unfinished card details between pages. The gym filter uses a POST form and request.body.gym. The gym array is declared in server.js and passed to the templates through response.render.

## Current limits

Cards live in an array and disappear when the server restarts. The quiz is a playful description, not a validated personality assessment. Options have different fixed orders; refreshing does not reshuffle them. Use the step buttons to retain draft details; Make a Card starts a new route.

Photo uploads, card flipping, image download, persistent storage, moderation, and removal are not connected yet. There is no interactive map or gym-detail page. No accounts are required, but identifying details should still be left out of public submissions.
