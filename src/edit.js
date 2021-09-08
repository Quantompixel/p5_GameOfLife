let paintable = true;
let dragable = false;

let highlightedCells = [];

let normalDraw = true;
let lineDrawing = false;
let formDrawing = false;

// #Pattern
const testPattern = [
    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 1]
];

function drawForm() {
    const gridX = Math.floor(mouseX / cellSize);
    const gridY = Math.floor(mouseY / cellSize);

    for (let i = 0; i < testPattern.length; i++) {
        for (let j = 0; j < testPattern[i].length; j++) {
            // read pattern
            if (testPattern[i][j] === 0) {
                continue;
            }

            // draw pattern on canvas
            const element = field.cellArray[gridY + i][gridX + j];
            highlight(element);
        }
    }
}

function drawLine(xStart, yStart, xEnd, yEnd) {
    let startCell = getCellFromScreenPosition(yStart, xStart);
    let endCell = getCellFromScreenPosition(yEnd, xEnd);
    const minCellY = Math.floor(Math.min(yStart, yEnd) / cellSize);
    const maxCellY = Math.floor(Math.max(yStart, yEnd) / cellSize);
    if (startCell.x > endCell.x) {
        [startCell, endCell] = [endCell, startCell];
    }

    const deltaY = endCell.y - startCell.y;
    const deltaX = endCell.x - startCell.x;

    if (deltaX === 0) {
        for (let cellY = minCellY; cellY <= maxCellY; cellY++) {
            highlight(getCellFromIndex(cellY, startCell.x));
        }
    } else {
        const yIncrementPerCell = deltaY / deltaX;
        for (let x = 0, y = startCell.y; x <= deltaX; x++, y += yIncrementPerCell) {
            //Simple: not more than one cell on the y axis
            if (Math.abs(yIncrementPerCell) <= 1) {
                highlight(getCellFromIndex(Math.floor(y), startCell.x + x));
            } else {
                let start = y - yIncrementPerCell;
                let end = y;
                if (start > end) {
                    [start, end] = [end, start];
                }
                for (let cellY = start; cellY <= end && cellY >= minCellY && cellY <= maxCellY; cellY++) {
                    highlight(getCellFromIndex(Math.floor(cellY), startCell.x + x));
                }
            }
        }
    }

    highlight(startCell);
    highlight(endCell);
}

function keyTyped() {
    switch (key) {
        case 'p':
            normalDraw = true;
            lineDrawing = false;
            formDrawing = false;
            break;
        case 'l':
            lineDrawing = true;
            normalDraw = false;
            formDrawing = false;
            break;
        case 'f':
            formDrawing = true;
            normalDraw = false;
            lineDrawing = false;
            break;
    }
}

let startOfTouch = {
    x: undefined,
    y: undefined
}

let endOfTouch = {
    x: undefined,
    y: undefined
}

function mousePressed() {
    startOfTouch.x = mouseX;
    startOfTouch.y = mouseY;

    update(true);
}

function mouseReleased() {
    endOfTouch.x = mouseX;
    endOfTouch.y = mouseY;

    update(true);
}

function mouseDragged() {
    endOfTouch.x = mouseX;
    endOfTouch.y = mouseY;

    // Only updates if the mouse enters a new cell has changed 
    // -> not multiple times a second like draw()
    if (mouseX % cellSize === 0 || mouseY % cellSize === 0) {
        endOfTouch.x = mouseX;
        endOfTouch.y = mouseY;

        update();
    }
}

function mouseMoved() {
    if (mouseX % cellSize === 0 || mouseY % cellSize === 0) {
        if (formDrawing) {
            update();
        }
    }
}

/** 
 * Update is called everytime the mouse enters a new cell
 * @param {Boolean} drawOnNextFrame if set to TRUE the next update will draw the highlighted cells
 */
function update(drawOnNextFrame = false) {
    if (!paintable) {
        return;
    }

    highlightedCells.forEach((cell) => {
        cell.cancelHighlight();
        highlightedCells = [];
    });
    //--> clears all highlighted cells

    // - here - implement switch case which defines which of the drawing functions should be activated
    if (normalDraw) {
        let drawCell = getCellFromScreenPosition(mouseY, mouseX);
        drawCell.alive = true;
        drawCell.updateColor(true);
        return;
    }

    if (lineDrawing) {
        drawLine(startOfTouch.x, startOfTouch.y, endOfTouch.x, endOfTouch.y);

        if (drawOnNextFrame) {
            makeHighlightsPermanent();
        }
        return;
    }

    if (formDrawing) {
        drawForm();

        if (drawOnNextFrame) {
            makeHighlightsPermanent();
        }
    }


}

/**
 * @param {Cell} cell the cell to highlight
 */
function highlight(cell) {
    cell.highlight();
    highlightedCells.push(cell);
}

/**
 * Returns the cell with the given coordinates on screen
 * @param {Number} yPos the Cells y position
 * @param {Number} xPos the Cells x position
 * @returns {Cell} the cell
 */
function getCellFromScreenPosition(yPos, xPos) {
    return field.cellArray[Math.floor(yPos / cellSize)][Math.floor(xPos / cellSize)];
}

/**
 * Returns the cell with the given indexes
 * @param {Number} yPos the Cells y index
 * @param {Number} xPos the Cells x index
 * @returns {Cell} the cell
 */
function getCellFromIndex(yPos, xPos) {
    const col = field.cellArray[yPos];
    if (col) {
        return col[xPos];
    } else {
        return undefined;
    }
}

function makeHighlightsPermanent() {
    highlightedCells.forEach((cell) => {
        cell.alive = true;
        cell.updateColor(true);
    });
}