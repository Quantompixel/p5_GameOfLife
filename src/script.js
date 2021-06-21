const canvasWidth = 500;
const canvasHeight = 500;

const cellSize = 10;

function setup() {
    createCanvas(canvasWidth, canvasHeight);

    generateField();
}
  
function draw() {
}

function generateField(){
    let field = new Field(canvasWidth, canvasHeight, cellSize);
    console.log(field.cellArray[1][1]);
}

function Field(width, height, cellSize){
    this.cellArray = [];

    this.init = function() {
        let horizontalCellCount = Math.floor(width/cellSize);
        let verticalCellCount = Math.floor(height/cellSize);

        for (let i = 0; i < verticalCellCount; i++) {
            this.cellArray[i] = [];
            for (let k = 0; k < horizontalCellCount; k ++) {
                this.cellArray[i][k] = (new Cell(k, i, cellSize, Math.round(Math.random()*255)));
            }
        }
    }

    this.init();

}

function Cell(x, y, cellSize, color){
    this.x = x;
    this.y = y;
    this.cellSize = cellSize;
    
    fill(color);
    rect(x*cellSize, y*cellSize, cellSize, cellSize);

    this.update = function() {
        
    }
}