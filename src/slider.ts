export class Slider {
    boardString: string;

    constructor(boardString) {
        this.boardString = boardString;
    }

    getBoardString() {
        return this.boardString;
    }

    logAsGrid() {
        var grid = [];
        for (var i = 0; i < 5; i++) {
            grid.push([]);
            for (var j = 0; j < 5; j++) {
                grid[i].push(this.boardString[i * 5 + j]);
            }
        }
        console.log(grid);
    }

    getBoardAsCharacterArray() {
        var array = [];
        for (var i = 0; i < this.boardString.length; i++) {
            array.push(this.boardString[i]);
        }
        return array;
    }

    getBoardAfterMove(move) {
        var index = this.boardString.indexOf("#");
        var newBoardString = this.boardString;
        var boardCharArray = this.getBoardAsCharacterArray();
        switch (move) {
            case "left":
                boardCharArray[index] = boardCharArray[index - 1];
                boardCharArray[index - 1] = "#";
                break;
            case "right":
                boardCharArray[index] = boardCharArray[index + 1];
                boardCharArray[index + 1] = "#";
                break;
            case "up":
                boardCharArray[index] = boardCharArray[index - 5];
                boardCharArray[index - 5] = "#";
                break;
            case "down":
                boardCharArray[index] = boardCharArray[index + 5];
                boardCharArray[index + 5] = "#";
                break;
        }
        newBoardString = boardCharArray.join("");

        return new Slider(newBoardString);
    }

    getPossibleBoardsAfterMove() {
        var boards = [];
        var moves = this.getPossibleMoves();
        for (var i = 0; i < moves.length; i++) {
            boards.push(this.getBoardAfterMove(moves[i]));
        }
        return boards;
    }

    getPossibleBoardStringsAfterMove() {
        var boardStrings = [];
        var boards = this.getPossibleBoardsAfterMove();
        for (var i = 0; i < boards.length; i++) {
            boardStrings.push(boards[i].getBoardString());
        }
        return boardStrings;
    }

    getPossibleMoves() {
        var moves = [];
        var index = this.boardString.indexOf("#");
        if (index % 5 != 0) {
            moves.push("left");
        }
        if (index % 5 != 4) {
            moves.push("right");
        }
        if (index >= 5) {
            moves.push("up");
        }
        if (index <= 19) {
            moves.push("down");
        }
        return moves;
    }

    


  
}
