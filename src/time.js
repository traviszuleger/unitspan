//@ts-check
import { UnitSpan } from "./unitspan.js";

/**
 * @extends {UnitSpan<typeof TimeSpanUnitsConverter>}
 */
export class TimeSpan extends UnitSpan {

    /**
     * Create a differential time span between two dates, `date1` and `date2`.
     * @param {Date} date1 
     * Start date
     * @param {Date} date2
     * End date 
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
     */
    static between(date1, date2) {
        return new TimeSpan((date1.getTime() - date2.getTime()) / TimeSpanUnitsConverter.Milliseconds);
    }

    /**
     * Create a differential time span between `January 1st, 1970 00:00:00 UTC` and now.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
     */
    static sinceEpoch() {
        return new TimeSpan(Date.now() / TimeSpanUnitsConverter.Milliseconds);
    }

    /**
     * Create a differential time span between a given date, `date`, and now.
     * @param {Date} date 
     * Date to differentiate between now.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
     */
    static since(date) {
        const time = Date.now() - date.getTime();
        return new TimeSpan(time / TimeSpanUnitsConverter.Milliseconds);
    }

    /**
     * Create a differential time span between now and a date in the future.
     * @param {Date} date 
     * Date to differentiate between now. (This can be in the past, it will just have negative units)
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
     */
    static until(date) {
        const time = date.getTime() - Date.now();
        return new TimeSpan(time / TimeSpanUnitsConverter.Milliseconds);
    }
    
    /**
     * Create a TimeSpan class with the initial number of nanoseconds.
     * @param {number} numNanoseconds 
     * Number of nanoseconds to initialize with.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
     */
    static fromNanoseconds(numNanoseconds) {
        return new TimeSpan(numNanoseconds);
    }

    /**
     * Create a TimeSpan class with the initial number of microseconds.
     * @param {number} numMicroseconds 
     * Number of microseconds to initialize with.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
     */
    static fromMicroseconds(numMicroseconds) {
        return new TimeSpan(numMicroseconds / TimeSpanUnitsConverter.Microseconds);
    }

    /**
     * Create a TimeSpan class with the initial number of milliseconds.
     * @param {number} numMilliseconds 
     * Number of milliseconds to initialize with.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
     */
    static fromMilliseconds(numMilliseconds) {
        return new TimeSpan(numMilliseconds / TimeSpanUnitsConverter.Milliseconds);
    }
    
    /**
     * Create a TimeSpan class with the initial number of seconds.
     * @param {number} numSeconds 
     * Number of seconds to initialize with.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
     */
    static fromSeconds(numSeconds) {
        return new TimeSpan(numSeconds / TimeSpanUnitsConverter.Seconds);
    }

    /**
     * Create a TimeSpan class with the initial number of minutes.
     * @param {number} numMinutes 
     * Number of minutes to initialize with.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
     */
    static fromMinutes(numMinutes) {
        return new TimeSpan(numMinutes / TimeSpanUnitsConverter.Minutes);
    }

    /**
     * Create a TimeSpan class with the initial number of hours.
     * @param {number} numHours 
     * Number of hours to initialize with.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
     */
    static fromHours(numHours) {
        return new TimeSpan(numHours / TimeSpanUnitsConverter.Hours);
    }
    
    /**
     * Create a TimeSpan class with the initial number of days.
     * @param {number} numDays 
     * Number of days to initialize with.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
     */
    static fromDays(numDays) {
        return new TimeSpan(numDays / TimeSpanUnitsConverter.Days);
    }

    /**
     * Create a TimeSpan class with the initial number of weeks.
     * @param {number} numWeeks 
     * Number of weeks to initialize with.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
     */
    static fromWeeks(numWeeks) {
        return new TimeSpan(numWeeks / TimeSpanUnitsConverter.Weeks);
    }

    /**
     * Create a TimeSpan class with the initial number of months.
     * @param {number} numMonths 
     * Number of months to initialize with.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
     */
    static fromMonths(numMonths) {
        return new TimeSpan(numMonths / TimeSpanUnitsConverter.Months);
    }

    /**
     * @protected
     * @param {number} quantity
     */
    constructor(quantity) {
        super(
            quantity,
            TimeSpanUnitsConverter, 
            TimeSpanUnitsFormatter, 
        );
    }

    /**
     * Create a timeout where `callback` is ran only after the time that this TimeSpan object holds has passed.
     * @usage
     * ```js
     * TimeSpan.fromSeconds(10).timeout(() => {
     *   console.log(`This will only print after 10 seconds`);
     * });
     * ```
     * @param {() => void|Promise<void>} callback 
     * Function
     * @returns {TimeoutController}
     * Object with `clear` and `refresh` functions to control the timeout.
     * 
     */
    timeout(callback) {
        let timeout = setTimeout(callback, Math.floor(this.to(m => m.Milliseconds)));
        const timeoutController = {
            cancel: () => { 
                clearTimeout(timeout);

            },
            refresh: () => { 
                clearTimeout(timeout); 
                timeout = setTimeout(callback, Math.floor(this.to(m => m.Milliseconds)));
                return timeoutController;
            }
        };
        return timeoutController;
    }

