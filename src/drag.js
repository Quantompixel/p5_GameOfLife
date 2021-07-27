//canvas id: #defaultCanvas0
let canvas;

let startY;
let startX;
let scrollLeft;
let scrollTop;
let isDown;

window.onload = function () {
    canvas = document.getElementById("defaultCanvas0");

    init();
}


function init () {
    canvas.addEventListener('mousedown', e => mouseIsDown(e));
    canvas.addEventListener('mouseup', e => mouseUp(e))
    canvas.addEventListener('mouseleave', e => mouseLeave(e));
    canvas.addEventListener('mousemove', e => mouseMove(e));
}


function mouseIsDown(e) {
    isDown = true;
    startY = e.pageY - canvas.offsetTop;
    startX = e.pageX - canvas.offsetLeft;
    scrollLeft = canvas.scrollLeft;
    scrollTop = canvas.scrollTop;
}

function mouseUp(e) {
    //console.log("up");
    isDown = false;
    canvas.style.cursor = "default";
}

function mouseLeave(e) {
    //console.log("leave");
    isDown = false;
    canvas.style.cursor = "default";
}

function mouseMove(e) {
    if (!draggable) {
        return;
    }

    if (isDown) {
        e.preventDefault();
        //Move vertcally
        const y = e.pageY - canvas.offsetTop;
        const walkY = y - startY;
        //canvas.scrollTop = scrollTop - walkY;

        //Move Horizontally
        const x = e.pageX - canvas.offsetLeft;
        const walkX = x - startX;
        //canvas.scrollLeft = scrollLeft - walkX;
        
        window.scrollBy(scrollLeft - walkX, scrollTop - walkY);
        canvas.style.cursor = "grab";
    }
}