let highlightedCells = [];

let lineDrawing = false;

// #Pattern
const testPattern = [
    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 1]
];

const formFunction = new ActivatingSpecialFunction('f', () => {
    // console.log("typed");
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
            element.highlight();
        }
    }
})

const lineFunction = new ToggleableSpecialFunction('l', "Line", (xStart, yStart, xEnd, yEnd) => drawLine(xStart, yStart, xEnd, yEnd))

/**
 * Special Functions that have a keybinding
 * For example lines, forms, ...
 * @type {ToggleableSpecialFunction[]|ActivatingSpecialFunction[]}
 */
const functions = [formFunction, lineFunction]

/**
 * Returns true if the highlighted cells should be recalculated and redrawn,
 * false otherwiese
 * @returns {boolean} whether or not to clear the highlighted cells
 */
function defaultShouldClearHighlight() {
    const lastCell = getCell(pmouseY, pmouseX)
    const currentCell = getCell(mouseY, mouseX)
    return !(lastCell.y === currentCell.y && lastCell.x === currentCell.x);
}

/**
 * A special function that is activated once, when the key is pressed
 * Does not highlight anything
 * @param {String} keyBind the key that activates this function
 * @param {Function} drawFunction a function that draws this element
 */
function ActivatingSpecialFunction(keyBind, drawFunction) {
    this.keyBind = keyBind
    this.drawFunction = drawFunction
    this.update = () => {
        this.drawFunction()
    }
    /**
     * Returns wether or not to clear highlights
     */
    this.shouldClearHighlights = () => {
        return defaultShouldClearHighlight()
    }
}

/**
 * Special function, for example a line
 *
 * @param {String} keyBind the key that activates this function
 * @param {String} name the name of this function
 * @param {Function}drawFunction a function that takes the mouse positions and draws this function
 */
function ToggleableSpecialFunction(keyBind, name, drawFunction) {
    this.keyBind = keyBind
    this.drawFunction = drawFunction
    /**
     * Is this function currently highlighting anything / is it active
     * @type {Boolean}
     */
    this.highlighting = false
    this.xStart = undefined
    this.yStart = undefined
    /**
     * User-friendly name of this function
     * @type {String}
     */
    this.name = name

    /**
     * Updates the highlighting value
     */
    this.update = () => {
        this.highlighting = !this.highlighting

        if (this.highlighting) {
            this.xStart = mouseX
            this.yStart = mouseY
        } else {
            makeHighlightsPermanent()
        }
    }

    this.mouseEvent = () => {
        if (this.highlighting) {
            this.drawFunction(this.xStart, this.yStart, mouseX, mouseY)
        }
    }
    /**
     * Returns whether or not to clear highlights
     */
    this.shouldClearHighlights = () => {
        return defaultShouldClearHighlight()
    }
}


function keyTyped() {
    // activate line drawing
    for (let specialFunction of functions) {
        if (specialFunction.keyBind === key) {
            specialFunction.update()
        }
    }
}

function mousePressed() {
    for (let specialFunction of functions) {
        if (specialFunction.mouseEvent) {
            specialFunction.mouseEvent()
        }
    }
}

function mouseDragged() {
    let overwrittenBySpecialFunction = false
    for (let specialFunction of functions) {
        if (specialFunction.highlighting) {
            specialFunction.mouseEvent()
            overwrittenBySpecialFunction = true
        }
    }
    if (!overwrittenBySpecialFunction) {
        if (paintable) {
            const drawCell = getCell(mouseY, mouseX)
            if (typeof drawCell !== 'undefined') {
                // - LMB to draw
                // - RMB to erase
                drawCell.alive = mouseButton !== LEFT
                drawCell.changeState()
            }

        }
    }
}

function draw() {
    //--> clears all highlighted cells
    if (functions.every((specialFunction) => specialFunction.shouldClearHighlights())) {
        highlightedCells.forEach((cell) => {
            cell.cancelHighlight();
            highlightedCells = [];
        })
    }

    //Displays the active functions in the paint button
    const activeFunctionsText = functions.filter((specFunction) => specFunction.highlighting)
        .map((specFunction) => specFunction.name)
        .join(" ")
    const paint = document.getElementById("paint")
    const text = `paint<br>${activeFunctionsText}`;
    if (paint.innerHTML !== text) {
        paint.innerHTML = text
    }
}

function drawLine(xStart, yStart, xEnd, yEnd) {
    const startCell = getCell(yStart, xStart)
    const endcell = getCell(yEnd, xEnd)

    highlight(startCell)
    highlight(endcell)
}

/**
 * @param {Cell} cell the cell to highlight
 */
function highlight(cell) {
    cell.highlight()
    highlightedCells.push(cell)
}

/**
 * Returns the cell with the given coordinates on screen
 * @param {Number} yPos the Cells y position
 * @param {Number} xPos the Cells x postition
 * @returns {Cell} the cell
 */
function getCell(yPos, xPos) {
    return field.cellArray[Math.floor(yPos / cellSize)][Math.floor(xPos / cellSize)];
}

function makeHighlightsPermanent() {
    highlightedCells.forEach((cell) => {
        cell.alive = true;
        cell.updateColor(true);
    });
}
