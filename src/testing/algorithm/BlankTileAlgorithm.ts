import { Slider } from "../slider";
import { Algorithm } from "./Algorithm";

// This is the algorithm to find best path to take blank tile to goal tile
class BlankTileAlgorithm extends Algorithm {
    slider: Slider;
    private lockedTiles: Set<string>;
    private importantTile = "#";
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
            var result = 0;

            // Get index of blank tile
            var blankIndex = slider.getSliderString().indexOf("#");
            var blankRow = Math.floor(blankIndex / slider.getBoardSize());
            var blankCol = blankIndex % slider.getBoardSize();

            // Get index of goal tile
            var goalIndex = slider.getSliderString().indexOf(this.goalTile);
            var goalRow = Math.floor(goalIndex / slider.getBoardSize());
            var goalCol = goalIndex % slider.getBoardSize();

            // Calculate Manhattan distance
            result = Math.abs(blankRow - goalRow) + Math.abs(blankCol - goalCol);

            // We only want to get next to the goal tile, not on it
            return result - 1;
        }
    }

    getImportantTiles(): Set<string> {
        return new Set([this.importantTile, this.goalTile]);
    }

    getLockedTiles(): Set<string> {
        return this.lockedTiles;
    }

}

export { BlankTileAlgorithm };