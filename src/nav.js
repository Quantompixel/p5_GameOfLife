let paintable = true;
let draggable = false;

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

document.getElementById("interval").addEventListener("input", function (event) {
    //console.log(Math.floor(event.target.value / 100 * 50));
    updateInterval(Math.floor(event.target.value / 100 * 50));
    //console.log(interval);
});

//disables paint when hovering buttons
const controlButtons = document.querySelectorAll("nav .controlButton");
controlButtons.forEach(element => {
    let before = paintable;

    element.addEventListener("mouseenter", () => {
        paintable = false;
    });

    //element.addEventListener("mouseleave", (event) => {
    //    paintable = before;
    //});
});

console.log(controlButtons[0]);