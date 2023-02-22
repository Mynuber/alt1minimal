import { Slider } from "./slider";

export class Solver {

    private sliderSteps = [];
    private currentStep;
    private boardSize;

    constructor(sliderStartingPosition: Slider) {
        this.sliderSteps.push(sliderStartingPosition);
        this.currentStep = sliderStartingPosition;
        this.boardSize = sliderStartingPosition.getBoardSize();
    }

    solve() {
        // DSolving algorithm consists of the following steps:

        // 1. Moving general number tiles to the top left most unsolved position.

        this.generalNumberTilesAlongShortestPathUntilSolved();

        // 2. STT for the last 2 tiles in the row.


        // 3. Repeat steps 1-2 until we are at the last 2 rows

        // 4. STT for the last 2 columns, and doing a 3x2 area until the right most column is solved.


        // remove all steps between two with same slider string.
        this.sliceBetweenDuplicates();

        this.sliderSteps.forEach((slider, index) => {
            console.log("Step # " + index + "| slider: " + slider.getSliderString());
            slider.printSliderStringAsMultiLine();
        });

    }

    // remove any cycles we have
    sliceBetweenDuplicates() {
        var sliderSteps = this.sliderSteps;
        var newSliderSteps = [];
        var sliderStrings = new Map() as Map<string, number>;

        sliderSteps.forEach((slider, index) => {
            var sliderString = slider.getSliderString();
            if (!sliderStrings.has(sliderString)) {
                newSliderSteps.push(slider);
                sliderStrings.set(sliderString, index);
            } else {
                var previousIndex = sliderStrings.get(sliderString);
                // console.log("Found duplicate slider at index: " + index + " and " + previousIndex);
                newSliderSteps = newSliderSteps.slice(0, previousIndex + 1);
            }

        });
        this.sliderSteps = newSliderSteps;
    }


    generalNumberTilesAlongShortestPathUntilSolved() {
        while (!this.isSecondLastOrLastColumn()) {
            this.generalNumberTilesAlongShortestPath();
        }

    }

    isSecondLastOrLastColumn() {
        var currentStep = this.currentStep;
        var nextSolvableTileIndex = currentStep.getExpectedTilePositionIndex(currentStep.getNextSolvableTile());
        var isSecondLastOrLastColumn = nextSolvableTileIndex % this.boardSize == this.boardSize - 2 || nextSolvableTileIndex % this.boardSize == this.boardSize - 1;

        return isSecondLastOrLastColumn;
    }

    generalNumberTilesAlongShortestPath() {
        // 1. Finding the top left most unsolved tile.
        var tile = this.currentStep.getNextSolvableTile();

        // 2. Move the blank tile to the closes position to the tile in question.
        this.getMovementToGetBlankTileNextToTile(tile);

        // 3. Move the tile to the expected position. Using Manhattan distance only for the tile in question.
        this.getBFSPathToExpectedPosition(tile);

    }

    getMovementToGetBlankTileNextToTile(tile) {

        var nextMove = this.currentStep.getBestBlankTileMove(tile);

        while (nextMove != null) {
            this.sliderSteps.push(nextMove);
            this.currentStep = nextMove;
            nextMove = this.currentStep.getBestBlankTileMove(tile);
        }
    }


    getBFSPathToExpectedPosition(tile) {
        var nextMove = this.searchUntilNextStepFound(tile);

        while (nextMove != null) {

            // add the parents to the slider steps.
            var parents = this.getParentsUntilCurrentStep(nextMove);
            parents.forEach(parent => {
                this.sliderSteps.push(parent);
            });

            this.currentStep = nextMove;
            nextMove = this.searchUntilNextStepFound(tile);
        }
    }

    getParentsUntilCurrentStep(slider) {

        var currentStep = this.currentStep;

        if (currentStep.getSliderString() == slider.getSliderString()) {
            return [];
        }

        var parents = [...this.getParentsUntilCurrentStep(slider.getParent()), slider];

        return parents;
    }




    searchUntilNextStepFound(tile) {

        var moves = [this.currentStep];
        var minDistanceFound = this.currentStep.getManhattanDistance(tile);
        if (minDistanceFound == 0) {
            return null;
        }

        var result = null;
        var depthCount = 0;

        while (moves.length > 0 && depthCount < 5) {
            depthCount++;
            var nextMoves = this.getNextSetOfMoves(moves);

            nextMoves.forEach(slider => {

                if (slider.getManhattanDistance(tile) < minDistanceFound) {
                    result = slider;
                    minDistanceFound = slider.getManhattanDistance(tile);
                }
            });
            moves = nextMoves;
        }

        return result;
    }

    getNextSetOfMoves(sliders: Slider[]) {

        var moves = [];

        sliders.forEach(slider => {
            var sliderMoves = slider.getSlidersAfterValidMoves();
            moves = moves.concat(sliderMoves);
        });

        return moves;
    }



}