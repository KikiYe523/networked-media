const nunjucks = require("nunjucks");
const express = require("express");
const app = express();

app.use(express.static("public"));
// this reads the named form fields. without it, request.body won’t have the answers
app.use(express.urlencoded({ extended: true }));
// autoescape treats answers as text, not html. noCache lets saved njk edits show on refresh
nunjucks.configure("views", { autoescape: true, express: app, noCache: true });
app.set("view engine", "njk");
// this is only in memory — restarting node empties the wall
let allCards = [];
// one list for both dropdowns, so the spelling stays the same when filtering
let gyms = ["Movement Harlem", "VITAL West Harlem", "VITAL Lower East Side", "Central Rock Gym Manhattan", "Central Rock Gym Chelsea", "VITAL Brooklyn", "Movement Gowanus", "Bouldering Project Gowanus", "MetroRock Bushwick", "GP81", "Brooklyn Uprising", "Movement LIC", "Brooklyn Boulders Queensbridge", "Other gym"];

app.get("/", (request, response) => {
    response.render("home.njk", { draft: {} });
});
app.get("/about", (request, response) => {
    response.render("about.njk");
});
// this link starts a fresh quiz; the hold buttons below carry an existing draft instead
app.get("/make-card", (request, response) => {
    response.redirect("/type");
});
app.get("/type", (request, response) => {
    response.render("quiz.njk", { draft: {} });
});
// destination is the clicked button’s value. the hidden inputs bring the other answers along
// going back with this form keeps the draft; a normal home link starts over
app.post("/continue", (request, response) => {
    let draft = request.body;
    // maxlength is a browser limit. check here too and return the whole draft if it’s too long
    if (draft.story && (typeof draft.story !== "string" || draft.story.length > 180)) {
        return response.render("step.njk", {
            step: "story", draft: draft, gyms: gyms,
            error: "Please keep your story to 180 characters or fewer."
        });
    }
    if (draft.destination === "wall") {
        response.render("home.njk", { draft: draft });
    } else if (draft.destination === "preview") {
        // only roll once, otherwise editing would change the background every time
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
// these counters belong inside the route, so each quiz starts from zero
app.post("/quiz-result", (request, response) => {
    let draft = request.body;
    let answers = [draft.q1, draft.q2, draft.q3, draft.q4, draft.q5];
    let detective = 0;
    let retry = 0;
    let wanderer = 0;
    let cheerleader = 0;
    // for...of reads one answer at a time. missing or unknown values add no points
    for (let answer of answers) {
        if (answer === "detective") {
            detective++;
        } else if (answer === "retry") {
            retry++;
        } else if (answer === "wanderer") {
            wanderer++;
        } else if (answer === "cheerleader") {
            cheerleader++;
        }
    }
    // five valid choices should add up to five. required alone can be bypassed
    let answered = detective + retry + wanderer + cheerleader;
    if (answered !== 5) {
        response.render("quiz.njk", {
            draft: draft,
            error: "Pick one answer for each question, or skip the quiz below."
        });
    } else {
        // keep the biggest number seen so far, then collect every type that matches it
        let highest = detective;
        if (retry > highest) highest = retry;
        if (wanderer > highest) highest = wanderer;
        if (cheerleader > highest) highest = cheerleader;
        // separate ifs matter here — else if would hide the other winner in a tie
        let results = [];
        if (detective === highest) {
            results.push({
                code: "detective",
                name: "The Beta Detective",
                description: "You start climbing before you leave the ground. Every move is a little puzzle."
            });
        }
        if (retry === highest) {
            results.push({
                code: "retry",
                name: "The One-More-Try",
                description: "Each attempt teaches you something. Last try is a flexible term."
            });
        }
        if (wanderer === highest) {
            results.push({
                code: "wanderer",
                name: "The Wanderer",
                description: "You follow your curiosity. There is always another corner to explore."
            });
        }
        if (cheerleader === highest) {
            results.push({
                code: "cheerleader",
                name: "The Mat Cheerleader",
                description: "You share beta, celebrate small wins, and make room for others."
            });
        }
        response.render("quiz.njk", { draft: draft, results: results, step: "type" });
    }
});
// clear filter comes here too, so this shows the complete array again
app.get("/community", (request, response) => {
    response.render("community.njk", { cards: allCards, gyms: gyms, draft: {} });
});
// build a smaller display list, don’t remove anyone from allCards
app.post("/filter-cards", (request, response) => {
    let selectedGym = request.body.gym;
    let visibleCards = allCards;
    if (selectedGym) {
        visibleCards = [];
        for (let card of allCards) {
            if (card.gym === selectedGym) {
                visibleCards.push(card);
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
// preview only displays a draft. this is the one place that saves a public card
app.post("/send-card", (request, response) => {
    // check again because someone could post here without opening preview. blank is still ok
    if (request.body.story && (typeof request.body.story !== "string" || request.body.story.length > 180)) {
        return response.render("step.njk", {
            step: "story", draft: request.body, gyms: gyms,
            error: "Please keep your story to 180 characters or fewer."
        });
    }
    // save just the card fields, not quiz answers or the button destination
    allCards.push({
        background: request.body.background,
        type: request.body.type,
        gym: request.body.gym,
        gymFeel: request.body.gymFeel,
        style: request.body.style,
        shoes: request.body.shoes,
        favorite: request.body.favorite,
        avoid: request.body.avoid,
        story: request.body.story
    });
    // redirect to a GET page so refreshing doesn’t repeat this POST
    response.redirect("/community");
});
app.listen(8080, () => {
    console.log("http://localhost:8080");
});