    /**
     * Create an interval where `callback` is ran for every time after the time that this TimeSpan object holds has passed.  
     * @usage
     * ```js
     * let i = 0;
     * const unsubscribe = TimeSpan.fromSeconds(10).interval(() => {
     *   console.log(`Printing ${i}/3`);
     *   if(++i === 3) {
     *     unsubscribe();
     *   }
     * });
     * 
     * // will print each line every 10 seconds:
     * // Printing 1/3
     * // Printing 2/3
     * // Printing 3/3
     * ```
     * @param {() => void|Promise<void>} callback 
     * @returns {IntervalController} Function to unsubscribe from the interval.
     */
    interval(callback) {
        /** @type {NodeJS.Timeout|undefined} */
        let interval = setInterval(callback, Math.floor(this.to(m => m.Milliseconds)));
        const intervalController = {
            cancel: () => { 
                clearInterval(interval);
                interval = undefined;
            },
            start: () => { 
                if(interval) {
                    clearInterval(interval); 
                }
                interval = setInterval(callback, Math.floor(this.to(m => m.Milliseconds)));
                return intervalController;
            },
            get isStarted() {
                return interval !== undefined;
            },
            get isStopped() {
                return interval === undefined;
            }
        };
        return intervalController;
    }

    /**
     * Create a Promise that will only resolve after the time that this TimeSpan object holds has passed.
     * @returns {Promise<void>}
     */
    delay() {
        return new Promise(resolve => this.timeout(resolve));
    }

    toYears() {
        return this.to(m => m.Years);
    }

    toMonths() {
        return this.to(m => m.Months);
    }

    toWeeks() {
        return this.to(m => m.Weeks);
    }

    toDays() {
        return this.to(m => m.Days);
    }

    toHours() {
        return this.to(m => m.Hours);
    }

    toMinutes() {
        return this.to(m => m.Minutes);
    }

    toSeconds() {
        return this.to(m => m.Seconds);
    }

    toMilliseconds() {
        return this.to(m => m.Milliseconds);
    }

    toMicroseconds() {
        return this.to(m => m.Microseconds);
    }

    toNanoseconds() {
        return this.to(m => m.Nanoseconds);
    }

    toString() {
        return this.to(m => `${m.hours}:${m.minutes}:${m.seconds}.${m.milliseconds}`);
    }
};

/** @enum {typeof TimeSpanUnitsConverter[keyof typeof TimeSpanUnitsConverter]} */
const TimeSpanUnitsConverter = Object.freeze({
    /** @deprecated */
    Nanoseconds: 1,
    /** @deprecated */
    Microseconds: 1/1000,
    /** @deprecated */
    Milliseconds: 1/1000/1000,
    /** @deprecated */
    Seconds: 1/1000/1000/1000,
    /** @deprecated */
    Minutes: 1/60/1000/1000/1000,
    /** @deprecated */
    Hours: 1/60/60/1000/1000/1000,
    /** @deprecated */
    Days: 1/24/60/60/1000/1000/1000,
    /** @deprecated */
    Weeks: 1/7/24/60/60/1000/1000/1000,
    /** @deprecated */
    Months: 1/30.437/24/60/60/1000/1000/1000,
    /** @deprecated */
    Years: 1/365.2425/24/60/60/1000/1000/1000,

    nanoseconds: 1,
    microseconds: 1/1000,
    milliseconds: 1/1000/1000,
    seconds: 1/1000/1000/1000,
    minutes: 1/60/1000/1000/1000,
    hours: 1/60/60/1000/1000/1000,
    days: 1/24/60/60/1000/1000/1000,
    weeks: 1/7/24/60/60/1000/1000/1000,
    months: 1/30.437/24/60/60/1000/1000/1000,
    years: 1/365.2425/24/60/60/1000/1000/1000
});

const TimeSpanUnitsFormatter = {
    Nanoseconds: {
        padStart: 3
    },
    Microseconds: {
        padStart: 3
    },
    Milliseconds: {
        padStart: 3
    },
    Seconds: {
        padStart: 2
    },
    Minutes: {
        padStart: 2
    },
    Hours: {
        padStart: 2
    },
    Days: {
        padStart: 2
    },
    Weeks: {
        padStart: 2
    },
    Months: {
        padStart: 2
    },
    Years: {
        padStart: 0
    },

    nanoseconds: {
        padStart: 3
    },
    microseconds: {
        padStart: 3
    },
    milliseconds: {
        padStart: 3
    },
    seconds: {
        padStart: 2
    },
    minutes: {
        padStart: 2
    },
    hours: {
        padStart: 2
    },
    days: {
        padStart: 2
    },
    weeks: {
        padStart: 2
    },
    months: {
        padStart: 2
    },
    years: {
        padStart: 0
    }
}

/**
 * @typedef TimeoutController
 * @prop {() => void} cancel
 * @prop {() => TimeoutController} refresh
 */

/**
 * @typedef IntervalController
 * @prop {() => void} cancel
 * Stops the interval.
 * @prop {() => IntervalController} start
 * Starts the interval again. If the interval is already ongoing, then the interval is restarted.
 * @prop {boolean} isStarted
 * Returns true if the interval is ongoing.
 * @prop {boolean} isStopped
 * Returns true if the interval is stopped.
 */