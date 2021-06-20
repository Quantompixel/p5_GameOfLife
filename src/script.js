const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

const cellSize = 10;

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    generateField();
}
  
function draw() {
}

function generateField(){
    for (let i = 0; i <= canvasHeight; i += cellSize) {
        for (let k = 0; k <= canvasWidth; k += cellSize) {
            fill(Math.round(Math.random()*255));
            rect(k, i, cellSize, cellSize);            
        }
        
    }
}