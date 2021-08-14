let paintable = true;
let draggable = false;

const timer = new Interval(500, () => {
    field.update();
});

document.getElementById("paint").addEventListener("click", function () {
    //toggles paint
    paintable = !paintable;

    draggable = false;

    document.getElementById("drag").classList.remove("active");
    document.getElementById("paint").classList.remove("active");

    if (paintable) {
        document.getElementById("paint").classList.add("active");
    }
});

document.getElementById("drag").addEventListener("click", function () {
    draggable = !draggable;
    paintable = false;

    document.getElementById("paint").classList.remove("active");
    document.getElementById("drag").classList.remove("active");
    if (draggable) {
        document.getElementById("drag").classList.add("active");
    }
});

document.getElementById("clean").addEventListener("click", function () {
    document.getElementById("start").innerHTML = "start";
    timer.stop();
    field.init();
});

document.getElementById("start").addEventListener("click", function (event) {
    if (timer.running === false) {
        timer.start();
    } else {
        timer.stop();
    }
});

document.getElementById("interval").addEventListener("mouseup", function (event) {
    console.log(event.target.value);
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