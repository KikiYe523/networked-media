const nunjucks = require("nunjucks");
const express = require("express");
const app = express();

app.use(express.static("public"));
// The form sends named fields, like gym and shoes. This middleware makes those
// values available as request.body, following the class 13/15 form setup.
app.use(express.urlencoded({ extended: true }));
nunjucks.configure("views", { autoescape: true, express: app });
app.set("view engine", "njk");

// array method temporary restarting the server
// clears the cards. Permanent storage still needs to be added.？
let allCards = [];

// Both gym dropdowns use this array, passed through response.render like class 15.
let gyms = ["Movement Harlem", "VITAL West Harlem", "VITAL Lower East Side", "Central Rock Gym Manhattan", "Central Rock Gym Chelsea", "VITAL Brooklyn", "Movement Gowanus", "Bouldering Project Gowanus", "MetroRock Bushwick", "GP81", "Brooklyn Uprising", "Movement LIC", "Brooklyn Boulders Queensbridge", "Other gym"];

app.get("/", (request, response) => {
    response.render("home.njk", { draft: {} });
});
app.get("/make-card", (request, response) => {
    response.redirect("/type");
});
app.get("/type", (request, response) => {
    response.render("quiz.njk", { draft: {} });
});
// The buttons send a destination as well as the answers. I use one route here
// because the steps all do the same thing: carry the draft and open a page.
// This does not save a private draft on the server; the hidden fields in each
// form carry it. A fresh visit to Home starts over.
app.post("/continue", (request, response) => {
    let draft = request.body;
    if (draft.destination === "wall") {
        response.render("home.njk", { draft: draft });
    } else if (draft.destination === "preview") {
        // Random choice, like class 8. I wanted the preview and published card
        // to keep the same background, so only pick if it does not have one yet.
        if (!draft.background) {
            draft.background = Math.floor(Math.random() * 5) + 1;
        }
        response.render("preview.njk", { draft: draft });
    } else if (draft.destination === "type") {
        response.render("quiz.njk", { draft: draft });
    } else {
        response.render("step.njk", { step: draft.destination, draft: draft, gyms: gyms });
    }
});
// Each answer gives one point to a type. I kept the name, description and
// score together so they are easier to match. If two types tie, let the
// visitor choose which feels more like them instead of picking one for them.
app.post("/quiz-result", (request, response) => {
    let draft = request.body;
    let answers = [draft.q1, draft.q2, draft.q3, draft.q4, draft.q5];
    // One pass through the answers, with a separate counter for each type.
    // Each recognized answer adds exactly one point. Unknown answers stay uncounted.
    let detective = 0;
    let retry = 0;
    let wanderer = 0;
    let cheerleader = 0;
    let answered = 0;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i] === "detective") {
            detective = detective + 1;
            answered = answered + 1;
        } else if (answers[i] === "retry") {
            retry = retry + 1;
            answered = answered + 1;
        } else if (answers[i] === "wanderer") {
            wanderer = wanderer + 1;
            answered = answered + 1;
        } else if (answers[i] === "cheerleader") {
            cheerleader = cheerleader + 1;
            answered = answered + 1;
        }
    }

    // Match those counters to the result text and pictures.
    let types = [
        { code: "detective", name: "The Beta Detective", score: detective,
          description: "You start climbing before you leave the ground. Every move is a little puzzle." },
        { code: "retry", name: "The One-More-Try", score: retry,
          description: "Each attempt teaches you something. Last try is a flexible term." },
        { code: "wanderer", name: "The Wanderer", score: wanderer,
          description: "You follow your curiosity. There is always another corner to explore." },
        { code: "cheerleader", name: "The Mat Cheerleader", score: cheerleader,
          description: "You share beta, celebrate small wins, and make room for others." }
    ];
    let highest = 0;
    let results = [];

    // A second simple loop finds the largest of the four totals.
    for (let i = 0; i < types.length; i++) {
        if (types[i].score > highest) {
            highest = types[i].score;
        }
    }

    // The radio inputs use required, but that is only a browser check.
    // check again here so missing or unknown answers do not produce a result.
    if (answered !== 5) {
        response.render("quiz.njk", {
            draft: draft,
            error: "Pick one answer for each question, or skip the quiz below."
        });
    } else {
        // find every result at the highest score, rather than stopping at the
        // first one. That is why the result page can offer a choice for a tie.
        for (let i = 0; i < types.length; i++) {
            if (types[i].score === highest) {
                results.push(types[i]);
            }
        }
        response.render("quiz.njk", { draft: draft, results: results, step: "type" });
    }
});
// Opening the wall or choosing Clear filter displays the full array.
app.get("/community", (request, response) => {
    response.render("community.njk", { cards: allCards, gyms: gyms, draft: {} });
});

// The filter is now a POST form, like the class 13/15 examples.read the gym
// from request.body, then collect matching cards without changing allCards.
app.post("/filter-cards", (request, response) => {
    let selectedGym = request.body.gym;
    let visibleCards = allCards;
    if (selectedGym) {
        visibleCards = [];
        for (let i = 0; i < allCards.length; i++) {
            if (allCards[i].gym === selectedGym) {
                visibleCards.push(allCards[i]);
            }
        }
    }
    response.render("community.njk", {
        cards: visibleCards,
        gyms: gyms,
        selectedGym: selectedGym,
        draft: {}
    });
});
// only this route adds a public card. The earlier steps just pass draft fields
// between forms; they do not add unfinished cards to the community wall.
app.post("/send-card", (request, response) => {
    // ick out the public card fields instead of saving the whole request.
    // Quiz answers and button destinations do not belong on the public wall.
    allCards.push({
        background: request.body.background,
        type: request.body.type,
        gym: request.body.gym,
        shoes: request.body.shoes,
        favorite: request.body.favorite,
        avoid: request.body.avoid,
        story: request.body.story
    });
    // After the POST, redirect to a normal GET page like the class 15 demo.
    // Refreshing that page will not submit the same card a second time.
    response.redirect("/community");
});
app.listen(8080, () => {
    console.log("http://localhost:8080");
});
