const canvasWidth = innerWidth * 3;
const canvasHeight = innerHeight * 4;

const cellSize = 20;

let field;

function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    //canvas id: #defaultCanvas0
    frameRate(80);

    document.getElementById("defaultCanvas0").addEventListener("contextmenu", function (event) {
        event.preventDefault();
    });

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
                    rect(cell.x * cell.cellSize, cell.y * cell.cellSize, cell.cellSize - 1, cell.cellSize - 1);
                } else {
                    fill(255);
                    rect(cell.x * cell.cellSize, cell.y * cell.cellSize, cell.cellSize - 1, cell.cellSize - 1);
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
        noStroke();

        alive
            ? fill(0)
            : fill(255);

        rect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize - 1, this.cellSize - 1);
    }

    this.highlight = function () {
        noStroke();
        fill(220);
        rect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize - 1, this.cellSize - 1);
    };
    /**
     * @returns {Cell[]}
     */
    this.getNeighbors = function () {
        const neighbors = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) {
                    continue;
                }
                const row = field.cellArray[this.y + y];
                if (row) {
                    const element = row[this.x + x];
                    if (element) {
                        neighbors.push(element);
                    }
                }
            }
        }
        return neighbors;
    };

    this.cancelHighlight = function () {
        this.updateColor(this.alive);
    };
    this.toString = () => {
        return `Cell{alive:${this.alive}, x:${this.x}, y: ${this.y}, aliveNeighbours: ${this.aliveNeighbours}`;
    };

    /**
     * @param {Cell} other
     */
    this.equals = (other) => {
        return this.x === other.x && this.y === other.y && this.alive === other.alive;
    };
}