Create differential spans for different units of measurement.

# TimeSpan

```js
import { TimeSpan } from "unitspan";

const ts = TimeSpan.fromSeconds(10);

// default precision of 5 digits
console.log(ts.to(m => m.Minutes)); // prints 0.16667
console.log(ts.precision(7).to(m => m.Minutes)); // prints 0.1666667

// or custom functions

// set a timeout that will fire after 10 seconds.
const unsub1 = ts.timeout(() => {
    console.log(`I will print after 10 seconds`);
});

let i = 0;
// set an interval that runs once every 1 second.
const unsub2 = ts.sub(m => m.Seconds(9)).interval(() => {
    if(i++ >= 2) {
        console.log(`but not if I unsubscribe after 3 seconds!`);
        unsub1();
        unsub2();
    }
});

// wait for 10 seconds.
await ts.delay();
console.log(`This will print definitely after 10 seconds.`);
```

# DigiSpan (in progress)

```js
import { DigiSpan } from "unitspan";

const ds = DigiSpan.fromBits(12);
console.log(ds.to(m => m.Bytes)); // prints 1.5

// to be implemented!
const buffer = ds.buffer(); // creates a Uint8Array of size 2 (Math.ceil(ds.to(m => m.Bytes))) 
```

# alternative syntax

## `to(model => string)` vs. `to(string)`
```js
const ts = TimeSpan.fromSeconds(10);
// to convert to minutes, you can either do:
ts.to(m => m.Minutes);
// or
ts.to("Minutes");
```

# Helpful information

All UnitSpan functions return a clone of the UnitSpan child object, meaning you can chain a lot of functions (such as `.sub` or `.add`) and you can save the state
as you make changes to the Span-like object.

e.g.,  
```js
const ts_2sec = TimeSpan.fromSeconds(2);
const ts_1sec = ts_2sec.sub(m => m.Seconds(1));

assert(ts_2sec.to(m => m.Seconds) === 2);
assert(ts_1sec.to(m => m.Seconds) === 1);
```