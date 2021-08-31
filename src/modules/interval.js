let interval;
let func;
export let running = false;

function timeout() {
    if (running === true) {
        setTimeout((loop), interval);
    }
}

function loop() {
    func();
    timeout();
}

export function start() {
    running = true;
    loop();
}

export function stop() {
    running = false;
}

export function updateTimeout(intervalParameter) {
    interval = intervalParameter;
}

export function createInterval(intervalParameter, funcParameter){
    interval = intervalParameter;
    func = funcParameter;
}