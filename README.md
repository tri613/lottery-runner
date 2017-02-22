# Lottery Runner

A simple plugin that runs a lottery effect with vanilla js.

Check out the demo [here](https://tri613.github.io/lottery-runner/).

## Usage

- include `lottery-runner.js` (or `lottery-runner.min.js`) into your file

- initiate the `LotteryRunner` with running items' selector and options.

```js
const lottery = new LotteryRunner('your_selector', [options]);
lottery.run();
```

## Options

- **orderField** | `"data-order"`  
  The attribute that LotteryRunner depends on when sorting items and finding items' index.

  For example:
  ```html
  <div class="item" data-sort="A">Item A</div>
  <div class="item" data-sort="B">Item B</div>
  <div class="item" data-sort="C">Item C</div>
  ```
  ```js
  const ex1 = new LotteryRunner('.item', {
    orderField: "data-sort"
  });
  ```

- **startPoint** | `null`  
  The position where lottery starts.
  Default would start on the first item.  
  Please use the value of item's `orderField` for this.

- **rounds** | `3`  
  How many rounds should lottery run before stop.

- **speed** | `100` milliseconds

- **restart** | `false`  
  Whether start point should reset to `startPoint` after each run.

- **activeClass** | `"active"`  
  The class name that would be added to the item when active.

- **onRunEnd** | `null`  
  The function that would be called when a run has ended.
 ```js
  //example
  {
    onRunEnd: function(e) {
      console.log(`lottery stops on ${this.detail.stop}`);
    }
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
