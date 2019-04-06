#RPS Multiplayer

##Outline

-Player Area
  -Enter Name / Show Current Player
  -Show whose turn it is
  -Show choice options
  -Visually tell when control moves to the next player
  -Show each players choice, and display winner/loser context
  -Keep track of wins and losses and show updates
  -Show when players disconnect

-Back-end
  -Connect to Firebase
  -Read current game state. If player1 is taken, show player2 as the login option
  -Track whose turn it is
  -Move control to active player
  -Disable player choice options when not their turn
  -Wait for choice to be made (add timer?)
  -Once choice is made move to next player o fdetermine winner
  -Send results to front end

-Extra Features
  -Chat
  -Gifs to go with choices, combat and winning/losing
  -Add additional games or refactor for react

##Database Structure

-root
  -player(unique per player?)
    -name
    -wins
    -losses
  -current game
    -players currently playing
    -game state
    -player choices
  -connected info
    -playername connected