document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector("#game-board");
    const startButton = document.getElementById("start-game");
    const playerNameDisplay = document.getElementById("player-name");
    const scoreDisplay = document.getElementById("score");
    const timerDisplay = document.getElementById("timer");

    let cardsChosen = [];
    let cardsChosenId = [];
    let cardsWon = [];

    let timer;
    let time = 0;
    let playerName = "";

    const cardArray = [
        { name: "card1", img: "images/joker.png" },
        { name: "card1", img: "images/joker.png" },
        { name: "card2", img: "images/batmanred.png" },
        { name: "card2", img: "images/batmanred.png" },
        { name: "card3", img: "images/bane.png" },
        { name: "card3", img: "images/bane.png" },
        { name: "card4", img: "images/catwoman.png" },
        { name: "card4", img: "images/catwoman.png" },
        { name: "card5", img: "images/bruce.png" },
        { name: "card5", img: "images/bruce.png" },
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

        shuffle(cardArray);
        grid.innerHTML = "";
        cardsWon = [];
        cardsChosen = [];
        cardsChosenId = [];

        startTimer();

        cardArray.forEach((card, i) => {
            const cardContainer = document.createElement("div");
            cardContainer.classList.add("card");
            cardContainer.setAttribute("data-id", i);

            cardContainer.innerHTML = `
                <div class="card-inner">
                    <img src="images/batmanlogo.png" class="card-back">
                    <img src="${card.img}" class="card-front">
                </div>
            `;

            cardContainer.addEventListener("click", flipCard);
            grid.appendChild(cardContainer);
        });
    }

    let lockBoard = false;

    function flipCard() {
        if (lockBoard) return;

        const card = this;
        const cardId = card.getAttribute("data-id");

        // aynı karta iki kere tıklama engeli
        if (cardsChosenId.includes(cardId)) return;

        card.classList.add("flip");

        cardsChosen.push(cardArray[cardId].name);
        cardsChosenId.push(cardId);

        // iki kart seçildiyse kontrol et
        if (cardsChosen.length === 2) {
            lockBoard = true;
            setTimeout(checkForMatch, 700);
        }
    }

    function checkForMatch() {
        const allCards = document.querySelectorAll(".card");
        const [id1, id2] = cardsChosenId;

        if (cardsChosen[0] === cardsChosen[1] && id1 !== id2) {
            allCards[id1].style.visibility = "hidden";
            allCards[id2].style.visibility = "hidden";

            cardsWon.push(cardsChosen);
            scoreDisplay.textContent = "Score: " + cardsWon.length;
        } else {
            allCards[id1].classList.remove("flip");
            allCards[id2].classList.remove("flip");
        }

        cardsChosen = [];
        cardsChosenId = [];
        lockBoard = false;

        if (cardsWon.length === cardArray.length / 2) {
            stopTimer();
            setTimeout(() => {
                alert(`${playerName} oyunu ${time} saniyede bitirdi!`);
            }, 300);
        }
    }

    startButton.addEventListener("click", createBoard);
});
