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

const game = {
  localPlayerNumber: undefined,
  wins: 0,
  lossed: 0,

  addPlayerInput: function (playerNumber) {
    let playerID = `#player${playerNumber}`;
    let display =
      `<form class="input-group mb-3">
        <input type="text" class="form-control text-center" 
          placeholder="Player ${playerNumber}" id="player${playerNumber}Name">
        <button class="input-group-append btn btn-outline-success player" 
          type="submit" id="${playerNumber}">Submit</button>
      </form>`
    $(playerID).empty();
    $(playerID).append(display);    
  },

  showPlayer: function (player, playerID) {
    $(playerID).empty();
    const newPlayerHeader = $("<h2>").text(player.name);
    $(playerID).append(newPlayerHeader);
  },
};

$(document).on("click", ".player", event => {
  event.preventDefault();
  const playerNumber = event.target.id;
  const player = {
    name: $(`#player${playerNumber}Name`).val().trim(),
    playerNumber: playerNumber,
  };
  game.localPlayerNumber = playerNumber;
  DB.ref("players").push(player);
  if (playerNumber === "1") DB.ref("gameState/players").update({player1: true});
  if (playerNumber === "2") DB.ref("gameState/players").update({player2: true});
  game.showPlayer(player, `#player${playerNumber}`);
});

DB.ref("gameState/players").on("value", snapshot => {
  if (snapshot.val() === null) {
    game.addPlayerInput("1");
    game.addPlayerInput("2");
  } else {
    if (!(snapshot.val().player1)) game.addPlayerInput("1")
    else 
    if (!(snapshot.val().player2)) game.addPlayerInput("2")
  }
});
