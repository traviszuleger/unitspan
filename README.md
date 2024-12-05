# UnitSpan

UnitSpan is a suite of conversion tools for easy conversions between different units of measurement.  

# TimeSpan

Convert between different units of measurement for time, such as nanoseconds to seconds, milliseconds, days, weeks, years, and more!

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

# DigiSpan

Convert between different units of measurement for Digital Storage, such as Bits to Bytes, Kilobytes, or even Kibibytes

```js
import { DigiSpan } from "unitspan";

const ds = DigiSpan.fromBits(12);
console.log(ds.to(m => m.Bytes)); // prints 1.5

const buffer = ds.buffer(); // creates a Uint8Array of size 2 (Math.ceil(ds.to(m => m.Bytes)))

// Get the number of digital units that your buffer size is.
const dsFromBuffer = DigiSpan.fromBuffer(new Uint8Array(12));
console.log(ds.to(m => m.Bytes)); // 12
console.log(ds.to(m => m.Bits)); // 96
```

# TempSpan

Convert between the different temperature units of measurement, Kelvin, Celsius, and Fahrenheit.

```js
import { TempSpan } from "unitspan";

const ts = TempSpan.fromKelvin(0);
console.log(ds.to(m => m.Fahrenheit)); // will print -459.67
console.log(ds.to(m => m.Celsius)); // will print -273.15
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

# Wrappers

The UnitSpan class syntax can be different from what other languages are used to. For example, C#'s implementation of TimeSpan would look something like this when converting seconds to minutes:

```cs
TimeSpan.FromSeconds(10).Minutes;
```

The above syntax is much more understandable than:

```js
TimeSpan.fromSeconds(10).to(m => m.Minutes);
```

Therefore, this section is dedicated to creating a Wrapper class from the UnitSpan library to make the library look more human-friendly.  

Here is an example of creating a wrapper class that looks like C#'s implementation:
```js
import { TimeSpan as US_TimeSpan } from 'unitspan';

export class TimeSpan {
    /** @type {US_TimeSpan} */
    #timespan;

    /**
     * @param {number} initialQuantity
     */
    static FromSeconds(initialQuantity) {
        return new TimeSpan(US_TimeSpan.fromSeconds(initialQuantity));
    }

    /**
     * @protected
     * @param {US_TimeSpan} timespan
     */
    constructor(timespan) {
        this.#timespan = timespan;
    }

    get Minutes() {
        return this.#timespan.to(m => m.Minutes);
    }

    get Timeout() {
        return this.#timespan.timeout();
    }

    Interval(callback) {
        return this.#timespan.interval(callback);
    }
}

const _12secondsToMinutes = TimeSpan.FromSeconds(12).Minutes;
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