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
    const easeInOutQuart = function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t };
    const easeInOutQuint =  function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }

    const Pachinko = function(userOptions) {
        userOptions = userOptions || {};
        const defaultOptions = {
            selector: "[data-order]",
            order: "data-order",
            start: null,
            rounds: 2,
            speed: 150,
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
            setTimeout(loop, speed, index, getSpeed(steps, totalSteps));
        };

        const getSpeed = (steps, totalSteps) => {
            return speed * easeInOutQuint(steps/totalSteps);
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
