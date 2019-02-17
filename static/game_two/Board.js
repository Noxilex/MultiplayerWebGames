class Board {
    //plateau contains a 2 dimension array of pieces
    constructor(){
        this.plateau = [];
        this.setupPieces();
    }

    reset() {
        this.plateau = [];
        for (let i = 0; i < 9; i++) {
          let colonne = [];
          for (let j = 0; j < 9; j++) {
            colonne.push({});
          }
          this.plateau.push(colonne);
        }
      }

    setupPieces(){
        let team = "black";
        this.plateau[0][0] = new Lancer(0,0,team);
        this.plateau[1][0] = new Knight(0,0,team);
        this.plateau[2][0] = new Silver(0,0,team);
        this.plateau[3][0] = new Gold(0,0,team);
        this.plateau[4][0] = new King(0,0,team);
        this.plateau[5][0] = new Gold(0,0,team);
        this.plateau[6][0] = new Silver(0,0,team);
        this.plateau[7][0] = new Knight(0,0,team);
        this.plateau[8][0] = new Lancer(0,0,team);
        
        this.plateau[7][1] = new Bishop(0,0,team);
        this.plateau[1][1] = new Rook(0,0,team);

        this.plateau[0][2] = new Pawn(0,0,team);
        this.plateau[1][2] = new Pawn(0,0,team);
        this.plateau[2][2] = new Pawn(0,0,team);
        this.plateau[3][2] = new Pawn(0,0,team);
        this.plateau[4][2] = new Pawn(0,0,team);
        this.plateau[5][2] = new Pawn(0,0,team);
        this.plateau[6][2] = new Pawn(0,0,team);
        this.plateau[7][2] = new Pawn(0,0,team);
        this.plateau[8][2] = new Pawn(0,0,team);

        
        team = "white";
        this.plateau[0][8] = new Lancer(0,0,team);
        this.plateau[1][8] = new Knight(0,0,team);
        this.plateau[2][8] = new Silver(0,0,team);
        this.plateau[3][8] = new Gold(0,0,team);
        this.plateau[4][8] = new King(0,0,team);
        this.plateau[5][8] = new Gold(0,0,team);
        this.plateau[6][8] = new Silver(0,0,team);
        this.plateau[7][8] = new Knight(0,0,team);
        this.plateau[8][8] = new Lancer(0,0,team);
        
        this.plateau[1][7] = new Bishop(0,0,team);
        this.plateau[7][7] = new Rook(0,0,team);

        this.plateau[0][6] = new Pawn(0,0,team);
        this.plateau[1][6] = new Pawn(0,0,team);
        this.plateau[2][6] = new Pawn(0,0,team);
        this.plateau[3][6] = new Pawn(0,0,team);
        this.plateau[4][6] = new Pawn(0,0,team);
        this.plateau[5][6] = new Pawn(0,0,team);
        this.plateau[6][6] = new Pawn(0,0,team);
        this.plateau[7][6] = new Pawn(0,0,team);
        this.plateau[8][6] = new Pawn(0,0,team);
    }

    getPieceAt(x,y){

    }

    getBoard(){
        return plateau;
    }
}