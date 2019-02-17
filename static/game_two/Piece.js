class Piece{
    constructor(x,y,team){
        this.matrixPosition = createVector(x,y);
        this.pixelPosition = createVector(x*CASE_SIZE, y*CASE_SIZE);
        this.taken = false;
        this.team = team;
        this.letter = letter;
        this.hasPromotion = false;
        this.isPromoted = false;
        this.pic = pic;
        this.promotionPic = promotionPic;
    }
}

class Lancer extends Piece {
    constructor(x, y, team){
        super(x,y,team);
        this.letter = "L";
        this.hasPromotion = true;
        this.pic = new_pieces["lancer"];
        this.promotionPic = new_pieces["lancer_up"];
    }
}

class Knight extends Piece {
    constructor(x, y, team){
        super(x,y,team);
        this.letter = "Kn";
        this.hasPromotion = true;
        this.pic = new_pieces["knight"];
        this.promotionPic = new_pieces["knight_up"];
    }
}

class Silver extends Piece {
    constructor(x, y, team){
        super(x,y,team);
        this.letter = "S";
        this.hasPromotion = true;
        this.pic = new_pieces["silver"];
        this.promotionPic = new_pieces["silver_up"];
    }
}

class Gold extends Piece {
    constructor(x, y, team){
        super(x,y,team);
        this.letter = "G";
        this.pic = new_pieces["gold"];
    }
}

class Bishop extends Piece {
    constructor(x, y, team){
        super(x,y,team);
        this.letter = "B";
        this.hasPromotion = true;
        this.pic = new_pieces["bishop"];
        this.promotionPic = new_pieces["bishop_up"];
    }
}

class Rook extends Piece {
    constructor(x, y, team){
        super(x,y,team);
        this.letter = "R";
        this.hasPromotion = true;
        this.pic = new_pieces["rook"];
        this.promotionPic = new_pieces["rook_up"];
    }
}

class Pawn extends Piece {
    constructor(x, y, team){
        super(x,y,team);
        this.letter = "P";
        this.hasPromotion = true;
        this.pic = new_pieces["pawn"];
        this.promotionPic = new_pieces["pawn_up"];
    }
}

class King extends Piece {
    constructor(x, y, team){
        super(x,y,team);
        this.letter = "K";
        this.pic = new_pieces["king"];
    }
}