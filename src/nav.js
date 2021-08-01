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

document.getElementById("drag").addEventListener("click", function() {
    draggable = !draggable;
    paintable = false;

    document.getElementById("paint").classList.remove("active");
    document.getElementById("drag").classList.remove("active");
    if (draggable) {
        document.getElementById("drag").classList.add("active");
    }
});

