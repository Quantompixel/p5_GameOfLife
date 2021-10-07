function savePattern(startX, startY, endX, endY, name) {
    let arr = [];

    // console.log(name);
    for (let x = startX; x <= endX; x++) {
        let arr2nd = [];

        for (let y = startY; y <= endY; y++) {
            getCellFromIndex(y,x).alive ? arr2nd.push(1) : arr2nd.push(0);
        }

        arr.push(arr2nd);
    }
    localStorage.setItem(name, JSON.stringify(arr));

    // console.log(arr);
}

function loadPattern(name) {
    const pattern = JSON.parse(localStorage.getItem(name));

    selectedPattern = pattern;
}