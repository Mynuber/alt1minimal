import { Slider, SliderMove } from "../slider";

class PseudoBoard {
    slider: Slider;

    constructor(slider: Slider) {
        this.slider = new Slider(slider.getSliderString());
    }




}

export { PseudoBoard };