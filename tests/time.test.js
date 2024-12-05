//@ts-check
import { test, expect, suite, vi } from 'vitest';
import { TimeSpan } from '../src/index.js';

suite(`Conversion from Nanoseconds`, () => {
    const ts = TimeSpan.fromNanoseconds(100);
    test(`Expect TimeSpan.fromNanoseconds(100) to equal 100 when converted to nanoseconds.`, () => {
        expect(ts.to(m => m.Nanoseconds)).toBe(100);
    });
    
    test(`Expect TimeSpan.fromNanoseconds(100) to equal 0.1 when converted to microseconds.`, () => {
        expect(ts.to(m => m.Microseconds)).toBe(0.1);
    });

    test(`Expect TimeSpan.fromNanoseconds(100) to equal 0.0001 when converted to milliseconds.`, () => {
        expect(ts.to(m => m.Milliseconds)).toBe(0.0001);
    });

    test(`Expect TimeSpan.fromNanoseconds(100) to equal 0.0000001 when converted to seconds.`, () => {
        expect(ts.precision(7).to(m => m.Seconds)).toBe(0.0000001);
    });

    test(`Expect TimeSpan.fromNanoseconds(100) to be close to 1.6667e-9  when converted to minutes.`, () => {
        expect(ts.precision(7).to(m => m.Minutes)).toBeCloseTo(1.6667e-9);
    });
});

suite(`Conversion from Microseconds`, () => {
    const ts = TimeSpan.fromMicroseconds(100);
    test(`Expect TimeSpan.fromMicroseconds(100) to equal 100000 when converted to nanoseconds.`, () => {
        expect(ts.to(m => m.Nanoseconds)).toBe(100000);
    });
    
    test(`Expect TimeSpan.fromMicroseconds(100) to equal 100 when converted to microseconds.`, () => {
        expect(ts.to(m => m.Microseconds)).toBe(100);
    });

    test(`Expect TimeSpan.fromMicroseconds(100) to equal 0.1 when converted to milliseconds.`, () => {
        expect(ts.to(m => m.Milliseconds)).toBe(0.1);
    });

    test(`Expect TimeSpan.fromMicroseconds(100) to equal 0.0001 when converted to seconds.`, () => {
        expect(ts.to(m => m.Seconds)).toBe(0.0001);
    });

    test(`Expect TimeSpan.fromMicroseconds(100) to be close to 1.6667e-6 when converted to minutes.`, () => {
        expect(ts.to(m => m.Minutes)).toBeCloseTo(1.6667e-6);
    });
});

suite(`Conversion from Milliseconds`, () => {
    const ts = TimeSpan.fromMilliseconds(100);
    test(`Expect TimeSpan.fromMilliseconds(100) to equal 100000000 when converted to nanoseconds.`, () => {
        expect(ts.to(m => m.Nanoseconds)).toBe(100000000);
    });
    
    test(`Expect TimeSpan.fromMilliseconds(100) to equal 100000 when converted to microseconds.`, () => {
        expect(ts.to(m => m.Microseconds)).toBe(100000);
    });

    test(`Expect TimeSpan.fromMilliseconds(100) to equal 100 when converted to milliseconds.`, () => {
        expect(ts.to(m => m.Milliseconds)).toBe(100);
    });

    test(`Expect TimeSpan.fromMilliseconds(100) to equal 0.1 when converted to seconds.`, () => {
        expect(ts.to(m => m.Seconds)).toBe(0.1);
    });

    test(`Expect TimeSpan.fromMilliseconds(100) to be close to 0.0016667 when converted to minutes.`, () => {
        expect(ts.to(m => m.Minutes)).toBeCloseTo(0.0016667);
    });
});

suite(`Conversion from Seconds`, () => {
    const ts = TimeSpan.fromSeconds(12);
    test(`Expect TimeSpan.fromSeconds(12) to equal 12,000,000,000 when converted to nanoseconds.`, () => {
        expect(ts.to(m => m.Nanoseconds)).toBe(12000000000);
    });
    
    test(`Expect TimeSpan.fromSeconds(12) to equal 12,000,000 when converted to microseconds.`, () => {
        expect(ts.to(m => m.Microseconds)).toBe(12000000);
    });

    test(`Expect TimeSpan.fromSeconds(12) to equal 12,000 when converted to milliseconds.`, () => {
        expect(ts.to(m => m.Milliseconds)).toBe(12000);
    });

    test(`Expect TimeSpan.fromSeconds(12) to equal 12 when converted to seconds.`, () => {
        expect(ts.to(m => m.Seconds)).toBe(12);
    });

    test(`Expect TimeSpan.fromSeconds(12) to equal 0.20 when converted to minutes.`, () => {
        expect(ts.to(m => m.Minutes)).toBe(0.20);
    });
});

suite(`Conversion from Minutes`, () => {
    const ts = TimeSpan.fromMinutes(5.5);
    test(`Expect TimeSpan.fromMinutes(5.5) to equal 330000 when converted to milliseconds.`, () => {
        expect(ts.to(m => m.Milliseconds)).toBe(330000);
    });

    test(`Expect TimeSpan.fromMinutes(5.5) to equal 5.5 when converted to minutes.`, () => {
        expect(ts.to(m => m.Minutes)).toBe(5.5);
    });

    test(`Expect TimeSpan.fromMinutes(5.5) to equal 0.09167 when converted to hours.`, () => {
        expect(ts.to(m => m.Hours)).toBe(0.09167);
    });

    test(`Expect TimeSpan.fromMinutes(5.5) to equal 0.003819 when converted to days`, () => {
        expect(ts.precision(6).to(m => m.Days)).toBe(0.003819);
    });

    test(`Expect TimeSpan.fromMinutes(5.5) to equal 5.456349e-4 when converted to weeks`, () => {
        expect(ts.precision(10).to(m => m.Weeks)).toBe(5.456349e-4);
    });
});

// suite(`Conversion from Hours`, () => {
// });

// suite(`Conversion from Weeks`, () => {

// });

// suite(`Conversion from Months`, () => {

// });

// suite(`Conversion from Years`, () => {

// });

suite(`Cloning`, () => {
    test(`Expect TimeSpan.fromSeconds(2).sub(m => m.Seconds(1)) to have ability to call .timeout() to delay for only 1 second.`, async () => {
        const ts = TimeSpan.fromSeconds(2);
        const ts_minus1sec = ts.sub(m => m.Seconds(1));
        expect(ts.to(m => m.Seconds)).toBe(2);
        expect(ts_minus1sec.to(m => m.Seconds)).toBe(1);
    })
})

// suite(`Utility Functions (timeout, interval, delay)`, async () => {
     
// });