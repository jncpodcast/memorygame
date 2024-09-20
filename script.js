const gameContainer = document.getElementById('game-container');
const nextLevelBtn = document.createElement('button');
nextLevelBtn.id = 'next-level-btn';
nextLevelBtn.textContent = 'Next Level';
gameContainer.appendChild(nextLevelBtn);

const scoreDisplay = document.createElement('div');
scoreDisplay.id = 'score-display';
gameContainer.appendChild(scoreDisplay);

const timerDisplay = document.createElement('div');
timerDisplay.id = 'timer-display';
gameContainer.appendChild(timerDisplay);

let level = 1;
let round = 1;
let score = 0;
let currentPoints = 50;
let startTime;
let timerInterval;

// First set of images (Round 1)
const imagesSet1 = [
    'https://static.wixstatic.com/media/7b5caa_8904a373cbd9406c87145c4a0e725c21~mv2.jpg',
    'https://static.wixstatic.com/media/7b5caa_c57f738ab47b49b392695f3e9728ab63~mv2.jpg',
    'https://static.wixstatic.com/media/7b5caa_9955653d86fb4184aeff6f003b2a4632~mv2.jpg',
    'https://static.wixstatic.com/media/7b5caa_9ac8503c4c4d42f9a04b1a486e4886c1~mv2.png',
    'https://static.wixstatic.com/media/7b5caa_1fa109c434e745efac65e219123383c4~mv2.jpg',
    'https://static.wixstatic.com/media/7b5caa_a2582dad199847329801192e0c99379b~mv2.jpg',
    'https://static.wixstatic.com/media/7b5caa_54635aa4aa70418baf51221f1aa7403a~mv2.png',
    'https://static.wixstatic.com/media/7b5caa_6475928c15d942c2b71ca017d0a29f43~mv2.png',
    'https://static.wixstatic.com/media/7b5caa_cd610a8301284cd19f3875deb5d2d67e~mv2.jpg',
    'https://static.wixstatic.com/media/7b5caa_3d2ea54a15b14873a76ad9bb26a36862~mv2.jpg'
];

// Second set of images (Round 2)
const imagesSet2 = [
    'https://static.wixstatic.com/media/7b5caa_a0def2b9ee2b48afaf4ccd8d28287bad~mv2.jpg',
    'https://static.wixstatic.com/media/7b5caa_64e41c380c954b2ca7bbb4c1931d3a29~mv2.jpg',
    'https://static.wixstatic.com/media/7b5caa_2bcb7061412e4ce38a2d40efd85b27f2~mv2.jpg',
    'https://static.wixstatic.com/media/7b5caa_7efd2c22ea9f48359a0e7c2d87c28e5e~mv2.jpg',
    'https://static.wixstatic.com/media/7b5caa_2ff620d18071487b8c1c6c78cfc1a048~mv2.jpg',
    'https://static.wixstatic.com/media/7b5caa_0e008b23b63044d5b0db5aa35fe600c8~mv2.jpg',
    'https://static.wixstatic.com/media/7b5caa_9ddf682cbfc64fc990e3448c6a914312~mv2.jpg',
    'https://static.wixstatic.com/media/7b5caa_2a388368040a467a8337ba1f390bb59e~mv2.jpg',
    'https://static.wixstatic.com/media/7b5caa_c9903c1b14e1413d894a7c594fda0892~mv2.jpg',
    'https://static.wixstatic.com/media/7b5caa_54866350fe8d45298a6a6bc57f9c1e1d~mv2.jpg'
];

// Combined set for Round 3 and beyond
const combinedImages = [...imagesSet1, ...imagesSet2];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;

function generateCards(level) {
    gameContainer.innerHTML = ''; // Clear container for new level
    gameContainer.appendChild(nextLevelBtn); // Keep next level button in container
    gameContainer.appendChild(scoreDisplay); // Keep score display in container
    gameContainer.appendChild(timerDisplay); // Keep timer display in container

    resetTimer();
    startTimer();

    // Determine image set based on round
    let currentImages;
    if (round === 1) {
        currentImages = imagesSet1;
    } else if (round === 2) {
        currentImages = imagesSet2;
    } else {
        currentImages = combinedImages;
    }

    // Calculate number of pairs based on the level
    const numPairs = Math.min(level + 2, currentImages.length);

    if (numPairs >= currentImages.length) {
        round++;
        level = 1; // Reset level for the new round
    }

    const selectedImages = currentImages.slice(0, numPairs);
    cards = [...selectedImages, ...selectedImages]; // Create pairs
    cards = shuffle(cards); // Shuffle the cards

    // Set grid size dynamically based on the number of cards
    gameContainer.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(cards.length))}, 1fr)`;

    cards.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('card', 'hidden');
        card.dataset.index = index;
        card.addEventListener('click', handleCardClick);

        // Create an img element and hide it initially
        const img = document.createElement('img');
        img.src = image;
        img.alt = 'Memory Image';
        img.style.display = 'none'; // Initially hidden
        card.appendChild(img);

        gameContainer.appendChild(card);
    });

    updateScore(); // Initialize score display
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function handleCardClick(e) {
    const clickedCard = e.target.closest('.card'); // Ensure we get the card element

    // Prevent clicking more than two cards or the same card twice
    if (flippedCards.length < 2 && !flippedCards.includes(clickedCard) && clickedCard.classList.contains('hidden')) {
        revealCard(clickedCard);
        flippedCards.push(clickedCard);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }
}

function revealCard(card) {
    card.classList.remove('hidden');
    card.querySelector('img').style.display = 'block'; // Show the image
}

function hideCard(card) {
    card.classList.add('hidden');
    card.querySelector('img').style.display = 'none'; // Hide the image
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.querySelector('img').src === card2.querySelector('img').src) {
        matchedPairs++;
        flippedCards = [];
        score += currentPoints; // Increase score based on current points
        updateScore();

        // Check if all pairs are matched
        if (matchedPairs === cards.length / 2) {
            nextLevelBtn.style.display = 'block';
            stopTimer();
        }
    } else {
        setTimeout(() => {
            hideCard(card1);
            hideCard(card2);
            flippedCards = [];
            // Decrease points for the next correct match
            currentPoints = Math.max(currentPoints - 5, 5); // Minimum points is 5
            updateScore();
        }, 1000);
    }
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `Time: ${elapsedTime}s`;
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerDisplay.textContent = 'Time: 0s';
}

function stopTimer() {
    clearInterval(timerInterval);
}

nextLevelBtn.addEventListener('click', () => {
    level++;
    matchedPairs = 0;
    currentPoints = 50; // Reset points for the new level
    nextLevelBtn.style.display = 'none';
    generateCards(level);
});

// Start the game
generateCards(level);