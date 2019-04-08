const config = {
  apiKey: "AIzaSyBKbm-cOthbu3xo0EVUie600BB-94cX-mE",
  authDomain: "rockpaperscissors-3c9bc.firebaseapp.com",
  databaseURL: "https://rockpaperscissors-3c9bc.firebaseio.com",
  projectId: "rockpaperscissors-3c9bc",
  storageBucket: "rockpaperscissors-3c9bc.appspot.com",
  messagingSenderId: "245766332116"
};
firebase.initializeApp(config);

const DB = firebase.database();
const connectionsRef = DB.ref("/players");
const connectedRef = DB.ref(".info/connected");

connectedRef.on("value", snapshot => {
  if (snapshot.val()) {
    const con = connectionsRef.push(true);
    game.localID = con.key;
    con.onDisconnect().remove();
  }
})

const game = {
  localPlayerNumber: undefined,
  wins: 0,
  losses: 0,
  localID: undefined,

  addPlayerInput: function (playerNumber, disabled) {
    let playerID = `#player${playerNumber}`;
    let display =
      `<form class="input-group mb-3">
        <input type="text" class="form-control text-center" 
          placeholder="Player ${playerNumber}" id="player${playerNumber}Name">
        <button class="input-group-append btn btn-outline-success player" 
          type="submit" id="${playerNumber}">Submit</button>
      </form>`;
    $(playerID).empty();
    $(playerID).append(display);
    if (disabled) $(`#${playerNumber}`).prop("disabled", true)
  },

  showPlayer: function (playerName, playerID) {
    $(playerID).empty();
    const newPlayerHeader = $("<h2>").text(playerName);
    $(playerID).append(newPlayerHeader);
  },

  playerTurn: function (player) {
    console.log("playerTurn", player);
    const id = `#${player}Div`;
    $(id).addClass("playerTurn");
  },

  addButtonListeners: function (player) {
    $(`#${player}Rock`).on("click", () => {
      DB.ref(`gameState/playerChoices/${player}`).set({playerChoice: "Rock"})         
    })
    $(`#${player}Paper`).on("click", () => {
      DB.ref(`gameState/playerChoices/${player}`).set({playerChoice: "Paper"})         
    })
    $(`#${player}Scissors`).on("click", () => {
      DB.ref(`gameState/playerChoices/${player}`).set({playerChoice: "Scissors"})         
    })
  },

  disableButtons: function (buttonID) {
    $(`#${buttonID}Rock`).prop("disabled", true);
    $(`#${buttonID}Paper`).prop("disabled", true);
    $(`#${buttonID}Scissors`).prop("disabled", true);
  },

  startGame: function () {
    this.playerTurn("player1");
    if (this.localPlayerNumber === "1") {
      this.addButtonListeners("player1");
      this.disableButtons("player2");
    }
  },
};

$(document).on("click", ".player", event => {
  event.preventDefault();
  const playerNumber = event.target.id;
  const player = {
    playerName: $(`#player${playerNumber}Name`).val().trim(),
    playerNumber: `player${playerNumber}`,
    wins: 0,
    losses: 0,
  };
  game.localPlayerNumber = playerNumber;
  DB.ref(`players/${game.localID}`).update(player);
});

DB.ref("players").on("value", snapshot => {
  let player1 = false;
  let player2 = false;
  snapshot.forEach(childSnapshot => {
    if (childSnapshot.val().playerNumber === "player1") {
      player1 = true;
      game.showPlayer(childSnapshot.val().playerName, "#player1");
    }
    if (childSnapshot.val().playerNumber === "player2") {
      player2 = true;
      game.showPlayer(childSnapshot.val().playerName, "#player2");
    }
  });
  if (!player1) {
    if (game.localPlayerNumber) game.addPlayerInput("1", true);
    else game.addPlayerInput("1", false);
  }
  if (!player2) {
    if (game.localPlayerNumber) game.addPlayerInput("2", true);
    else game.addPlayerInput("2", false);
  }
  if (player1 && player2) game.startGame();
});