/*===========================
  Lottery Runner v1.0.3
  https://github.com/tri613/lottery-runner

  @Create 2017/02/21
  @Author Trina Lu
  ===========================*/

(function(exportName) {

    const events = {
        onRunEnd: "onRunEnd"
    };

    const defaultOptions = {
        orderField: "data-order",
        startPoint: null,
        rounds: 3,
        speed: 100,
        restart: false,
        activeClass: "active",
        onRunEnd: null,
        easing: true
    };

    const easing = {
        linear: (t) => t,
        easeInOut: (t) => {
            if (t < .3) { return t*t+1; }
            else if (t < .6) { return 0.5 - t*t*t*t; }
            else { return t*t*t*t*5+1; }
        }
    };

    function mergeOptions(userOptions) {
        const maps = Object.keys(defaultOptions).map(key => {
           const value = (userOptions[key]) ? userOptions[key] : defaultOptions[key];
           return [key, value];
        });
        return new Map(maps);
    }

    function randNumberBetween(min, max) {
        return Math.floor((Math.random() * max) + min);
    }

    const LotteryRunner = function(selector, userOptions) {
        userOptions = userOptions || {};

        const options = mergeOptions(userOptions);
        const boxes = Array.from(document.querySelectorAll(selector)).sort((a, b) => a.getAttribute(options.get('orderField')) > b.getAttribute(options.get('orderField')) ? 1 : -1);
        let steps = 0,
            totalSteps = 0,
            start = options.get('startPoint'),
            end = null;

        function prepareRun() {
            steps = 0;
            totalSteps = countTotalSteps(start, end);
        };

        function activeBox(index) {
            boxes.forEach(box => box.classList.remove(options.get('activeClass')));
            boxes[index].classList.add(options.get('activeClass'));
        }

        function getBoxIndex(order) {
            return order ? boxes.findIndex(box => box.getAttribute(options.get('orderField')) == order) : 0;
        }

        function countTotalSteps(start, end) {
            return boxes.length - (getBoxIndex(start)) + (boxes.length * options.get('rounds')) + getBoxIndex(end);
        }

        function loop(index, speed) {
            activeBox(index);
            if (steps == totalSteps) {
                const stop = boxes[index].getAttribute(options.get('orderField'));
                start = (options.get('restart')) ? options.get('start') : stop;
                boxes[index].dispatchEvent(new CustomEvent(events.onRunEnd, {detail: {stop}}));
                return false;
            }
            steps++; index++;
            if (index > boxes.length-1) { index = 0; }
            setTimeout(loop, speed, index, getSpeed(steps, totalSteps));
        }

        const getSpeed = (steps, totalSteps) => {
            const times = options.easing ? easing.linear(steps/totalSteps) : easing.easeInOut(steps/totalSteps);
            return options.get('speed') * times;
        };

        function init() {
            if (boxes.length <= 0) {
                throw new Error('no elements found');
            }
            boxes.forEach(box => box.addEventListener(events.onRunEnd, options.get('onRunEnd')));
        }

        //methods
        this.run = (stopPoint) => {
            end = stopPoint || boxes[randNumberBetween(0, boxes.length-1)].getAttribute(options.get('orderField'));
            prepareRun();
            loop(getBoxIndex(start), options.get('speed'));
        };

        this.reset = () => {
            steps = 0;
            totalSteps = 0;
            start = options.get('startPoint');
            end = null;
            boxes.forEach(box => box.classList.remove(options.get('activeClass')));
        };

        init();
    }

    window[exportName] = LotteryRunner;

})('LotteryRunner');
