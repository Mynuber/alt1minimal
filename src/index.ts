// http://runeapps.org/apps/alt1/alt1api.html
//alt1 base libs, provides all the commonly used methods for image matching and capture
//also gives your editor info about the window.alt1 api
import * as a1lib from "@alt1/base";
import { ImgRef } from "@alt1/base";
import { Slider } from "./slider";
import { main } from "./testing/main";

//tell webpack to add index.html and appconfig.json to output
require("!file-loader?name=[name].[ext]!./index.html");
require("!file-loader?name=[name].[ext]!./appconfig.json");


var output = document.getElementById("output");

// Constants Sliders
const BASE_SLIDER_SIZE = 245;
const SLIDER_WIDTH = 5;
const SLIDER_HEIGHT = 5;
const TOTAL_TILES = (SLIDER_WIDTH * SLIDER_HEIGHT) - 1;
const MIDDLE_TILE_INDEX = TOTAL_TILES / 2
const ONLINE_WEB_SHUFFLER_ERROR = -3; // 3px error in online web shuffler due to the way it is rendered
const TILE_SIZE = (BASE_SLIDER_SIZE / SLIDER_WIDTH) + ONLINE_WEB_SHUFFLER_ERROR;

const TOTAL_NUMBER_OF_SLIDERS = 27;

const CHARACTER_MAPPING = "abcdefghijklmnopqrstuvwx#"

// Load all the base sliders into memory
var base_sliders_tiles = {};
convertBaseSlidersToTiles(); //I absolutely despise how I did this. needs some javascript expertise to load the tiles more cleanly.

ImageData.prototype.show.maxImages = 100;

async function getAllBaseSliders() {
	var base_sliders = {};
	for (var i = 0; i < TOTAL_NUMBER_OF_SLIDERS; i++) {
		base_sliders[i] = require("./base_sliders/base_sliders_unnamed/" + i + ".data.png");
	}

	base_sliders = await a1lib.ImageDetect.webpackImages(base_sliders).promise;

	return base_sliders;
}

async function convertBaseSlidersToTiles() {
	var base_sliders = await getAllBaseSliders()

	for (var i = 0; i < TOTAL_NUMBER_OF_SLIDERS; i++) {
		base_sliders_tiles[i] = splitSliderIntoTiles(base_sliders[i]);
	}
}

function splitSliderIntoTiles(base_slider) {
	// Remove weird logic for tile_shift after we don't need to use the online web shuffler. This was only added to account for the 3px error in the online web shuffler.
	var tiles = [];
	var tile_shift = TILE_SIZE - ONLINE_WEB_SHUFFLER_ERROR;
	for (var i = 0; i < SLIDER_WIDTH; i++) {
		for (var j = 0; j < SLIDER_HEIGHT; j++) {
			var tile = new ImageData(TILE_SIZE, TILE_SIZE);
			base_slider.copyTo(tile, (j * tile_shift) + 1, (i * tile_shift) + 1, TILE_SIZE, TILE_SIZE, 0, 0);
			// tile.show(49 * i, 49 * j); //debug line
			tiles.push(tile);
		}
	}
	// remove last tile, which is the empty tile
	tiles.pop();
	return tiles;
}


//listen for pasted (ctrl-v) images, usually used in the browser version of an app
a1lib.PasteInput.listen(img => {
	enterSolverLogic(img);
}, (err, errid) => {
	output.insertAdjacentHTML("beforeend", `<div><b>${errid}</b>  ${err}</div>`);
});

//You can reach exports on window.TEST because of
//config.makeUmd("testpackage", "TEST"); in webpack.config.ts
export function capture() {
	if (!window.alt1) {
		output.insertAdjacentHTML("beforeend", `<div>You need to run this page in alt1 to capture the screen</div>`);
		return;
	}
	if (!alt1.permissionPixel) {
		output.insertAdjacentHTML("beforeend", `<div>Page is not installed as app or capture permission is not enabled</div>`);
		return;
	}
	var img = a1lib.captureHoldFullRs();
	enterSolverLogic(img);
}

//check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {
	//tell alt1 about the app
	//this makes alt1 show the add app button when running inside the embedded browser
	//also updates app settings if they are changed
	alt1.identifyAppUrl("./appconfig||.json");
}

