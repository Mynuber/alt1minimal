export class Slider {

    private sliderString: string;
    private nSize: number;
    private parent: this;

    private lockedTiles: Map<string, boolean> = new Map<string, boolean>();

    private directionFromParent: SliderMove;
    blankTileSymbol: string = "#";


    constructor(sliderString: string) {
        this.sliderString = sliderString;
        this.nSize = Math.sqrt(this.sliderString.length);
        this.setLockedTiles();
    }

    getSliderString() {
        return this.sliderString;
    }

    getBoardSize() {
        return this.nSize;
    }

    getParent() {
        return this.parent;
    }

    getMoveFromParent() {
        return this.directionFromParent;
    }

    getSlidersAfterValidMoves() {
        var sliders = [];
        var validMoves = this.getValidMoves();
        for (var i = 0; i < validMoves.length; i++) {
            sliders.push(this.getSliderAfterMove(validMoves[i]));
        }
        return sliders;
    }

    private getSliderAfterMove(move) {
        var index = this.sliderString.indexOf("#");
        var newSliderString: string;

        switch (move) {
            case "left":
                newSliderString = this.sliderString.substring(0, index - 1) + "#" + this.sliderString[index - 1] + this.sliderString.substring(index + 1);
                break;
            case "right":
                newSliderString = this.sliderString.substring(0, index) + this.sliderString[index + 1] + "#" + this.sliderString.substring(index + 2);
                break;
            case "up":
                newSliderString = this.sliderString.substring(0, index - this.nSize) + "#" + this.sliderString.substring(index - this.nSize + 1, index) + this.sliderString[index - this.nSize] + this.sliderString.substring(index + 1);
                break;
            case "down":
                newSliderString = this.sliderString.substring(0, index) + this.sliderString[index + this.nSize] + this.sliderString.substring(index + 1, index + this.nSize) + "#" + this.sliderString.substring(index + this.nSize + 1);
                break;
        }

        var slider = new Slider(newSliderString);
        slider.parent = this;
        slider.directionFromParent = move;
        return slider;
    }


    getValidMoves() {
        var index = this.sliderString.indexOf("#");
        var moves = [];
        if (index % this.nSize != 0 && !this.lockedTiles.get(this.sliderString[index - 1])) {
            moves.push("left");
        }
        if (index % this.nSize != this.nSize - 1 && !this.lockedTiles.get(this.sliderString[index + 1])) {
            moves.push("right");
        }
        if (index >= this.nSize && !this.lockedTiles.get(this.sliderString[index - this.nSize])) {
            moves.push("up");
        }
        if (index < this.nSize * (this.nSize - 1) && !this.lockedTiles.get(this.sliderString[index + this.nSize])) {
            moves.push("down");
        }
        return moves;
    }

    private setLockedTiles() {
        // var char = this.getNextSolvableTile();
        // var indexUpTo = this.getExpectedTilePositionIndex(char);

        // if (indexUpTo % 5 == 3) {
        //     indexUpTo--;
        // }

        // // get all the tiles before this and lock them
        // for (var i = 0; i < indexUpTo; i++) {
        //     this.lockedTiles.set(String.fromCharCode("a".charCodeAt(0) + i), true);
        // }

    }


    // getHammingDistanceForRow(row: number) {
    //     var distance = 0;
    //     for (var i = 0; i < this.nSize; i++) {
    //         var char = this.sliderString[row * this.nSize + i];
    //         if (char == "#" || char != String.fromCharCode("a".charCodeAt(0) + row * this.nSize + i)) {
    //             distance++;
    //         }
    //     }
    //     return distance;
    // }

    getNextSolvableTile() {
        for (var i = 0; i < this.sliderString.length - 1; i++) {
            var char = this.sliderString[i];
            var expectedChar = String.fromCharCode("a".charCodeAt(0) + i);
            if (char != expectedChar) {
                return expectedChar;
            }
        }
        return null;
    }

    getExpectedTilePositionIndex(tile: string) {
        return tile.charCodeAt(0) - "a".charCodeAt(0);
    }

    getBestBlankTileMove(tile: string) {
        var index = this.sliderString.indexOf(tile);
        var row = Math.floor(index / this.nSize);
        var col = index % this.nSize;

        // get the blank tile location
        var blankIndex = this.sliderString.indexOf("#");
        var blankRow = Math.floor(blankIndex / this.nSize);
        var blankCol = blankIndex % this.nSize;

        // get the best location for the blank tile
        var bestMove: string;

        if (blankRow < row) {
            bestMove = "down";
        }
        else if (blankRow > row) {
            bestMove = "up";
        }
        else if (blankCol < col - 1) {
            bestMove = "right";
        }
        else if (blankCol > col) {
            bestMove = "left";
        } else {
            return null;
        }

        return this.getSliderAfterMove(bestMove);

    }

    getManhattanDistance(tile: string) {
        var index = this.sliderString.indexOf(tile);
        var row = Math.floor(index / this.nSize);
        var col = index % this.nSize;

        var expectedIndex = this.getExpectedTilePositionIndex(tile);
        var expectedRow = Math.floor(expectedIndex / this.nSize);
        var expectedCol = expectedIndex % this.nSize;

        return Math.abs(row - expectedRow) + Math.abs(col - expectedCol);
    }

    // gets the number of tiles that are out of place for the board
    getBoardManhattanDistance() {
        var distance = 0;
        for (var i = 0; i < this.sliderString.length; i++) {
            var char = this.sliderString[i];
            if (char != "#") {

                var index = char.charCodeAt(0) - "a".charCodeAt(0);
                var row = Math.floor(index / this.nSize);
                var col = index % this.nSize;
                distance += Math.abs(row - Math.floor(i / this.nSize)) + Math.abs(col - i % this.nSize);
            }
        }
        return distance;
    }


    // Debugging logging functions
    printValidMoves(showBoards: boolean = false) {
        console.log("The board: " + this.getSliderString());
        if (showBoards) {
            this.printStringAsGrid();
        }
        var validMoves = this.getValidMoves();
        for (var i = 0; i < validMoves.length; i++) {
            var newSlider = this.getSliderAfterMove(validMoves[i]);
            console.log("After move " + validMoves[i] + ": " + newSlider.getSliderString() + " has Manhattan distance: " + newSlider.getBoardManhattanDistance());
            if (showBoards) {
                newSlider.printStringAsGrid();
            }
        }

    }

    printStringAsGrid() {
        var grid = [];
        for (var i = 0; i < this.nSize; i++) {
            grid.push([]);
            for (var j = 0; j < this.nSize; j++) {
                grid[i].push(this.sliderString[i * this.nSize + j]);
            }
        }
        console.log(grid);
    }

    printSliderDetails(showBoards: boolean = false) {
        console.log("Slider string: " + this.getSliderString() + " has manhattan distance: " + this.getBoardManhattanDistance() + " and parent: " + ((this.parent != null) ? this.parent.getSliderString() : "none"));
        if (showBoards) {
            this.printStringAsGrid();
        }
        console.log('----------------');

    }

    printAllParents() {
        var slider = this;
        console.log("Printing all parents: ")
        var count = 0;
        while (slider != null) {
            // slider.printSliderStringAsMultiLine();
            // console.log("Slider Move: " + slider.getMoveFromParent())
            slider = slider.parent;
            count++;
        }
        console.log("Total number of parents(moves): " + count);
    }

    printSliderStringAsMultiLine() {
        var result = "--------" + this.sliderString + "----------\n";
        for (var i = 0; i < this.nSize; i++) {
            result += this.sliderString.slice(i * this.nSize, i * this.nSize + this.nSize) + "\n";
        }
        console.log(result);
    }














    // Temp code for algorithms

    // Get slider string with any non-important tiles replaced with *
    getSliderHash(importantTiles: Set<string>) {
        var result = "";
        for (var i = 0; i < this.sliderString.length; i++) {
            var char = this.sliderString[i];
            if (importantTiles.has(char)) {
                result += char;
            } else {
                result += "*";
            }
        }
        return result;
    }

    getMoves(lockedTiles: Set<string>) {
        var moves = [];
        var index = this.getSliderString().indexOf("#");
        var nSize = this.getBoardSize();

        if (index % nSize != 0 && !lockedTiles.has(this.getSliderString()[index - 1])) {
            moves.push(SliderMove.Left);
        }
        if (index % nSize != nSize - 1 && !lockedTiles.has(this.getSliderString()[index + 1])) {
            moves.push(SliderMove.Right);
        }
        if (index >= nSize && !lockedTiles.has(this.getSliderString()[index - nSize])) {
            moves.push(SliderMove.Up);
        }
        if (index < nSize * (nSize - 1) && !lockedTiles.has(this.getSliderString()[index + nSize])) {
            moves.push(SliderMove.Down);
        }
        return moves;
    }


    getSliderAfterMoves(moves: SliderMove[]) {
        var result: Slider[] = [];
        moves.forEach(move => {
            result.push(this.getSliderAfterMove(move));
        });
        return result;
    }
}

export enum SliderMove {
    Left = "left",
    Right = "right",
    Up = "up",
    Down = "down"
}
