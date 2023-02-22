import { Slider } from "../slider";

abstract class Algorithm {
    abstract slider: Slider;

    abstract getFitnessFunction(): (slider: Slider) => number;

    abstract getImportantTiles(): Set<string>;

    abstract getLockedTiles(): Set<string>;

    traverseToGoal() {
        var getFitnessFunction = this.getFitnessFunction();

        var nextSliderState = this.BFS(getFitnessFunction);
        if (nextSliderState == null) {
            console.log("No solution found");
            throw new Error("No solution found");
        }

        nextSliderState.printAllParents();

    }

    // consider defining a queue type within concrete classes. Priority queue can be faster
    private BFS(getFitnessFunction: (slider: Slider) => number) {
        var visited = new Set<string>();
        var queue = [this.slider];

        while (queue.length > 0) {
            // console.log("Queue length: " + queue.length);
            var currentSlider = queue.shift();
            var currentSliderHash = currentSlider.getSliderHash(this.getImportantTiles());
            visited.add(currentSliderHash);


            if (getFitnessFunction(currentSlider) == 0) {
                console.log("Found solution");
                return currentSlider;
            }

            var nextSliders = this.getSlidersAfterMoves(currentSlider);
            // console.log("Next sliders: " + nextSliders.length);
            for (var i = 0; i < nextSliders.length; i++) {
                var nextSlider = nextSliders[i];
                var nextSliderHash = nextSlider.getSliderHash(this.getImportantTiles());
                if (!visited.has(nextSliderHash)) {
                    queue.push(nextSlider);
                }
            }
        }

        return null;
    }

    private getSlidersAfterMoves(slider: Slider) {
        var validMoves = slider.getMoves(this.getLockedTiles());
        return slider.getSliderAfterMoves(validMoves);
    }


}

export { Algorithm };