function findBaseSlider(img) {
	// for each base slider, find the middle of the slider.
	var sliderIndex = findBaseSliderIndex(img);
	if (sliderIndex == null) {
		output.insertAdjacentHTML("beforeend", `<div>Could not find base slider</div>`);
		return;
	}
	output.insertAdjacentHTML("beforeend", `<div>Found base slider: ${sliderIndex}</div>`);

	// Debug code to display the base slider tile and puzzle we matched. 
	base_sliders_tiles[sliderIndex][MIDDLE_TILE_INDEX].show(200, 200);
	base_sliders_tiles[sliderIndex].forEach((tile, index) => {
		tile.show(300 + ((index % SLIDER_WIDTH) * TILE_SIZE), 300 + (Math.floor(index / SLIDER_WIDTH) * TILE_SIZE));
	});
	return base_sliders_tiles[sliderIndex];
}

// iterate through sliders checking middle against the image.
function findBaseSliderIndex(img) {
	for (var i = 0; i < TOTAL_NUMBER_OF_SLIDERS; i++) {
		var tile = base_sliders_tiles[i][MIDDLE_TILE_INDEX];
		var loc = img.findSubimage(tile);
		console.log("found base slider at: " + JSON.stringify(loc));
		if (loc.length != 0) {
			return i;
		}
	}
	return null;
}

function createMapping(tiles, img) {
	// Find location of each tile in the image.
	var mapping = [];
	for (var i = 0; i < tiles.length; i++) {
		var loc = img.findSubimage(tiles[i]);
		if (loc.length != 0) {
			mapping.push(loc[0]);
		} else {
			mapping.push(null);
		}
	}
	// if the mapping is not complete, we can't solve the puzzle.
	if (mapping.includes(null) || mapping.length != tiles.length) {
		output.insertAdjacentHTML("beforeend", `<div>Could not find all tiles</div>`);
		return;
	}

	// find min x and min y
	var minX = mapping[0].x;
	var minY = mapping[0].y;
	for (var i = 0; i < mapping.length; i++) {
		if (mapping[i].x < minX) {
			minX = mapping[i].x;
		}
		if (mapping[i].y < minY) {
			minY = mapping[i].y;
		}
	}
	minX = Math.floor(minX / TILE_SIZE);
	minY = Math.floor(minY / TILE_SIZE);

	// create empty 5x5 array
	var grid = [];
	for (var i = 0; i < SLIDER_WIDTH; i++) {
		grid.push([]);
		for (var j = 0; j < SLIDER_WIDTH; j++) {
			grid[i].push(null);
		}
	}


	for (var i = 0; i < mapping.length; i++) {
		grid[Math.floor((mapping[i].y / TILE_SIZE) - minY)][Math.floor((mapping[i].x / TILE_SIZE) - minX)] = i;
	}
	// normalize the location string
	console.log(grid);

	// replace the index with the character mapping
	var indexMapping = [];
	for (var i = 0; i < grid.length; i++) {
		for (var j = 0; j < grid[i].length; j++) {
			var index = grid[i][j];
			if (index == null) {
				index = 24;
			}
			indexMapping.push(CHARACTER_MAPPING[index]);
		}
	}
	// console.log(indexMapping);

	return indexMapping.join("");

}

function solveSlider(mapping) {
	var board = new Slider(mapping);

	// var solution = board.solve(); TODO: Fix this.
}



function enterSolverLogic(img: ImgRef) {
	// We will want to split this up into a few parts to make it easier to develop.
	// 1. Find the type of slider we want to use. We can do this by using the middle of the slider. They should be unique enough. 
	var tiles = findBaseSlider(img);
	// 2. Create a mapping of the image given to some representation of the slider. 
	var mapping = createMapping(tiles, img);
	// 3. Solve the slider :)
	var solution = solveSlider(mapping);
}


output.insertAdjacentHTML("beforeend", `
	<div>paste an image of rs with homeport button (or not)</div>
	<div onclick='TEST.capture()'>Click to capture if on alt1</div>`
);


export function testPrint() {
	main();
}
