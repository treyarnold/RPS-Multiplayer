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

const app = {
  showPlayer: function (player, playerClass) {
    console.log(player, playerClass);
  }

};

$(".player").on("click", event => {
  console.log(event);
  event.preventDefault();
  const playerNumber = event.target.id;
  const player = {
    name: $(`#player${playerNumber}Name`).val().trim(),
  }
  console.log(player.name);
  DB.ref("players").push(player);
  app.showPlayer(player, `.player${playerNumber}`);
})
