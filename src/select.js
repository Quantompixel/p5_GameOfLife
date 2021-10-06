function savePattern(startX, startY, endX, endY) {
    let arr = [];

    for (let x = startX; x <= endX; x++) {
        let arr2nd = [];

        for (let y = startY; y <= endY; y++) {
            getCellFromIndex(y,x).alive ? arr2nd.push(1) : arr2nd.push(0);
        }

        arr.push(arr2nd);
    }

    console.log(arr);
}

function loadPattern() {

}