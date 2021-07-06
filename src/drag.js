//canvas id: #defaultCanvas0

const canvas = document.getElementsByTagName("canvas")[0];

let startY;
let startX;
let scrollLeft;
let scrollTop;
let isDown;

canvas.addEventListener('mousedown', e => mouseIsDown(e));
canvas.addEventListener('mouseup', e => mouseUp(e))
canvas.addEventListener('mouseleave', e => mouseLeave(e));
canvas.addEventListener('mousemove', e => mouseMove(e));

function mouseIsDown(e) {
    isDown = true;
    startY = e.pageY - canvas.offsetTop;
    startX = e.pageX - canvas.offsetLeft;
    scrollLeft = canvas.scrollLeft;
    scrollTop = canvas.scrollTop;
}

function mouseUp(e) {
    console.log("up");
    isDown = false;
}

function mouseLeave(e) {
    console.log("leave");
    isDown = false;
}

function mouseMove(e) {
    console.log("move");
    if (isDown) {
        e.preventDefault();
        //Move vertcally
        const y = e.pageY - container.offsetTop;
        const walkY = y - startY;
        canvas.scrollTop = scrollTop - walkY;

        //Move Horizontally
        const x = e.pageX - container.offsetLeft;
        const walkX = x - startX;
        canvas.scrollLeft = scrollLeft - walkX;

    }
}