class Board {
    //plateau contains a 2 dimension array of pieces
    constructor(){
        this.plateau = [];
    }

    updatePlateau(newPlateau){
      this.plateau = newPlateau;
    }

    getPieceAt(x,y){
        if(this.insideBoundaries(x,y))
          return this.plateau[x][y];
        else
          throw new Error("Out of boundaries");
    }

    getBoard(){
        return this.plateau;
    }

    insideBoundaries(x,y){
      return x >= 0 && x < 9 && y >= 0 && y < 9;
    }
}