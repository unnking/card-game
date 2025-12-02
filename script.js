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

        for (let i = 0; i < cardArray.length; i++) {
            const card = document.createElement('img');
            card.setAttribute('src', 'images/batmanlogo.png');
            card.setAttribute('data-id', i);
            card.style.width = "120px";   // foto boyutları eşitleme
            card.style.height = "120px";
            card.addEventListener('click', flipCard);
            grid.appendChild(card);
        }
    }

    function flipCard() {
        let cardId = this.getAttribute('data-id');

        if (!cardsChosenId.includes(cardId)) {
            cardsChosen.push(cardArray[cardId].name);
            cardsChosenId.push(cardId);
            this.setAttribute('src', cardArray[cardId].img);

            if (cardsChosen.length === 2) {
                setTimeout(checkForMatch, 500);
            }
        }
    }

    function checkForMatch() {
        const cards = document.querySelectorAll('#game-board img');
        const firstCardId = cardsChosenId[0];
        const secondCardId = cardsChosenId[1];

        if (cardsChosen[0] === cardsChosen[1] && firstCardId !== secondCardId) {
            cards[firstCardId].style.visibility = 'hidden';
            cards[secondCardId].style.visibility = 'hidden';

            cardsWon.push(cardsChosen);
            scoreDisplay.textContent = "Score: " + cardsWon.length;

        } else {
            cards[firstCardId].setAttribute('src', 'images/batmanlogo.png');
            cards[secondCardId].setAttribute('src', 'images/batmanlogo.png');
        }

        cardsChosen = [];
        cardsChosenId = [];

        if (cardsWon.length === cardArray.length / 2) {
            stopTimer();
            setTimeout(() => {
                alert(`${playerName}, tebrikler! Oyunu bitirdin.\nSüre: ${time} saniye`);
            }, 300);
        }
    }

    startButton.addEventListener('click', createBoard);
});
