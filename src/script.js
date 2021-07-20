const canvasWidth = 500;
const canvasHeight = 500;

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

    
    
    //ellipse(10, 10, 100);
}

function draw() {
    if (mouseIsPressed && paintable) {
        let drawX = Math.floor(mouseX / cellSize);
        let drawY = Math.floor(mouseY / cellSize);

        let drawCell = field.cellArray[drawY][drawX];

        if (typeof drawCell === 'undefined') {
            return;
        } else if (drawCell.alive === true) {
            return;
        } else {
            drawCell.changeState();
        }
    }
}

function mouseClicked() {
    if (mouseX < 0 || mouseY < 0) {
        return;
    }
    if (mouseX > canvasWidth || mouseY > canvasHeight) {
        return;
    }

    let drawX = Math.floor(mouseX / cellSize);
    let drawY = Math.floor(mouseY / cellSize);

    let drawCell = field.cellArray[drawY][drawX];
    console.log(drawCell.alive);
}

function generateField() {
    field = new Field(canvasWidth, canvasHeight, cellSize);
    field.init();

    document.getElementById("update").addEventListener("click", function () {
        field.update();
    });
}

function Field(width, height, cellSize) {
    this.cellArray = [];

    this.init = function () {
        let horizontalCellCount = Math.floor(width / cellSize);
        let verticalCellCount = Math.floor(height / cellSize);

        for (let i = 0; i < verticalCellCount; i++) {
            this.cellArray[i] = [];
            for (let k = 0; k < horizontalCellCount; k++) {
                this.cellArray[i][k] = (new Cell(k, i, cellSize, false, false));
            }
        }
    }

    //this.init();

    this.update = function () {

        for (let i = 0; i < this.cellArray.length; i++) {
            for (let k = 0; k < this.cellArray[i].length; k++) {
                const cell = this.cellArray[i][k];

                let aliveNeighbours = 0;

                for (let j = -1; j <= 1; j++) {
                    for (let l = -1; l <= 1; l++) {
                        if (i+j < 0 || l+k < 0) {
                            continue;
                        }
                        if (i+j > this.cellArray.length-1 || l+k > this.cellArray[i].length-1) {
                            continue;
                        }

                        aliveNeighbours += this.cellArray[i+j][l+k].alive;
                    }
                }

                aliveNeighbours -= this.cellArray[i][k].alive;

                fill(255,0,0);
                text(aliveNeighbours, cell.x * cell.cellSize, cell.y * cell.cellSize);


                if (cell.alive) {
                    //cell lives
                    //next gen -->
                    if (aliveNeighbours == 2 || aliveNeighbours == 3) {
                        cell.futureState = true;
                    } else {
                        cell.futureState = false;
                    }
                } else {
                    //cell is dead
                    //next gen -->
                    if (aliveNeighbours == 3) {
                        cell.futureState = true;
                    } else {
                        cell.futureState = false;
                    }
                }
            }
        }

        /*for (let i = 0; i < this.cellArray.length; i++) {
            for (let k = 0; k < this.cellArray[i].length; k++) {
                const cell = this.cellArray[i][k];

                if (cell.futureState) {
                    fill(0);
                    rect(cell.x * cell.cellSize, cell.y * cell.cellSize, cell.cellSize, cell.cellSize);
                } else {
                    fill(255);
                    rect(cell.x * cell.cellSize, cell.y * cell.cellSize, cell.cellSize, cell.cellSize);
                }

                cell.alive = cell.futureState;
            }
        }*/
    }

    this.getAliveNeighbours = function (x, y) {
        let aliveCells = 0;

        //x:2 , y:2
        //1, 2, 3
        for (let i = x - 1; i < x+2; i++) {
            for (let k = y - 1; k < y+2; k++) {
                //OutOfBounds
                if (i < 0 || k < 0) {
                    continue;
                }
                if (i > this.cellArray.length-1 || k > this.cellArray[i].length-1) {
                    continue;
                }
                if (i == x && k == y) {
                    continue;
                }

                if (this.cellArray[i][k] == undefined) {
                    console.warn("Undefined");
                }
                
                if (this.cellArray[i][k].alive) {
                    aliveCells++;
                }
            }
        }

        return aliveCells;
    }

}

function Cell(x, y, cellSize, alive, futureState) {
    this.x = x;
    this.y = y;
    this.cellSize = cellSize;
    this.alive = alive;
    this.futureState = futureState;

    this.init = function () {
        noStroke();
        fill(!alive * 255);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
    this.init();

    this.changeState = function () {
        //not redrawing correctly


        this.alive = !this.alive;


        this.updateColor(this.alive);
    }

    this.updateColor = function (alive) {
        if (alive) {
            fill(0);
        } else {
            fill(255);
        }

        rect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
    }
}