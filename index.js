let deckId = "";
let playerScore = 0;
let computerScore = 0;
let playerHist = [];
let computerHist = [];
let values = {
  "ACE": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  "JACK": 11,
  "QUEEN": 12,
  "KING": 13,
};

const drawBtn = document.getElementById("draw-btn");

const getNewDeck = async () => {
  try {
    const res = await fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/");
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error("New cards deck could not fetched!");
    };
  } catch (error) {
    console.error(error);
    return null; 
  }
};

const getCards = async (id) => {
  try {
    const res = await fetch(`https://www.deckofcardsapi.com/api/deck/${id}/draw/?count=4`);
    const data = await res.json();
    if (data.success) { 
      return data;
    } else {
      throw new Error("New card could not fetched!");
    };
  } catch (error) {
    console.error(error);
    return null; 
  }
};

const render = (cards) => {
  cards.map((card, index) => {
    const divId = "card" + index;
    document.getElementById(divId).innerHTML = ` <img src=${card.image} alt=${divId} class="card-img" /> `;
    let value = card.value;
    if (index < 2) {
      computerScore += values[value];
      value.length > 2 ? computerHist.push(value.charAt(0)) : computerHist.push(value);
    } else {
      playerScore += values[value];
      value.length > 2 ? playerHist.push(value.charAt(0)) : playerHist.push(value);
    };
    document.getElementById("comp-score").textContent = computerScore;
    document.getElementById("player-score").textContent = playerScore;
    document.getElementById("comp-hist").textContent = computerHist.join(", ");
    document.getElementById("player-hist").textContent = playerHist.join(", ");
  });
};

const initRender = () => {
  document.getElementById("container").innerHTML = `
    <div id="comp-zone">
      <div class="score">
        <span>Computer's Score: </span>
        <span id="comp-score">---</span>
      </div>
      <div class="hist">
        <span>Computer's Cards: </span>
        <span id="comp-hist">---</span>
      </div>
      <div class="cards">
        <div class="card" id="card0"></div>
        <div class="card" id="card1"></div>
      </div>
    </div>
    <hr />
    <div id="player-zone">
      <div class="cards">
        <div class="card" id="card2"></div>
        <div class="card" id="card3"></div>
      </div>
      <div class="score">
        <span>Player's Score: </span>
        <span id="player-score">---</span>
      </div>
      <div class="hist">
        <span>Player's cards: </span>
        <span id="player-hist">---</span>
      </div>
    </div>
  `;
  playerScore = 0;
  computerScore = 0;
  playerHist = [];
  computerHist = [];
};

const renderWinner = (winner, el, score, hist) => {
  el.innerHTML = `
    <div class="win-lose">
      <h1>Winner: <span>${winner}</span></h1>
      <div class="win-lose-score">
        <span>${winner}'s Score: </span>
        <span>${score}</span>
      </div>
      <div class="win-lose-hist">
        <span>${winner}'s Cards: </span>
        <span>${hist.join(", ")}</span>
      </div>
    </div>
  `;
};

const renderLoser = (loser, el, score, hist) => {
  el.innerHTML = `
    <div class="win-lose">
      <h1>Loser: <span>${loser}</span></h1>
      <div class="win-lose-score">
        <span>${loser}'s Score: </span>
        <span>${score}</span>
      </div>
      <div class="win-lose-hist">
        <span>${loser}'s Cards: </span>
        <span>${hist.join(", ")}</span>
      </div>
    </div>
  `;
};

const renderTie = () => {
  document.getElementById("container").innerHTML = `
    <div class="win-lose">
      <h1>TIE</h1>
      <div class="win-lose-score">
        <span>Computer's Score: </span>
        <span>${computerScore}</span>
      </div>
      <div class="win-lose-hist">
        <span>Computer's Cards: </span>
        <span>${computerHist.join(", ")}</span>
      </div>
      <hr />
      <div class="win-lose-score">
        <span>Player's Score: </span>
        <span>${playerScore}</span>
      </div>
      <div class="win-lose-hist">
        <span>Player's cards: </span>
        <span>${playerHist.join(", ")}</span>
      </div>
    </div>
  `;
};

drawBtn.addEventListener("click", async () => {
  const drewCards = await getCards(deckId);
  if (drewCards) {
    document.getElementById("rem").textContent = drewCards.remaining;
    render(drewCards.cards);
    if (drewCards.remaining === 0) {
      drawBtn.classList.add("disable");
      drawBtn.disabled = true;
      setTimeout(() => {
        const compZone = document.getElementById("comp-zone");
        const playerZone = document.getElementById("player-zone");
        if (playerScore > computerScore) {
          renderWinner("Player", playerZone, playerScore, playerHist);
          renderLoser("Computer", compZone, computerScore, computerHist);
        } else if (playerScore < computerScore) {
          renderWinner("Computer", compZone, computerScore, computerHist);
          renderLoser("Player", playerZone, playerScore, playerHist);
        } else{
          renderTie();
        };
      }, 3000);
    };
  };
});

document.getElementById("draw-new-btn").addEventListener("click", async () => {
  initRender();
  const data = await getNewDeck();
  if (data) {
    deckId = data.deck_id;
    document.getElementById("rem").textContent = data.remaining;
    drawBtn.classList.remove("disable");
    drawBtn.disabled = false;
  };
});

if (!deckId) {
  drawBtn.classList.add("disable");
  drawBtn.disabled = true;
};

initRender();