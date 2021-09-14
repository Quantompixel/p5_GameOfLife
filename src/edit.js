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
 * Class to create special-draw-functions
 * @constructor
 * @param {String} hotkey hotkey that activates the specialfunction
 * @param {Function} drawFunc Callback-function that highlights
 */
class specialFunction {
    constructor(hotkey, drawFunc) {
        this.hotkey = hotkey;
        this.drawFunc = drawFunc;
        this.isDeactivated = true;

        specialFunctions.push(this);
    }

    update() {
        if (!paintable) {
            return;
        }
        if (!this.isDeactivated) {
            clearAllHighlights();
            this.drawFunc();
        }
    }

    draw() {
        if (!paintable) {
            return;
        }

        if (!this.isDeactivated) {
            // erase on right mouseButton
            if (mouseButton === RIGHT) {
                eraseHighlights();
                return;
            }

            // draw on left mouseButton
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

const rectFunc = new specialFunction('r', () => {
    drawRect(startOfTouch.x, startOfTouch.y, endOfTouch.x, endOfTouch.y);
});

const circleFunc = new specialFunction('c', () => {
    const deltaXX = endOfTouch.x - startOfTouch.x;
    const deltyYY = endOfTouch.y - startOfTouch.y;
    const radius = Math.sqrt(deltaXX * deltaXX + deltyYY * deltyYY) / cellSize;
    drawCircle(getCellFromScreenPosition(startOfTouch.y, startOfTouch.x), radius);
});

const formFunc = new specialFunction('f', () => {
    drawForm(testPattern);
});

const normalFunc = new specialFunction('p', () => {
    let cell = getCellFromScreenPosition(mouseY, mouseX);

    switch (mouseButton) {
        case RIGHT:
            cell.alive = false;
            cell.updateColor(false);
            break;
        case LEFT:
            cell.alive = true;
            cell.updateColor(true);
            break;
    }
});
normalFunc.activate();


function mousePressed() {
    startOfTouch.x = mouseX;
    startOfTouch.y = mouseY;

    formFunc.draw();
}

function mouseReleased() {
    endOfTouch.x = mouseX;
    endOfTouch.y = mouseY;

    lineFunc.draw();
    rectFunc.draw();
    circleFunc.draw();
}

function mouseDragged() {
    endOfTouch.x = mouseX;
    endOfTouch.y = mouseY;

    lineFunc.update();
    rectFunc.update();
    circleFunc.update();

    normalFunc.isDeactivated
        ? null
        : normalFunc.update();
}

function mouseMoved() {
    formFunc.update();
}


function drawForm(arr) {
    const gridX = Math.floor(mouseX / cellSize);
    const gridY = Math.floor(mouseY / cellSize);

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            // read pattern
            if (arr[i][j] === 0) {
                continue;
            }

            // draw pattern on canvas
            const element = field.cellArray[gridY + i][gridX + j];
            highlight(element);
        }
    }
}

function drawLine(xStart, yStart, xEnd, yEnd) {
    console.log(`xStart: ${xStart}  yStart: ${yStart}  xEnd: ${xEnd}  yEnd: ${yEnd}`);
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
 * Given the formula
 * <pre>
 *     x*x + y*y = r*r
 * Starting at x = radius, y = 0
 * For each neighbour:
 *      deviation = radius*radius - (neighbor.x*neighbor.x + neighbor.y*neighbor.y)
 * Select neighbour with smallest deviation and not last cell
 * Repeat until selected neighbor is the start cell
 * </pre>

 * @param {Cell} startCell
 * @param {number} radius
 */
function drawCircle(startCell, radius) {
    const value = radius * radius;
    const max = 2 * radius * 3; //Rounding PI

    let lastCell = undefined;
    let currentCell = getCellFromIndex(startCell.y, startCell.x + Math.floor(radius));
    let index = 0;
    do {
        let neighbours = currentCell.getNeighbors();
        neighbours = neighbours.map(cell => {
            let yd = cell.y - startCell.y;
            let xd = cell.x - startCell.x;
            const dev = Math.abs(value - (xd * xd + yd * yd));
            return {
                cell: cell,
                deviation: dev
            };
        }).sort((a, b) => {
            return a.deviation - b.deviation;
        });
        let nextCell;
        do {
            nextCell = neighbours.shift().cell;
        } while (nextCell === lastCell);

        highlight(currentCell);

        lastCell = currentCell;
        currentCell = nextCell;
    } while (!currentCell.equals(startCell) && index++ < max && currentCell);


}

function drawRect(xStart, yStart, xEnd, yEnd) {
    drawLine(xStart, yStart, xEnd, yStart);
    drawLine(xEnd, yStart, xEnd, yEnd);
    drawLine(xStart, yEnd, xEnd, yEnd);
    drawLine(xStart, yStart, xStart, yEnd);
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

function eraseHighlights() {
    highlightedCells.forEach((cell) => {
        cell.alive = false;
        cell.updateColor(false);
    });
}