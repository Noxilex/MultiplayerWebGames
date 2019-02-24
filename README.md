# MultiplayerWebGame
Testing WebSocket to make a multiplayer game

Available version on: http://noxilex.ovh:5000

### Ideas
- path:'/' -> Shows the list of all games available
- path:'/game/{name_of_the_game} -> link to play a specific game


### Ressources used
- https://hackernoon.com/how-to-build-a-multiplayer-browser-game-4a793818c29b?gi=85194f022ce2
- https://developer.mozilla.org/en-US/docs/Web/API/WebSocket


 # TODO
- [X] Data structure (board & pieces)
- [X] Draw board & pieces
- [X] Draw images instead of shapes
- [X] Piece movement rules
    - [X] Piece movement preview (semi-working, need to make it work according to rules)
    - [X] Piece movement according to preview
- [ ] Promotion rules
    - [ ] Promotion movement
    - [ ] Promotion happens when you reach the end of the board
- [ ] Piece take
- [ ] Piece back in
- [ ] Game over