(function(exportName) {

    function mergeOptions(defaultOptions, userOptions) {

        // userOptions.selector = userOptions.selector || defaultOptions.selector;
        // userOptions.order = userOptions.order || defaultOptions.order;
        // userOptions.start = userOptions.start || defaultOptions.start;
        // userOptions.rounds = userOptions.rounds || defaultOptions.rounds;
        // userOptions.speed = userOptions.speed || defaultOptions.speed;

        return userOptions;
    }

    const Pachinko = function(_options) {
        const defaultOptions = {
            selector: "[data-order]",
            order: "data-order",
            start: null,
            rounds: 2,
            speed: 80,
            restart: false,
            activeClass: "active"
        };

        const options = defaultOptions; // mergeOptions(defaultOptions, _options);
        const boxes = Array.from(document.querySelectorAll(options.selector))
                        .sort((a, b) => a.getAttribute(options.order) > b.getAttribute(options.order) ? 1 : -1);
        const rounds = options.rounds;
        let speed = options.speed;
        let start = options.start;
        let end = null;
        let steps = 0;
        let totalSteps = 0;


        //functions
        const init = () => {
            steps = 0;
            speed = options.speed;
            totalSteps = countTotalSteps(start, end);
        };
        const getBoxIndex = (order) => (order) ? boxes.findIndex(box => box.getAttribute(options.order) == order) : 0;
        const countTotalSteps = (start, end) => (boxes.length - (getBoxIndex(start)-1)) + (boxes.length * rounds) + getBoxIndex(end);
        const activeBox = (index) => {
            boxes.forEach(box => box.classList.remove(options.activeClass));
            boxes[index].classList.add(options.activeClass);
        };
        const loop = (index, speed) => {
            activeBox(index);
            steps++; index++;
            if (index > boxes.length-1) { index = 0; }
            if (steps == totalSteps) {
                if (options.restart) {
                    start = options.start;
                } else {
                    start = boxes[index-1].getAttribute(options.order);
                }
                return false;
            }
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
            end = destination;
            init();
            loop(start, speed);
        };
        this.reset = init;
    };

    window[exportName] = Pachinco;
})('Pachinko');
