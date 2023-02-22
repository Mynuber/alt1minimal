import { Slider } from "./slider";
import { Solver } from "./solver";
import { BlankTileAlgorithm } from "./algorithm/BlankTileAlgorithm";


function main() {

    console.log(" Starting test ");

    // var boardString9 = "cgbahedf#";
    // var boardString9 = "cgbaefdh#";
    // var boardString9 = "acbg#fdeh"

    // var boardString9 = "cgb#aedhf";

    var boardString9 = "tjmuqalwbvnkofhdcspeirxg#";
    // var boardString9 = "abclujo#wqntfmvdskphirxge";
    var slider9 = new Slider(boardString9);

    // slider9.printSliderStringAsMultiLine();

    // var solver = new Solver(slider9);
    // solver.solve();

    var blankTileAlgorithm = new BlankTileAlgorithm(slider9, "a");
    blankTileAlgorithm.traverseToGoal();
    // Convert numbers into sliders for testing
    // convertNumberArrayToSliderString([20, 10, 13, 21, 17, 1, 12, 23, 2, 22, 14, 11, 15, 6, 8, 4, 3, 19, 16, 5, 9, 18, 24, 7]);


}


function convertNumberArrayToSliderString(array) {
    var sliderString = "";
    array.forEach(element => {
        sliderString += String.fromCharCode("a".charCodeAt(0) + element - 1);
    });

    console.log(sliderString);
}


export { main };