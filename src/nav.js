let paintable = false;
let draggable = false;

document.getElementById("paint").addEventListener("click", function () {
    //toggles paint
    paintable = !paintable;

    draggable = false;
});

document.getElementById("drag").addEventListener("click", function () {
    draggable = !draggable;
    paintable = false;
});

document.getElementById("interval").addEventListener("input", function (event) {
    //console.log(Math.floor(event.target.value / 100 * 50));
    updateInterval(Math.floor(event.target.value / 100 * 50));
    //console.log(interval);
});