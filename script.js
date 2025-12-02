document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('#game-board');
    const startButton = document.getElementById('start-game');
    const playerNameDisplay = document.getElementById('player-name');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');

    let cardsChosen = [];
    let cardsChosenId = [];
    let cardsWon = [];

    let timer;
    let time = 0;
    let playerName = "";

    const cardArray = [
        { name: 'card1', img: 'images/joker.png' },
        { name: 'card1', img: 'images/joker.png' },
        { name: 'card2', img: 'images/batmanred.png' },
        { name: 'card2', img: 'images/batmanred.jpg' },
        { name: 'card3', img: 'images/bane.png' },
        { name: 'card3', img: 'images/bane.png' },
        { name: 'card4', img: 'images/catwoman.png' },
        { name: 'card4', img: 'images/catwoman.png' },
        { name: 'card5', img: 'images/bruce.png' },
        { name: 'card5', img: 'images/bruce.png' },
    ];

    function shuffle(array) {
        array.sort(() => 0.5 - Math.random());
    }

    function startTimer() {
        time = 0;
        timerDisplay.textContent = "Time: 0s";

        timer = setInterval(() => {
            time++;
            timerDisplay.textContent = `Time: ${time}s`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function createBoard() {

        playerName = prompt("Oyuncu Adını Gir:");
        if (!playerName) playerName = "Guest";

        playerNameDisplay.textContent = "Player: " + playerName;
        scoreDisplay.textContent = "Score: 0";
        timerDisplay.textContent = "Time: 0s";

        startTimer();

        shuffle(cardArray);
        grid.innerHTML = '';
        cardsWon = [];

        cardArray.forEach((cardData, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-id', index);

            card.innerHTML = `
                <div class="card-inner">
                    <img src="${cardData.img}" class="card-front">
                    <img src="images/batmanlogo.png" class="card-back">
                </div>
            `;

            card.addEventListener('click', flipCard);
            grid.appendChild(card);
        });
    }

    function flipCard() {
        const card = this;
        let cardId = card.getAttribute('data-id');

        if (!cardsChosenId.includes(cardId) && !card.classList.contains("flip")) {
            card.classList.add("flip");

            cardsChosen.push(cardArray[cardId].name);
            cardsChosenId.push(cardId);

            if (cardsChosen.length === 2) {
                setTimeout(checkForMatch, 700);
            }
        }
    }

    function checkForMatch() {

        const allCards = document.querySelectorAll('.card');
        const first = cardsChosenId[0];
        const second = cardsChosenId[1];

        if (cardsChosen[0] === cardsChosen[1] && first !== second) {

            allCards[first].style.visibility = "hidden";
            allCards[second].style.visibility = "hidden";
            cardsWon.push(cardsChosen);

            scoreDisplay.textContent = "Score: " + cardsWon.length;

        } else {

            allCards[first].classList.remove("flip");
            allCards[second].classList.remove("flip");
        }

        cardsChosen = [];
        cardsChosenId = [];

        if (cardsWon.length === cardArray.length / 2) {
            stopTimer();
            setTimeout(() => {
                alert(`${playerName} oyunu ${time} saniyede bitirdi!`);
            }, 300);
        }
    }

    startButton.addEventListener('click', createBoard);
});
