import { Slider } from "./slider";
import { Solver } from "./solver";
import { BlankTileAlgorithm } from "./algorithm/BlankTileAlgorithm";
import { TrivialTileAlgorithm } from "./algorithm/TrivialTileAlgorithm";

var setOfFinishedTiles: Set<string> = new Set();
var travelledNodes: number = 0;

function main() {

    console.log(" Starting test ");

    // var boardString9 = "cgbahedf#";
    // var boardString9 = "cgbaefdh#";
    // var boardString9 = "acbg#fdeh"

    // var boardString9 = "cgb#aedhf";

    var boardString9 = "tjmuqalwbvnkofhdcspeirxg#";
    // var boardString9 = "tjmuqalwbvn#ofhdkspeicrxg";
    // var boardString9 = "abtmql#juvnowfhdkspeicrxg";
    // var boardString9 = "abctqlj#mvkofuhnswpedirxg";

    // var boardString9 = "abclujo#wqntfmvdskphirxge";
    // var boardString9 = "abcdefghijklmnopqtsruv#xw";
    var slider9 = new Slider(boardString9);

    // var solver = new Solver(slider9);
    // solver.solve();

    console.time("Time to solve");
    var blankTileAlgorithm = new BlankTileAlgorithm(slider9, "a");
    var state0 = blankTileAlgorithm.traverseToGoal();
    travelledNodes += blankTileAlgorithm.nodesTravelled;


    var stepList = [
        ["a"],
        ["b"],
        ["c"],
        ["f"],
        ["g"],
        ["h"],
        ["k"],
        ["l"],
        ["m"],
        ["d", "e"],
        ["i", "j"],
        ["n", "o"],
        ["p", "u"],
        ["q", "v"],
        ["r", "s", "w", "x", "t"],
    ];

    stepList.forEach(step => {
        var result = solveTrivialNext(state0, step);
        state0 = result;
    });

    console.timeEnd("Time to solve");

    state0.printAllParents();
    console.log("Travelled nodes: " + travelledNodes);



    // Convert numbers into sliders for testing
    // convertNumberArrayToSliderString([20, 10, 13, 21, 17, 1, 12, 23, 2, 22, 14, 11, 15, 6, 8, 4, 3, 19, 16, 5, 9, 18, 24, 7]);


}

function solveTrivialNext(slider: Slider, tiles: string[]) {
    var trivialTileAlgorithm = new TrivialTileAlgorithm(slider, tiles, setOfFinishedTiles);
    var result = trivialTileAlgorithm.traverseToGoal();
    tiles.forEach(tile => {
        setOfFinishedTiles.add(tile);
    });

    travelledNodes += trivialTileAlgorithm.nodesTravelled;
    return result;
}



function convertNumberArrayToSliderString(array) {
    var sliderString = "";
    array.forEach(element => {
        sliderString += String.fromCharCode("a".charCodeAt(0) + element - 1);
    });

    console.log(sliderString);
}


export { main };