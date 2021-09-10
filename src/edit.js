let paintable = true;
let dragable = false;

let highlightedCells = [];

let specialFunctions = [];

let startOfTouch = {
    x: undefined,
    y: undefined
}

let endOfTouch = {
    x: undefined,
    y: undefined
}

// #Pattern
const testPattern = [
    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 1]
];

/** 
 * 
 * @constructor
 * @param {hotkey} Key that activates the specialfunction
 * @param {drawFunc} Callback-function that highlights
 */
class specialFunction {
    constructor(hotkey, drawFunc) {
        this.hotkey = hotkey;
        this.drawFunc = drawFunc;
        this.isDeactivated = true;

        specialFunctions.push(this);
    }

    update() {
        clearAllHighlights();

        if (!paintable) {
            return;
        }

        if (!this.isDeactivated) {
            this.drawFunc();
        }
    }

    draw() {
        if (!paintable) {
            return;
        }

        if (!this.isDeactivated) {
            makeHighlightsPermanent();
        }
    }

    deactivate() {
        this.isDeactivated = true;
        clearAllHighlights();
    }

    activate() {
        this.isDeactivated = false;
    }
}

function keyTyped() {
    specialFunctions.forEach((func) => {
        func.deactivate();
        if (func.hotkey === key) {
            func.activate();
        }
    });
}

const lineFunc = new specialFunction('l', () => {
    drawLine(startOfTouch.x, startOfTouch.y, endOfTouch.x, endOfTouch.y);
});

const formFunc = new specialFunction('f', drawForm);

const normalFunc = new specialFunction('p', () => {
    let cell = getCellFromScreenPosition(mouseY, mouseX);
    cell.alive = true;
    cell.updateColor(true);
});


function mousePressed() {
    startOfTouch.x = mouseX;
    startOfTouch.y = mouseY;

    formFunc.draw();
}

function mouseReleased() {
    endOfTouch.x = mouseX;
    endOfTouch.y = mouseY;

    lineFunc.draw();
}

function mouseDragged() {
    endOfTouch.x = mouseX;
    endOfTouch.y = mouseY;

    lineFunc.update();
    normalFunc.isDeactivated ? null : normalFunc.update();
}

function mouseMoved() {
    formFunc.update();
}


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
};

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

function clearAllHighlights() {
    highlightedCells.forEach((cell) => {
        cell.cancelHighlight();
        highlightedCells = [];
    });
}

function makeHighlightsPermanent() {
    highlightedCells.forEach((cell) => {
        cell.alive = true;
        cell.updateColor(true);
    });
}