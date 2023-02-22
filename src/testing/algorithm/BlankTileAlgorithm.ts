import { Slider } from "../slider";
import { Algorithm } from "./Algorithm";

// This is the algorithm to find best path to take blank tile to goal tile
class BlankTileAlgorithm extends Algorithm {
    slider: Slider;
    private lockedTiles: Set<string> = new Set();
    //This is the tile we want to move towards. Not onto, but towards.
    private goalTile: string;


    constructor(slider: Slider, goalTile: string) {
        super();
        this.slider = slider;
        this.goalTile = goalTile;
    }

    getFitnessFunction(): (slider: Slider) => number {
        return (slider: Slider) => {
            // Manhattan distance of blank tile to goal tile

            // Get index of blank tile
            var blankIndex = slider.getSliderString().indexOf("#");
            var blankRow = Math.floor(blankIndex / slider.getBoardSize());
            var blankCol = blankIndex % slider.getBoardSize();

            // Get index of goal tile
            var goalIndex = slider.getSliderString().indexOf(this.goalTile);
            var goalRow = Math.floor(goalIndex / slider.getBoardSize());
            var goalCol = goalIndex % slider.getBoardSize();

            // Calculate Manhattan distance
            var result = Math.abs(blankRow - goalRow) + Math.abs(blankCol - goalCol);

            // Logic to allow even adjacent tiles to be considered "next to" each other
            if (Math.abs(blankRow - goalRow) == 1 && Math.abs(blankCol - goalCol) == 1) {
                return 0;
            }

            // We only want to get next to the goal tile, not on it
            return result - 1;
        }
    }

    getImportantTiles(): Set<string> {
        return new Set([this.slider.blankTileSymbol, this.goalTile]);
    }

    getLockedTiles(): Set<string> {
        return this.lockedTiles;
    }

    // Can probably add some hardcoded smarts to choose which adjacent tile is the best
    // based on the expectedPosition for the goal Tile.

}

export { BlankTileAlgorithm };