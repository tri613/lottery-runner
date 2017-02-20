(function(exportName) {
    function mergeOptions(defaultOptions, userOptions) {
        const maps = Object.keys(defaultOptions).map(key => {
           const value = (userOptions[key]) ? userOptions[key] : defaultOptions[key];
           return [key, value];
        });
        return new Map(maps);
    }

    function randNumberBetween(min, max) {
        return Math.floor((Math.random() * max) + min);
    }

    const Pachinko = function(userOptions) {
        userOptions = userOptions || {};
        const defaultOptions = {
            selector: "[data-order]",
            order: "data-order",
            start: null,
            rounds: 2,
            speed: 80,
            restart: false,
            activeClass: "active"
        };

        const options = mergeOptions(defaultOptions, userOptions);
        const boxes = Array.from(document.querySelectorAll(options.get('selector')))
                        .sort((a, b) => a.getAttribute(options.get('order')) > b.getAttribute(options.get('order')) ? 1 : -1);
        const rounds = options.get('rounds');
        let speed = options.get('speed');
        let start = options.get('start'); 
        let end = null;
        let steps = 0;
        let totalSteps = 0;

        //functions
        const init = () => {
            steps = 0;
            speed = options.get('speed');
            totalSteps = countTotalSteps(start, end);
        };
        const getBoxIndex = (order) => (order) ? boxes.findIndex(box => box.getAttribute(options.get('order')) == order) : 0;
        const countTotalSteps = (start, end) => (boxes.length - (getBoxIndex(start)-1)) + (boxes.length * rounds) + getBoxIndex(end);
        const activeBox = (index) => {
            boxes.forEach(box => box.classList.remove(options.get('activeClass')));
            boxes[index].classList.add(options.get('activeClass'));
        };
        const loop = (index, speed) => {
            activeBox(index);
            steps++; index++;
            if (steps == totalSteps) {
                if (options.get('restart')) {
                    start = options.get('start');
                } else {
                    start = boxes[index-1].getAttribute(options.get('order'));
                }
                return false;
            }
            if (index > boxes.length-1) { index = 0; }
            setTimeout(loop, speed, index, getSpeed(index, totalSteps));
        };
        const getSpeed = (steps, totalSteps) => {
            const parts = Math.floor(totalSteps / 3);
            if (steps <= parts*1) {
               speed += 5; //slow
            } else if (steps < parts*2) {
               speed -= 5;
            } else {
              speed += 10*steps;
            }
            return speed;
        };

        //methods
        this.run = (destination) => {
            end = destination || boxes[randNumberBetween(0, boxes.length)].getAttribute(options.get('order'));
            init();
            loop(getBoxIndex(start), speed);
        };
        this.reset = init;
    };

    window[exportName] = Pachinko;
})('Pachinko');