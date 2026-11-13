// project 4 builds on the class-18-demo Mastodon bot.
require('dotenv').config();

const { createRestAPIClient } = require('masto');

const partnerUrl = 'http://68.183.126.104:6003/get-data';
const mastodonUrl = 'https://networked-media.itp.io/';
const postInterval = 4 * 60 * 60 * 1000;
const classmates = [
    "Caitlyn", "Elena", "Anna", "Jennifer", "Mike", "Tommy", "Lisa",
    "Yatong", "Lam", "Ali", "Wing", "May", "Weixuan", "Anita"
];

// profile bio: "Bot sleeps midnight–8 a.m. ET."
const newYorkHour = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    hourCycle: 'h23',
});

function isSleeping() {
    return Number(newYorkHour.format(new Date())) < 8;
}

function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
}

async function makePost() {
    const response = await fetch(partnerUrl, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) {
        throw new Error(`Partner API returned HTTP ${response.status}`);
    }

    const records = await response.json();
    if (!Array.isArray(records)) {
        throw new Error('Expected a list of animals from the partner API.');
    }

    const animals = records.filter(animal =>
        typeof animal?.name === 'string' && animal.name.trim() &&
        typeof animal?.text === 'string' && animal.text.trim()
    );
    if (animals.length === 0) {
        throw new Error('The partner API returned no animals with a name and description.');
    }

    const animal = pickRandom(animals);
    const classmate = pickRandom(classmates);
    return `${classmate}, your lab partner today is ${animal.name.trim()}.\n\n${animal.text.trim()}`;
}

async function main() {
    // Preview a post in Terminal without contacting Mastodon.
    if (process.argv.includes('--preview')) {
        console.log(await makePost());
        return;
    }

    const accessToken = process.env.TOKEN?.trim();
    if (!accessToken) {
        throw new Error('Add your Mastodon access token as TOKEN in the project4 .env file.');
    }
    const masto = createRestAPIClient({ url: mastodonUrl, accessToken });

    async function post() {
        if (isSleeping()) return;

        const status = await makePost();
        // The API request might have started just before midnight.
        if (isSleeping()) return;

        await masto.v1.statuses.create({ status, visibility: 'public' });
        console.log('Posted to Mastodon.');
    }

    setInterval(() => {
        post().catch(error => console.error('Could not post:', error.message));
    }, postInterval);
    console.log('Bot started. Checks every 4 hours and sleeps midnight–8 a.m. ET.');
}

main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});
