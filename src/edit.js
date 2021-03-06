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

let selectedPattern = [];

/** 
 * Class to create special-draw-functions
 * @constructor
 * @param {String} name hotkey that activates the specialfunction
 * @param {String} hotkey hotkey that activates the specialfunction
 * @param {Function} drawFunc Callback-function that highlights
 * @param {Function} finalFunc Callback-function that is called when the function draws
 */
class specialFunction {
    constructor(name, hotkey, drawFunc, finalFunc = () => {return}, setupButton = () => {return}) {
        for (const func in specialFunctions) {
            if (func.name === name) {
                console.log("DrawFunction name already exists!");
                return;
            }
            if (func.hotkey === hotkey) {
                console.log("This hotkey already exists!");
                return;
            }
        }

        this.name = name;
        this.hotkey = hotkey;
        this.drawFunc = drawFunc;
        this.isDeactivated = true;
        this.finalFunc = finalFunc;
        this.setupButton = setupButton;
        this.button

        specialFunctions.push(this);
        this.createButton();
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

        this.finalFunc();

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

    createButton() {
        const button = document.createElement("BUTTON");
        button.innerHTML = this.name;
        button.classList.add("paintButton");
        button.id = this.name;

        const navbar = document.getElementById("paintbar");
        // navbar.insertBefore(button, navbar.childNodes[0]);
        navbar.appendChild(button);

        button.addEventListener("click", () => {
            switchSpecialFunction(this.name);
        });

        this.button = button;

        this.setupButton();
    }
}

function keyTyped() {
    specialFunctions.forEach((func) => {
        if (func.hotkey === key) {
            switchSpecialFunction(func.name);
        }
    });
    // switchSpecialFunction();
}

const lineFunc = new specialFunction("Line", 'l', () => {
    drawLine(startOfTouch.x, startOfTouch.y, endOfTouch.x, endOfTouch.y);
});

const rectFunc = new specialFunction("Rect", 'r', () => {
    drawRect(startOfTouch.x, startOfTouch.y, endOfTouch.x, endOfTouch.y);
});

const circleFunc = new specialFunction("Circle", 'c', () => {
    const deltaXX = endOfTouch.x - startOfTouch.x;
    const deltyYY = endOfTouch.y - startOfTouch.y;
    const radius = Math.sqrt(deltaXX * deltaXX + deltyYY * deltyYY) / cellSize;
    drawCircle(getCellFromScreenPosition(startOfTouch.y, startOfTouch.x), radius);
});

const formFunc = new specialFunction("Pattern", 'p', () => {
    drawForm(selectedPattern);
},undefined ,() => {
    const input = document.createElement("input");
    input.id = "patternInput";
    input.placeholder = "load...";
    document.getElementById("Pattern").appendChild(input);

    input.addEventListener("keydown", (e) => {
        switch(e.key)  {
            case 'Enter':
                if (e.target.value !== "") {
                    loadPattern(input.value);
                }

                input.value = "";
                break;

            case 'Escape':
                input.value = "";

                break;
        }
    });
});

const normalFunc = new specialFunction("Normal", 'n', () => {
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

const selectFunc = new specialFunction("Select", 's', () => {
    drawRect(startOfTouch.x, startOfTouch.y, endOfTouch.x, endOfTouch.y);
}, () => {

    const area = {
        start: {
            x: Math.floor(startOfTouch.x / cellSize),
            y: Math.floor(startOfTouch.y / cellSize)
        },
        end: {
            x: Math.floor(endOfTouch.x / cellSize),
            y: Math.floor(endOfTouch.y / cellSize)
        }
    }

    const selectInput = document.getElementById("selectionInput");
    selectInput.style.visibility = "visible";

    selectInput.style.top = (startOfTouch.y - 20) + "px";
    selectInput.style.left = (startOfTouch.x - 20) + "px";
    paintable = false;

    selectInput.addEventListener("keydown", (e) => {
        switch(e.key)  {
            case 'Enter':
                if (e.target.value !== "") {
                    savePattern(area.start.x, area.start.y, area.end.x, area.end.y, e.target.value);
                }

                selectInput.style.visibility = "hidden";
                selectInput.value = "";
                paintable = true;
                break;
            case 'Delete':
                for (let y = area.start.y; y <= area.end.y; y++) {
                    for (let x = area.start.x; x <= area.end.x; x++) {
                        const cell = getCellFromIndex(y,x);
                        cell.alive = false;
                        cell.updateColor(false);
                    }
                }

                selectInput.style.visibility = "hidden";
                selectInput.value = "";
                paintable = true;

                break;
            case 'Escape':
                selectInput.style.visibility = "hidden";
                selectInput.value = "";
                paintable = true;

                break;
        }

        if (e.key === 'Enter') {
            if (e.target.value !== "") {
                savePattern(area.start.x, area.start.y, area.end.x, area.end.y, e.target.value);
            }

            selectInput.style.visibility = "hidden";
            selectInput.value = "";
            paintable = true;
        }
        else if (e.key === 'Escape') {
            selectInput.style.visibility = "hidden";
            selectInput.value = "";
            paintable = true;

            return;
        }
    });

    // clears all the highlights so nothing is drawn onto the canvas
    clearAllHighlights();
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
    rectFunc.draw();
    circleFunc.draw();
    selectFunc.isDeactivated ?
        null :
        selectFunc.draw();
}

function mouseDragged() {
    endOfTouch.x = mouseX;
    endOfTouch.y = mouseY;

    lineFunc.update();
    rectFunc.update();
    selectFunc.update();
    circleFunc.update();

    normalFunc.isDeactivated ?
        null :
        normalFunc.update();
}

function mouseMoved() {
    formFunc.update();
}


function switchSpecialFunction(name) {
    specialFunctions.forEach((func) => {
        const button = document.getElementById(func.name)
        func.deactivate();
        button.classList.remove("active");

        if (func.name === name) {
            func.activate();
            button.classList.add("active");
        }
    });
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
            const element = field.cellArray[gridY + j][gridX + i];
            highlight(element);
        }
    }
}

function drawLine(xStart, yStart, xEnd, yEnd) {
    // console.log(`xStart: ${xStart}  yStart: ${yStart}  xEnd: ${xEnd}  yEnd: ${yEnd}`);
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