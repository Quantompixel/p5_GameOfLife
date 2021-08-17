const testPattern = [
    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 1]
];

function keyTyped() {
    if (key === 'f') {
        // console.log("typed");
        const gridX = Math.floor(mouseX / cellSize);
        const gridY = Math.floor(mouseY / cellSize);

        for (let i = 0; i < testPattern.length; i++) {
            for (let j = 0; j < testPattern[i].length; j++) {
                // read pattern
                if (testPattern[i][j] == 0) {
                    continue;
                }
                
                // draw pattern on canvas
                const element = field.cellArray[gridY + i][gridX + j];
                element.highlight();
            }
        }
    }
}