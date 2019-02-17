class Board {
    //plateau contains a 2 dimension array of pieces
    constructor(){
        this.plateau = [];
    }

    updatePlateau(newPlateau){
      this.plateau = newPlateau;
    }

    getPieceAt(x,y){
      return this.plateau[x][y];
    }

    getBoard(){
        return this.plateau;
    }
}