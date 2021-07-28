const canvasWidth = innerWidth * 3;
const canvasHeight = innerHeight * 4;

const cellSize = 20;
//let paintable = true;
let field;
let interval;

function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    //canvas id: #defaultCanvas0
    frameRate(80);

    generateField();

    document.getElementById("defaultCanvas0").addEventListener("contextmenu", function(event){
        event.preventDefault();
    });

    document.getElementById("start").addEventListener("click", function (event) {
        if (typeof interval === 'undefined') {
            interval = setInterval(function(){
                field.update();
            }, 50);
            event.target.innerHTML = "stop";
        }else{
            clearInterval(interval);
            interval = undefined;
            event.target.innerHTML = "start";
        }

        
    });

    document.getElementById("clean").addEventListener("click", function () {
        document.getElementById("start").innerHTML = "start";
        clearInterval(interval);
        interval = undefined;
        field.init();
    });
}

function draw() {
    if (mouseIsPressed && paintable) {
        let drawX = Math.floor(mouseX / cellSize);
        let drawY = Math.floor(mouseY / cellSize);

        let drawCell = field.cellArray[drawY][drawX];
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
    //console.log(drawCell.alive);
}

function generateField() {
    field = new Field(canvasWidth, canvasHeight, cellSize);
    field.init();
}

function Field(width, height, cellSize) {
    this.cellArray = [];

    this.init = function () {
        let horizontalCellCount = Math.floor(width / cellSize);
        let verticalCellCount = Math.floor(height / cellSize);

        for (let i = 0; i < verticalCellCount; i++) {
            this.cellArray[i] = [];
            for (let k = 0; k < horizontalCellCount; k++) {
                this.cellArray[i][k] = (new Cell(this, k, i, cellSize, false, false));
            }
        }
    }

    //this.init();

    this.update = function () {

        for (let i = 0; i < this.cellArray.length; i++) {
            for (let k = 0; k < this.cellArray[i].length; k++) {
                const cell = this.cellArray[i][k];

                const aliveNeighbours = this.checkNeighbours(cell.x, cell.y);
                cell.aliveNeighbours = aliveNeighbours;


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

        for (let i = 0; i < this.cellArray.length; i++) {
            for (let k = 0; k < this.cellArray[i].length; k++) {
                const cell = this.cellArray[i][k];

                //optimization: only looks at cells that is has to
                if (cell.alive == false && cell.aliveNeighbours == 0) {
                    continue;
                }

                if (cell.futureState) {
                    fill(0);
                    rect(cell.x * cell.cellSize, cell.y * cell.cellSize, cell.cellSize-1, cell.cellSize-1);
                } else {
                    fill(255);
                    rect(cell.x * cell.cellSize, cell.y * cell.cellSize, cell.cellSize-1, cell.cellSize-1);
                }

                cell.alive = cell.futureState;
            }
        }
    }

    this.checkNeighbours = function (x, y) {

        const aliveNeighbours = this.isAlive(x - 1, y - 1) + this.isAlive(x, y - 1) + this.isAlive(x + 1, y - 1) + this.isAlive(x - 1, y) + this.isAlive(x + 1, y) + this.isAlive(x - 1, y + 1) + this.isAlive(x, y + 1) + this.isAlive(x + 1, y + 1);

        return aliveNeighbours;
    }

    this.isAlive = function (x, y) {
        if (x < 0 || x >= this.cellArray[0].length || y < 0 || y >= this.cellArray.length) {
            return false;
        }

        return this.cellArray[y][x].alive ? 1 : 0;
    }
}

function Cell(field, x, y, cellSize, alive, futureState) {
    this.field = field;
    this.x = x;
    this.y = y;
    this.cellSize = cellSize;
    this.alive = alive;
    this.futureState = futureState;
    this.aliveNeighbours = 0;

    this.init = function () {
        stroke(0, 0, 0, 50);
        fill(!alive * 255);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
    this.init();

    this.changeState = function () {
        this.alive = !this.alive;

        this.updateColor(this.alive);
    }

    this.updateColor = function (alive) {
        //stroke(0, 0, 0, 50);
        if (alive) {
            fill(0);
        } else {
            fill(255);
        }

        rect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize-1, this.cellSize-1);
    }
}