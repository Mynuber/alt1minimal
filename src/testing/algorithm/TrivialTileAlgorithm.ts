import { Slider } from "../slider";
import { Algorithm } from "./Algorithm";

class TrivialTileAlgorithm extends Algorithm {
    slider: Slider;
    private goalTiles: string[]; // This is the goal tile, we want to move this tile to the expected position
    private lockedTiles: Set<string>;

    constructor(slider: Slider, goalTiles: string[], lockedTiles: Set<string> = new Set()) {
        super();
        this.slider = slider;
        this.goalTiles = goalTiles;
        this.lockedTiles = lockedTiles;
    }

    getFitnessFunction(): (slider: Slider) => number {
        return (slider: Slider) => {
            // Manhattan distance of goal tile to expected position
            var result = 0;
            this.goalTiles.forEach(goalTile => {
                result += this.getManhattanDistanceForTile(goalTile, slider);
            });
            return result;

        }
    }

    getImportantTiles(): Set<string> {
        return new Set([this.slider.blankTileSymbol, ...(this.goalTiles)]);
    }

    getLockedTiles(): Set<string> {
        // Any tiles that before the first goal tile is in the correct position
        // should be locked
        // var result = new Set<string>();
        // var lastLockedTileIndex = this.goalTiles[0].charCodeAt(0) - "a".charCodeAt(0);
        // for (var i = 0; i < lastLockedTileIndex; i++) {
        //     result.add(String.fromCharCode(i + "a".charCodeAt(0)));
        // }
        // return result;
        return this.lockedTiles;
    }

    private getManhattanDistanceForTile(goalTile: string, slider: Slider): number {
        var goalIndex = slider.getSliderString().indexOf(goalTile);
        var goalRow = Math.floor(goalIndex / slider.getBoardSize());
        var goalCol = goalIndex % slider.getBoardSize();

        var expectedIndex = this.slider.getExpectedTilePositionIndex(goalTile);
        var expectedRow = Math.floor(expectedIndex / slider.getBoardSize());
        var expectedCol = expectedIndex % slider.getBoardSize();

        var result = Math.abs(goalRow - expectedRow) + Math.abs(goalCol - expectedCol);
        return result;
    }

}

export { TrivialTileAlgorithm };