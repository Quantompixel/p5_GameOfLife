let paintable = true;
let draggable = false;

const paint = document.getElementById("paint");
const drag = document.getElementById("drag");
const start = document.getElementById("start");
const clean = document.getElementById("clean");
const slider = document.getElementById("slider");

const timer = new Interval(30, () => {
    field.update();
});

paint.addEventListener("click", () => {
    //toggles painting
    if (paint.classList.contains("active")) {
        paintable = false;

        paint.classList.remove("active");
    } else {
        paintable = true;
        draggable = false;

        paint.classList.add("active");
        drag.classList.remove("active");
    }
});

drag.addEventListener("click", () => {
    //toggles dragging
    if (drag.classList.contains("active")) {
        draggable = false;

        drag.classList.remove("active");
    } else {
        draggable = true;
        paintable = false;

        drag.classList.add("active");
        paint.classList.remove("active");
    }
});

clean.addEventListener("click", () => {
    start.innerHTML = "start";
    timer.stop();
    field.init();
});

start.addEventListener("click", () => {
    if (timer.running === false) {
        timer.start();

        start.classList.add("active");
    } else {
        timer.stop();

        start.classList.remove("active");
    }
});

slider.addEventListener("input", function (event) {
    //console.log(event.target.value);
    timer.updateTimeout(event.target.value);
});


//disables paint when hovering buttons
const controlButtons = document.querySelectorAll("nav .controlButton");
controlButtons.forEach(element => {
    let before = paintable;

    element.addEventListener("mouseenter", () => {
        paintable = false;
    });
});


function Interval(interval, func) {
    this.interval = interval;
    this.func = func;
    this.running = false;

    this.timeout = () => {
        if (this.running === true) {
            setTimeout((this.loop), this.interval);
        }
    }

    this.loop = () => {
        this.func();
        this.timeout();
    }

    this.start = () => {
        this.running = true;
        this.loop();
    }

    this.stop = () => {
        this.running = false;
    }

    this.updateTimeout = (interval) => {
        this.interval = interval;
    }
}