let highlightedCells = [];

let normalDraw = true;
let lineDrawing = false;
let patterDrawing = false;

// #Pattern
const testPattern = [
    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 1]
];

function keyTyped() {
    // activate normal draw
    if (key === 'p') {
        patterDrawing = false;
        lineDrawing = false;

        normalDraw = !normalDraw;
    }

    // activate pattern drawing
    if (key === 'f') {
        normalDraw = false;
        lineDrawing = false;

        patterDrawing = !patterDrawing;
    }

    // activate line drawing
    if (key === 'l') {
        normalDraw = false;
        patterDrawing = false;

        lineDrawing = !lineDrawing;
    }
}

let mouseReleased = false;
let xLineStart = 0;
let yLineStart = 0;

function draw() {
    //--> clears all highlighted cells
    highlightedCells.forEach((cell) => {
        cell.cancelHighlight();
    })
    highlightedCells = [];

    //--> calculates the cell which the mouse is hovering
    const drawX = Math.floor(mouseX / cellSize);
    const drawY = Math.floor(mouseY / cellSize);

    const drawCell = field.cellArray[drawY][drawX];


    // # PATTERN
    // - prebuild patterns can be placed
    // - LMB to place selected pattern#

    if (patterDrawing) {
        // highlighting
        for (let i = 0; i < testPattern.length; i++) {
            for (let j = 0; j < testPattern[i].length; j++) {
                // read pattern
                if (testPattern[i][j] == 0) {
                    continue;
                }

                // highlight pattern on canvas
                const element = field.cellArray[drawY + i][drawX + j];
                element.highlight();
                highlightedCells.push(element);
            }

        }

        // draw pattern
        if (mouseIsPressed) {
            //draws the highlighted thing on the canvas
            drawHighlightedCells();
        }
    }



    // # NORMAL
    // - freehand drawing
    // - LMB to draw 
    // - RMB to erase

    if (mouseIsPressed && normalDraw) {
        if (typeof drawCell === 'undefined') {
            return;
        }

        if (mouseButton === LEFT) {
            if (drawCell.alive === true) {
                return;
            } else {
                drawCell.changeState();
            }
        }
        if (mouseButton === RIGHT) {
            if (drawCell.alive === false) {
                return;
            } else {
                drawCell.changeState();
            }
        }
    }

    // # LINE
    // - creates straight lines
    // - hold LMB to preview line
    // - release LMB to create new line

    if (mouseIsPressed && lineDrawing) {

        if (xLineStart === 0) {
            xLineStart = mouseX;
            yLineStart = mouseY;
        }

        xLineStart = +Math.floor(xLineStart).toFixed(0);
        yLineStart = +Math.floor(yLineStart).toFixed(0);

        let xEnd = +Math.floor(mouseX).toFixed(0);
        let yEnd = +Math.floor(mouseY).toFixed(0);

        drawLine(xLineStart, yLineStart, xEnd, yEnd);

        mouseReleased = false;

    } else if (mouseReleased === false) {
        mouseReleased = true; // so that it only executes once and simulates mouseReleased()

        let xEnd = +Math.floor(mouseX).toFixed(0);
        let yEnd = +Math.floor(mouseY).toFixed(0);

        drawLine(xLineStart, yLineStart, xEnd, yEnd);

        // makes the last drawn line permanent  
        drawHighlightedCells();

        xLineStart = 0;
        yLineStart = 0;
    }
}

function drawLine(xStart, yStart, xEnd, yEnd) {
    const deltaX = xEnd - xStart;
    const deltaY = yEnd - yStart;

    const k = deltaX === 0 ?
        1 :
        deltaY / deltaX;

    const d = yStart - k * xStart;

    if (xEnd < xStart) {
        const s1 = xStart;
        const e1 = xEnd;
        xEnd = Math.max(s1, e1);
        xStart = Math.min(s1, e1);
    }

    while (xStart < xEnd) {
        let cellY = k * xStart + d;

        let drawX = Math.floor(xStart / cellSize);
        let drawY = Math.floor(cellY / cellSize);

        let drawCell = field.cellArray[drawY][drawX];
        if (typeof drawCell === 'undefined') {
            return;
        }

        drawCell.highlight();
        highlightedCells.push(drawCell);

        // good fix
        xStart += .1;
    }
}

function drawHighlightedCells() {
    highlightedCells.forEach((cell) => {
        cell.alive = true;
        cell.updateColor(true);
    });
    highlightedCells = [];
}