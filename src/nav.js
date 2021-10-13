const paint = document.getElementById("paint");
const drag = document.getElementById("drag");
const start = document.getElementById("start");
const clean = document.getElementById("clean");
const slider = document.getElementById("slider");

let paintButtons = [];

import * as Timer from './modules/interval.js';

Timer.createInterval(30, () => {
    requestAnimationFrame(() => {
        field.update();
    })
});

setupPaintButtons();

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

function setupPaintButtons () {
    for (const specialFunc of specialFunctions) {
        let button = document.createElement("BUTTON");
        button.innerHTML = specialFunc.name;
        button.classList.add("paintButton");
    
        const navbar = document.getElementById("navbar");
        navbar.insertBefore(button, navbar.childNodes[0]);

        paintButtons.push(button);
    }

    // deactivatePaintButtons();
}


function activatePaintButtons () {
    for (const button of paintButtons) {
        button.style.display = "inline-block";
    }
}

function deactivatePaintButtons () {
    for (const button of paintButtons) {
        button.style.display = "none";
    }
}


// disables paint when hovering buttons
const controlButtons = document.querySelectorAll("nav .controlButton");
controlButtons.forEach(element => {
    element.addEventListener("mouseenter", () => {
        paintable = false;
    });

    element.addEventListener("mouseout", () => {
        if (paint.classList.contains("active")) {
            paintable = true;
        }
    });
});