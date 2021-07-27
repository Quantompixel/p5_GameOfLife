let paintable = false;
let draggable = false;

document.getElementById("paint").addEventListener("click", function () {
    //toggles paint
    paintable = !paintable;
    
    draggable = false;
});

document.getElementById("drag").addEventListener("click", function() {
    draggable = !draggable;
    paintable = false;
});

