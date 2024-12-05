/**
 * @extends {UnitSpan<TimeSpanUnitsConverter>}
 */
export class TimeSpan extends UnitSpan<{
    Nanoseconds: number;
    Microseconds: number;
    Milliseconds: number;
    Seconds: number;
    Minutes: number;
    Hours: number;
    Days: number;
    Weeks: number;
    Months: number;
    Years: number;
}> {
    /**
     * Create a differential time span between two dates, `date1` and `date2`.
     * @param {Date} date1
     * Start date
     * @param {Date} date2
     * End date
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter}
     */
    static between(date1: Date, date2: Date): TimeSpan;
    /**
     * Create a differential time span between `January 1st, 1970 00:00:00 UTC` and now.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter}
     */
    static sinceEpoch(): TimeSpan;
    /**
     * Create a differential time span between a given date, `date`, and now.
     * @param {Date} date
     * Date to differentiate between now.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter}
     */
    static since(date: Date): TimeSpan;
    /**
     * Create a TimeSpan class with the initial number of nanoseconds.
     * @param {number} numNanoseconds
     * Number of nanoseconds to initialize with.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter}
     */
    static fromNanoseconds(numNanoseconds: number): TimeSpan;
    /**
     * Create a TimeSpan class with the initial number of microseconds.
     * @param {number} numMicroseconds
     * Number of microseconds to initialize with.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter}
     */
    static fromMicroseconds(numMicroseconds: number): TimeSpan;
    /**
     * Create a TimeSpan class with the initial number of milliseconds.
     * @param {number} numMilliseconds
     * Number of milliseconds to initialize with.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter}
     */
    static fromMilliseconds(numMilliseconds: number): TimeSpan;
    /**
     * Create a TimeSpan class with the initial number of seconds.
     * @param {number} numSeconds
     * Number of seconds to initialize with.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter}
     */
    static fromSeconds(numSeconds: number): TimeSpan;
    /**
     * Create a TimeSpan class with the initial number of minutes.
     * @param {number} numMinutes
     * Number of minutes to initialize with.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter}
     */
    static fromMinutes(numMinutes: number): TimeSpan;
    /**
     * Create a TimeSpan class with the initial number of hours.
     * @param {number} numHours
     * Number of hours to initialize with.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter}
     */
    static fromHours(numHours: number): TimeSpan;
    /**
     * Create a TimeSpan class with the initial number of days.
     * @param {number} numDays
     * Number of days to initialize with.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter}
     */
    static fromDays(numDays: number): TimeSpan;
    /**
     * Create a TimeSpan class with the initial number of weeks.
     * @param {number} numWeeks
     * Number of weeks to initialize with.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter}
     */
    static fromWeeks(numWeeks: number): TimeSpan;
    /**
     * Create a TimeSpan class with the initial number of months.
     * @param {number} numMonths
     * Number of months to initialize with.
     * @returns {TimeSpan}
     * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter}
     */
    static fromMonths(numMonths: number): TimeSpan;
    /**
     * @param {number} quantity
     * @protected
     */
    protected constructor();
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
     * @returns {() => void} Function to unsubscribe from the timeout.
     *
     */
    timeout(callback: () => void | Promise<void>): () => void;
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
     * @returns {() => void} Function to unsubscribe from the interval.
     */
    interval(callback: () => void | Promise<void>): () => void;
    /**
     * Create a Promise that will only resolve after the time that this TimeSpan object holds has passed.
     * @returns {Promise<void>}
     */
    delay(): Promise<void>;
}
import { UnitSpan } from "./unitspan.js";
