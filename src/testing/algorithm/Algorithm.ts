import { Slider } from "../slider";

abstract class Algorithm {
    abstract slider: Slider;

    abstract getFitnessFunction(): (slider: Slider) => number;

    abstract getImportantTiles(): Set<string>;

    abstract getLockedTiles(): Set<string>;

    nodesTravelled: number = 0;

    traverseToGoal() {
        var getFitnessFunction = this.getFitnessFunction();

        var nextSliderState = this.BFS(getFitnessFunction);
        if (nextSliderState == null) {
            console.log("No solution found");
            throw new Error("No solution found");
        }

        // nextSliderState.printAllParents();

        return nextSliderState;

    }

    // consider defining a queue type within concrete classes. Priority queue can be faster
    private BFS(getFitnessFunction: (slider: Slider) => number) {
        var visited = new Set<string>();
        var queue = priorityQueue<Slider>();
        queue.insert(this.slider, 0);

        while (!queue.isEmpty()) {
            // console.log("Queue length: " + queue.length);
            var currentSlider = queue.pop();
            var currentSliderHash = currentSlider.getSliderHash(this.getImportantTiles());
            visited.add(currentSliderHash);

            if (getFitnessFunction(currentSlider) == 0) {
                console.log("Found solution, visited: " + visited.size + " nodes");
                this.nodesTravelled = visited.size;
                return currentSlider;
            }

            var nextSliders = this.getSlidersAfterMoves(currentSlider);
            // console.log("Next sliders: " + nextSliders.length);
            for (var i = 0; i < nextSliders.length; i++) {
                var nextSlider = nextSliders[i];
                var nextSliderHash = nextSlider.getSliderHash(this.getImportantTiles());
                if (!visited.has(nextSliderHash)) {
                    queue.insert(nextSlider, -getFitnessFunction(nextSlider));
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

interface PriorityQueue<T> {
    insert(item: T, priority: number): void
    peek(): T
    pop(): T
    size(): number
    isEmpty(): boolean
}

const priorityQueue = <T>(): PriorityQueue<T> => {
    const data: [number, T][] = []

    return {

        insert: (i, p) => {
            if (data.length == 0) {
                data.push([p, i])
                return
            }

            for (let index = 0; index < data.length; index++) {
                if (index == data.length - 1) {
                    data.push([p, i])
                    return
                }

                if (data[index][0] > p) {
                    data.splice(index, 0, [p, i])
                    return
                }
            }
        },

        isEmpty: () => data.length == 0,

        peek: () => data.length == 0 ? null : data[0][1],

        pop: () => data.length == 0 ? null : data.pop()[1],

        size: () => data.length
    }
}

export { Algorithm };