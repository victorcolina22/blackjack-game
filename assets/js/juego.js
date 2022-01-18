const myModule = (() => {
  "use stric";

  /**
   * 2C = Two of Clubs
   * 2D = Two of Diamonds
   * 2H = Two of Hearts
   * 2S = Two of Spades
   */

  const newGame = document.querySelector("#newGame"),
    dropNewCard = document.querySelector("#dropCard"),
    stopGame = document.querySelector("#stop"),
    HTMLPoints = document.querySelectorAll("small"),
    // divCards contiene a los contenedores donde se mostrarán las cartas del jugador y la computadora
    divCards = document.querySelectorAll(".divCards");

  let pointsOfPlayers = [];

  let deck = [];

  const types = ["C", "D", "H", "S"],
    specials = ["A", "J", "Q", "K"];

  // Inicializa el juego
  const init = (numPlayers = 2) => {
    pointsOfPlayers = [];

    deck = createDeck();

    for (let i = 0; i < numPlayers; i++) {
      pointsOfPlayers.push(0);
    }

    HTMLPoints.forEach((item) => (item.innerText = "0"));
    document.querySelectorAll(".carta").forEach((item) => item.remove());

    stopGame.disabled = false;
    dropNewCard.disabled = false;
  };

  // Esta función crea una nueva baraja
  const createDeck = () => {
    deck = [];
    for (let i = 2; i <= 10; i++) {
      for (let type of types) {
        deck.push(i + type);
      }
    }
    for (let type of types) {
      for (let special of specials) {
        deck.push(special + type);
      }
    }

    return _.shuffle(deck);
  };

  // Esta función permite tomar una carta
  const dropCard = () => {
    if (deck.length === 0) {
      throw "No hay cartas en el deck";
    }
    return deck.pop();
  };

  // Esta función devuelve el valor de la carta
  const cardValue = (card) => {
    const value = card.substring(0, card.length - 1);
    return isNaN(value) ? (value === "A" ? 11 : 10) : value * 1;
  };

  // Turno: 0 = primer jugador y el último será la computadora
  playersPoints = (card, turn) => {
    pointsOfPlayers[turn] = pointsOfPlayers[turn] + cardValue(card);
    HTMLPoints[turn].innerText = pointsOfPlayers[turn];

    return pointsOfPlayers[turn];
  };

  const createCard = (card, position) => {
    let newCard = document.createElement("img");
    newCard.src = `/assets/cartas/${card}.png`;
    newCard.classList.add("carta");
    newCard.loading = "lazy";
    divCards[position].append(newCard);
  };

  // Turno de la computadora
  const computerTurn = (points) => {
    let computerPoints = 0;

    do {
      const card = dropCard();
      // Points
      computerPoints = playersPoints(card, pointsOfPlayers.length - 1);

      // Cards
      createCard(card, pointsOfPlayers.length - 1);

      if (points > 21) {
        break;
      }
    } while (computerPoints < points && points <= 21);

    setTimeout(() => {
      if (computerPoints === points) {
        alert("Nadie gana :(");
      } else if (points > 21) {
        alert("Computadora gana!");
      } else if (computerPoints > 21) {
        alert("Jugador gana!");
      } else {
        alert("Computadora gana!");
      }
    }, 300);
  };

  // Turno del jugador
  dropNewCard.addEventListener("click", () => {
    // Points
    const card = dropCard();
    const playerPoints = playersPoints(card, 0);

    // Cards
    createCard(card, 0);

    setTimeout(() => {
      if (playerPoints > 21) {
        dropNewCard.disabled = true;
        stopGame.disabled = true;
        computerTurn(playerPoints);
      } else if (playerPoints === 21) {
        alert("Jugador gana!");
        dropNewCard.disabled = true;
        stopGame.disabled = true;
      }
    }, 300);
  });

  // Detener
  stopGame.addEventListener("click", () => {
    stopGame.disabled = true;
    dropNewCard.disabled = true;

    computerTurn(pointsOfPlayers[0]);
  });

  // Nuevo juego
  newGame.addEventListener("click", () => {
    init();
  });

  return {
    nuevoJuego: init,
  };
})();
