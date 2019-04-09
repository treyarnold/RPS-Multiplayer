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
const gameState = DB.ref("gameState");

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
  player1Choice: undefined,
  player2Choice: undefined,

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

  showPlayerTurn: function (player) {
    const id = `#${player}Div`;
    $(id).removeClass("waitingForTurn");
    $(id).addClass("playerTurn");
  },

  showWaitingForTurn: function (player) {
    const id = `#${player}Div`;
    $(id).removeClass("playerTurn");
    $(id).addClass("waitingForTurn");
  },

  addButtonListeners: function (player) {
    $(`#${player}Rock`).on("click", () => {
      DB.ref(`playerChoices/${player}`).set({ playerChoice: "Rock" });
      if (this.localPlayerNumber === "1") gameState.set({ phase: "player2Turn" })
      else gameState.set({ phase: "determineResults" })
    })
    $(`#${player}Paper`).on("click", () => {
      DB.ref(`playerChoices/${player}`).set({ playerChoice: "Paper" });
      if (this.localPlayerNumber === "1") gameState.set({ phase: "player2Turn" })
      else gameState.set({ phase: "determineResults" })
    })
    $(`#${player}Scissors`).on("click", () => {
      DB.ref(`playerChoices/${player}`).set({ playerChoice: "Scissors" });
      if (this.localPlayerNumber === "1") gameState.set({ phase: "player2Turn" })
      else gameState.set({ phase: "determineResults" })
    })
  },

  disableButtons: function (buttonID) {
    $(`#${buttonID}Rock`).prop("disabled", true);
    $(`#${buttonID}Paper`).prop("disabled", true);
    $(`#${buttonID}Scissors`).prop("disabled", true);
  },

  enableButtons: function (buttonID) {
    $(`#${buttonID}Rock`).prop("disabled", false);
    $(`#${buttonID}Paper`).prop("disabled", false);
    $(`#${buttonID}Scissors`).prop("disabled", false);
  },

  startGame: function () {
    this.showPlayerTurn("player1");
    this.showWaitingForTurn("player2");
    $("#combatDiv").empty();
    if (this.localPlayerNumber === "1") {
      $("#combatDiv").append("<h2>").text("It is your Turn");
      this.enableButtons("player1");
    } else if (this.localPlayerNumber === "2") {
      $("#combatDiv").append("<h2>").text("Waiting for Player 1 to choose");
    }
  },

  switchPlayers: function () {
    let player1Choice = undefined;
    DB.ref("playerChoices/player1").once("value", snapshot => player1Choice = snapshot.val().playerChoice);
    this.showPlayerTurn("player2")
    this.showWaitingForTurn("player1");
    $("#combatDiv").empty();
    if (this.localPlayerNumber === "1") {
      this.disableButtons("player1");
      $("#combatDiv").append("<h2>").text("Waiting for Player 2 to Choose");
      $("#combatDiv").append("<h2>").text(`You Chose ${player1Choice}`);
    } else if (this.localPlayerNumber === "2") {
      $("#combatDiv").append("<h2>").text("It is your Turn");
      this.enableButtons("player2");
    }
  },

  determineResults: function () {
    DB.ref("playerChoices/player1").once("value", snapshot => {
      this.player1Choice = snapshot.val().playerChoice;
    })
    DB.ref("playerChoices/player2").once("value", snapshot => {
      this.player2Choice = snapshot.val().playerChoice;
    })
  }
};

game.addButtonListeners("player1");
game.addButtonListeners("player2");
game.disableButtons("player1");
game.disableButtons("player2");

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

gameState.on("value", snapshot => {
  console.log(snapshot.val());
  console.log(snapshot.val() !== null);
  if (snapshot.val() !== null) {
    console.log("in if");
    const currentPhase = snapshot.val().phase;
    switch (currentPhase) {
      case "player1Turn":
        game.startGame();
        break;
      case "player2Turn":
        game.switchPlayers();
        break;
      case "determineResults":
        game.determineResults();
        break;
    }
  }
})

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
  if (player1 && player2) gameState.set({ phase: "player1Turn" });
});