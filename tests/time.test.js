//@ts-check
import { test, expect, suite, vi } from 'vitest';
import { TimeSpan } from '../src/index.js';

suite(`Format strings`, () => {
    test(`Expect TimeSpan.fromSeconds(2.5).to("{{Hours}}:{{Minutes}}:{{Seconds}}.{{Milliseconds}}") to equal "00:00:02.500"`, () => {
        const ts = TimeSpan.fromSeconds(2.5);
        expect(ts.to("{{Hours}}:{{Minutes}}:{{Seconds}}.{{Milliseconds}}")).toBe("00:00:02.500");
        expect(ts.toString()).toBe("00:00:02.500");
    });

    test("Expect TimeSpan.fromSeconds(2.5).to(m => `${m.Hours}:${m.Minutes}:${m.Seconds}.${m.Milliseconds}`) to equal '00:00:02.500'", () => {
        const ts = TimeSpan.fromSeconds(2.5);
        expect(ts.to(m => `${m.Hours}:${m.Minutes}:${m.Seconds}.${m.Milliseconds}`)).toBe("00:00:02.500");
    });

    test(`Expect TimeSpan.fromHours(2.5).to("{{Hours}}:{{Minutes}}:{{Seconds}}.{{Milliseconds}}") to equal "02:30:00.000"`, () => {
        const ts = TimeSpan.fromHours(2.5);
        expect(ts.to("{{Hours}}:{{Minutes}}:{{Seconds}}.{{Milliseconds}}")).toBe("02:30:00.000");
    });

    test("Expect TimeSpan.fromHours(2.5).to(m => `${m.Hours}:${m.Minutes}:${m.Seconds}.${m.Milliseconds}`) to equal '02:30:00.000'", () => {
        const ts = TimeSpan.fromHours(2.5);
        expect(ts.to(m => `${m.Hours}:${m.Minutes}:${m.Seconds}.${m.Milliseconds}`)).toBe("02:30:00.000");
    });
})

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

suite(`Algorithmic Expressions`, () => {
    test(`Expect TimeSpan.fromSeconds(2).add(m => m.milliseconds(500)) to equal [Nanoseconds: 2500000000, Microseconds: 2500000, Milliseconds: 2500, Seconds: 2.5, Minutes: 0.04167]`, () => {
        const ts = TimeSpan.fromSeconds(2)
            .add(m => m.Milliseconds(500));
        expect(ts.to(m => m.Nanoseconds)).toBe(2500000000);
        expect(ts.to(m => m.Microseconds)).toBe(2500000);
        expect(ts.to(m => m.Milliseconds)).toBe(2500);
        expect(ts.to(m => m.Seconds)).toBe(2.5);
        expect(ts.to(m => m.Minutes)).toBe(0.04167);
    })
})

suite(`Cloning`, () => {
    test(`Expect TimeSpan.fromSeconds(2) to equal [Seconds: 2] and a separate TimeSpan created from first TimeSpan.sub(m => m.Seconds(1)) to equal [Seconds: 1].`, async () => {
        const ts = TimeSpan.fromSeconds(2);
        const ts_minus1sec = ts.sub(m => m.Seconds(1));
        expect(ts.to(m => m.Seconds)).toBe(2);
        expect(ts_minus1sec.to(m => m.Seconds)).toBe(1);
    })
})

// suite(`Utility Functions (timeout, interval, delay)`, async () => {
     
// });