const paint = document.getElementById("paint");
const drag = document.getElementById("drag");
const start = document.getElementById("start");
const clean = document.getElementById("clean");
const slider = document.getElementById("slider");

let paintButtons = [];
specialFunctions.forEach((element) => {
    paintButtons.push(element.button);
});

import * as Timer from './modules/interval.js';

Timer.createInterval(30, () => {
    requestAnimationFrame(() => {
        field.update();
    })
});


paint.addEventListener("click", () => {
    // toggles painting
    if (paint.classList.contains("active")) {
        paintable = false;
        deactivatePaintButtons();

        paint.classList.remove("active");
    } else {
        paintable = true;
        dragable = false;
        activatePaintButtons();

        paint.classList.add("active");
        drag.classList.remove("active");
    }
});

drag.addEventListener("click", () => {
    // toggles dragging
    if (drag.classList.contains("active")) {
        dragable = false;

        drag.classList.remove("active");
    } else {
        dragable = true;
        paintable = false;
        deactivatePaintButtons();

        drag.classList.add("active");
        paint.classList.remove("active");
    }
});

clean.addEventListener("click", () => {
    start.innerHTML = "start";
    Timer.stop();
    field.init();
});

start.addEventListener("click", () => {
    if (Timer.running === false) {
        Timer.start();

        start.classList.add("active");
    } else {
        Timer.stop();

        start.classList.remove("active");
    }
});

slider.addEventListener("input", (event) => {
    //console.log(event.target.value);
    Timer.updateTimeout(event.target.value);
});

function activatePaintButtons() {
    for (const button of paintButtons) {
        button.style.display = "inline-block";
    }
}

function deactivatePaintButtons() {
    for (const button of paintButtons) {
        button.style.display = "none";
    }
}


// disables paint when hovering buttons
const controlButtons = document.querySelectorAll("nav .controlButton");
protectButtons(controlButtons);
protectButtons(paintButtons);

/**
 * Disables painting when hovering over buttons.
 * @param {Array} buttonArray 
 */
function protectButtons(buttonArray) {
    buttonArray.forEach(element => {
        element.addEventListener("mouseenter", () => {
            paintable = false;
        });

        element.addEventListener("mouseout", () => {
            if (paint.classList.contains("active")) {
                paintable = true;
            }
        });
    });
}