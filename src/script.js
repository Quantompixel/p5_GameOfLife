const canvasWidth = innerWidth * 2;
const canvasHeight = innerHeight * 2;

const cellSize = 10;
let paintable = true;
let field;

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    //canvas id: #defaultCanvas0
    frameRate(80);

    generateField();

    document.getElementById("paint").addEventListener("click", function () {
        //toggles paint
        paintable = !paintable;
    });
}

function draw() {
    if (mouseIsPressed && paintable) {
        let drawX = Math.floor(mouseX / cellSize);
        let drawY = Math.floor(mouseY / cellSize);

        let drawCell = field.cellArray[drawY][drawX];

        if (drawCell == undefined) {
            return;
        } else {
            field.cellArray[drawY][drawX].changeState();
        }
    }
}

function generateField() {
    field = new Field(canvasWidth, canvasHeight, cellSize);
}

function Field(width, height, cellSize) {
    this.cellArray = [];

    this.init = function () {
        let horizontalCellCount = Math.floor(width / cellSize);
        let verticalCellCount = Math.floor(height / cellSize);

        for (let i = 0; i < verticalCellCount; i++) {
            this.cellArray[i] = [];
            for (let k = 0; k < horizontalCellCount; k++) {
                this.cellArray[i][k] = (new Cell(k, i, cellSize, true));
            }
        }
    }

    this.init();

}

function Cell(x, y, cellSize, alive) {
    this.x = x;
    this.y = y;
    this.cellSize = cellSize;
    this.alive = alive;

    noStroke();
    fill(alive * 255);
    rect(x * cellSize, y * cellSize, cellSize, cellSize);

    this.changeState = function () {
        alive = !alive;
        fill(alive * 1);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
}