# Lottery Runner

A simple plugin that runs a lottery effect with vanilla js.

Check out the demo [here](https://tri613.github.io/lottery-runner/).

## Usage

- include `lottery-runner.js` (or `lottery-runner.min.js`) into your file.

- initiate the `LotteryRunner` with running items' selector and options.

- make sure that `document.querySelectorAll('your_selector').length > 0` or an exception would be thrown.

```js
const lottery = new LotteryRunner('your_selector' [,options]);
lottery.run();
```

## Example

- html markup
```html
<!-- three items for the lottery -->
<div class="item" data-sort="C">Third Item C</div>
<div class="item" data-sort="B">Second Item B</div>
<div class="item" data-sort="A">First Item A</div>
```
- js
```js
const mylottery = new LotteryRunner('.item', {
  orderField: "data-sort", //the order of the items would be item A => item B => item C
  startPoint: "C", //the lottery will start from `Item C`,
  rounds: 2,
  activeClass: "highlighted",
  restart: true, //every run will start from `Item C` instead of the last stop point
  onRunEnd: function(event) {
     console.log(`lottery stops on ${event.detail.stop}`);
  }
});
```

## Options

- **orderField** | `"data-order"`  
  The attribute that LotteryRunner depends on when sorting items and finding items' index.

- **startPoint** | `null`  
  The position where lottery starts.
  Default would start on the first item.  
  Please use the value of item's `orderField` for this.

- **rounds** | `3`  
  The rounds that lottery would run before reaching the stop point.

- **speed** | `100` milliseconds

- **restart** | `false`  
  Whether start point should reset to `startPoint` after each run.

- **activeClass** | `"active"`  
  The class name that would be added to the item when active.

- **onRunEnd** | `null`  
  The function that would be called when a run has ended.
  The event object would be passed in as the first paramerter which `detail.stop` returns the stop point of the run.
  ```js
  function(event) {
      // your handler here
      // event.detail.stop = lottery's stop point
      // `this` would be the active item (stop point item)
  }
  ```
  
 ## Methods

- **.run([stopPoint])**  
  Start the lottery run effect. If `stopPoint` is not specified,
  LotteryRunner would generate a random stop point itself.  
  Use the value of item's `orderField` for `stopPoint`.

  ```js
    const mylottery = new LotteryRunner('.item');
    mylottery.run('B');
  ```
  ```html
  <div class="item" data-order="A">item A</div>
  <div class="item" data-order="B">item B</div> <!-- runner will stop here -->
  <div class="item" data-order="C">item C</div>
  ```

- **.reset()**  
  Reset the start point to the initial option `startPoint` and remove active class for every items.
