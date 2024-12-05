// src/unitspan.js
var UnitSpan = class {
  /** @type {T} */
  #converter;
  /** @type {number} */
  #precision;
  /** 
   * @protected 
   * @type {number} 
   */
  __value;
  /**
   * @param {T} converter 
   * @param {number} initialValue
   * @param {number} precision
   */
  constructor(converter, initialValue, precision = 5) {
    this.#converter = converter;
    this.__value = initialValue;
    this.#precision = 10 ** precision;
  }
  /**
   * @param {(obj: {[K in keyof T]: (quantity: number) => void}) => void} callback
   * @returns {this}
   */
  add(callback) {
    const clone = this.#clone();
    const t = new Proxy(
      /** @type {any} */
      { ...clone.#converter },
      {
        get: (t2, p, r) => {
          if (typeof p !== "string") {
            throw new Error(`Property "${String(p)}" is not of type string.`);
          }
          return (quantity) => {
            clone.__value += quantity / clone.#converter[p];
          };
        }
      }
    );
    callback(t);
    return (
      /** @type {any} */
      clone
    );
  }
  /**
   * @param {(obj: {[K in keyof T]: (quantity: number) => void}) => void} callback
   * @returns {this}
   */
  sub(callback) {
    const clone = this.#clone();
    const t = new Proxy(
      /** @type {any} */
      { ...clone.#converter },
      {
        get: (t2, p, r) => {
          if (typeof p !== "string") {
            throw new Error(`Property "${String(p)}" is not of type string.`);
          }
          return (quantity) => {
            clone.__value -= quantity / clone.#converter[p];
          };
        }
      }
    );
    callback(t);
    return (
      /** @type {any} */
      clone
    );
  }
  /**
   * Get the conversion of units as specified from the property reference (and return value) from the `model` parameter used in `callback`.
   * @overload
   * @param {(model: PropertyRetriever<T>) => keyof T} callback
   * Callback used to get the type of conversion (or otherwise, the key of conversion) to use when converting.
   * @returns {number}
   * The converted number from the unit quantity held by this UnitSpan class object.
   * @overload
   * @param {keyof T} key
   * Some string property of the conversion object to use when converting. 
   * @returns {number}
   * The converted number from the unit quantity held by this UnitSpan class object.
   * @param {((model: PropertyRetriever<T>) => keyof T)|keyof T} callback
   * @returns {number}
   */
  to(callback) {
    if (typeof callback === "function") {
      const t = new Proxy(
        /** @type {any} */
        { ...this.#converter },
        {
          get: (t2, p, r) => {
            return p;
          }
        }
      );
      const val2 = this.#converter[callback(t)] * this.__value;
      return Math.round(val2 * this.#precision) / this.#precision;
    }
    const val = this.#converter[callback] * this.__value;
    return Math.round(val * this.#precision) / this.#precision;
  }
  /**
   * Set the precision of the resulting conversions.
   * @param {number} numDigits 
   * @returns {this}
   */
  precision(numDigits) {
    const clone = this.#clone();
    clone.#precision = 10 ** numDigits;
    return (
      /** @type {any} */
      clone
    );
  }
  /**
   * 
   */
  #clone() {
    const clone = new /** @type {any} */
    this.constructor(this.#converter);
    clone.__value = this.__value;
    return clone;
  }
};

// src/time.js
var TimeSpan = class _TimeSpan extends UnitSpan {
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
    return new _TimeSpan((date1.getTime() - date2.getTime()) / TimeSpanUnitsConverter.Milliseconds);
  }
  /**
   * Create a differential time span between `January 1st, 1970 00:00:00 UTC` and now.
   * @returns {TimeSpan}
   * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
   */
  static sinceEpoch() {
    return new _TimeSpan(Date.now() / TimeSpanUnitsConverter.Milliseconds);
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
    return new _TimeSpan(time / TimeSpanUnitsConverter.Milliseconds);
  }
  /**
   * Create a TimeSpan class with the initial number of nanoseconds.
   * @param {number} numNanoseconds 
   * Number of nanoseconds to initialize with.
   * @returns {TimeSpan}
   * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
   */
  static fromNanoseconds(numNanoseconds) {
    return new _TimeSpan(numNanoseconds);
  }
  /**
   * Create a TimeSpan class with the initial number of microseconds.
   * @param {number} numMicroseconds 
   * Number of microseconds to initialize with.
   * @returns {TimeSpan}
   * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
   */
  static fromMicroseconds(numMicroseconds) {
    return new _TimeSpan(numMicroseconds / TimeSpanUnitsConverter.Microseconds);
  }
  /**
   * Create a TimeSpan class with the initial number of milliseconds.
   * @param {number} numMilliseconds 
   * Number of milliseconds to initialize with.
   * @returns {TimeSpan}
   * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
   */
  static fromMilliseconds(numMilliseconds) {
    return new _TimeSpan(numMilliseconds / TimeSpanUnitsConverter.Milliseconds);
  }
  /**
   * Create a TimeSpan class with the initial number of seconds.
   * @param {number} numSeconds 
   * Number of seconds to initialize with.
   * @returns {TimeSpan}
   * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
   */
  static fromSeconds(numSeconds) {
    return new _TimeSpan(numSeconds / TimeSpanUnitsConverter.Seconds);
  }
  /**
   * Create a TimeSpan class with the initial number of minutes.
   * @param {number} numMinutes 
   * Number of minutes to initialize with.
   * @returns {TimeSpan}
   * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
   */
  static fromMinutes(numMinutes) {
    return new _TimeSpan(numMinutes / TimeSpanUnitsConverter.Minutes);
  }
  /**
   * Create a TimeSpan class with the initial number of hours.
   * @param {number} numHours 
   * Number of hours to initialize with.
   * @returns {TimeSpan}
   * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
   */
  static fromHours(numHours) {
    return new _TimeSpan(numHours / TimeSpanUnitsConverter.Hours);
  }
  /**
   * Create a TimeSpan class with the initial number of days.
   * @param {number} numDays 
   * Number of days to initialize with.
   * @returns {TimeSpan}
   * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
   */
  static fromDays(numDays) {
    return new _TimeSpan(numDays / TimeSpanUnitsConverter.Days);
  }
  /**
   * Create a TimeSpan class with the initial number of weeks.
   * @param {number} numWeeks 
   * Number of weeks to initialize with.
   * @returns {TimeSpan}
   * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
   */
  static fromWeeks(numWeeks) {
    return new _TimeSpan(numWeeks / TimeSpanUnitsConverter.Weeks);
  }
  /**
   * Create a TimeSpan class with the initial number of months.
   * @param {number} numMonths 
   * Number of months to initialize with.
   * @returns {TimeSpan}
   * New {@link TimeSpan} class object that can convert between other units of measurement per {@link TimeSpanUnitsConverter} 
   */
  static fromMonths(numMonths) {
    return new _TimeSpan(numMonths / TimeSpanUnitsConverter.Months);
  }
  /**
   * @param {number} quantity
   * @protected
   */
  constructor(quantity) {
    super(TimeSpanUnitsConverter, quantity);
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
   * @returns {() => void} Function to unsubscribe from the timeout.
   * 
   */
  timeout(callback) {
    const timeout = setTimeout(callback, Math.floor(this.to((m) => m.Milliseconds)));
    return () => {
      clearTimeout(timeout);
    };
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
   * @returns {() => void} Function to unsubscribe from the interval.
   */
  interval(callback) {
    const interval = setInterval(callback, Math.floor(this.to((m) => m.Milliseconds)));
    return () => {
      clearInterval(interval);
    };
  }
  /**
   * Create a Promise that will only resolve after the time that this TimeSpan object holds has passed.
   * @returns {Promise<void>}
   */
  delay() {
    return new Promise((resolve) => this.timeout(resolve));
  }
};
var TimeSpanUnitsConverter = {
  Nanoseconds: 1,
  Microseconds: 1 / 1e3,
  Milliseconds: 1 / 1e3 / 1e3,
  Seconds: 1 / 1e3 / 1e3 / 1e3,
  Minutes: 1 / 60 / 1e3 / 1e3 / 1e3,
  Hours: 1 / 60 / 60 / 1e3 / 1e3 / 1e3,
  Days: 1 / 24 / 60 / 60 / 1e3 / 1e3 / 1e3,
  Weeks: 1 / 7 / 24 / 60 / 60 / 1e3 / 1e3 / 1e3,
  Months: 1 / 30.437 / 24 / 60 / 60 / 1e3 / 1e3 / 1e3,
  Years: 1 / 365.2425 / 24 / 60 / 60 / 1e3 / 1e3 / 1e3
};

// src/digi.js
var DigiSpan = class _DigiSpan extends UnitSpan {
  /**
   * @param {number} numBits
   */
  static fromBits(numBits) {
    return new _DigiSpan(numBits);
  }
  /**
   * @param {number} numBytes 
   */
  static fromBytes(numBytes) {
    return new _DigiSpan(numBytes / DigitalSpanUnitsConverter.Bytes);
  }
  /**
   * 
   * @param {number} numKibiBytes 
   */
  static fromKibiBytes(numKibiBytes) {
    return new _DigiSpan(numKibiBytes / DigitalSpanUnitsConverter.Kibibytes);
  }
  /**
   * 
   * @param {number} numMebiBytes 
   */
  static fromMebiBytes(numMebiBytes) {
    return new _DigiSpan(numMebiBytes / DigitalSpanUnitsConverter.Mebibytes);
  }
  /**
   * @param {number} quantity
   * @protected
   */
  constructor(quantity) {
    super(DigitalSpanUnitsConverter, quantity);
  }
};
var DigitalSpanUnitsConverter = Object.freeze({
  Bits: 1,
  Bytes: 1 / 8,
  Kibibytes: 1 / 1024 / 8,
  Mebibytes: 1 / 1024 / 1024 / 8,
  Gibibytes: 1 / 1024 / 1024 / 1024 / 8,
  Tebibytes: 1 / 1024 / 1024 / 1024 / 1024 / 8,
  Kilobytes: 1 / 1e3 / 8,
  Megabytes: 1 / 1e3 / 1e3 / 8,
  Gigabytes: 1 / 1e3 / 1e3 / 1e3 / 8,
  Terabytes: 1 / 1e3 / 1e3 / 1e3 / 1e3 / 8
});

export { DigiSpan, TimeSpan };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91bml0c3Bhbi5qcyIsIi4uL3NyYy90aW1lLmpzIiwiLi4vc3JjL2RpZ2kuanMiXSwibmFtZXMiOlsidCIsInZhbCJdLCJtYXBwaW5ncyI6IjtBQUtPLElBQU0sV0FBTixNQUFlO0FBQUE7QUFBQSxFQUVsQixVQUFBO0FBQUE7QUFBQSxFQUVBLFVBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsT0FBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU9BLFdBQVksQ0FBQSxTQUFBLEVBQVcsWUFBYyxFQUFBLFNBQUEsR0FBVSxDQUFHLEVBQUE7QUFDOUMsSUFBQSxJQUFBLENBQUssVUFBYSxHQUFBLFNBQUE7QUFDbEIsSUFBQSxJQUFBLENBQUssT0FBVSxHQUFBLFlBQUE7QUFDZixJQUFBLElBQUEsQ0FBSyxhQUFhLEVBQU0sSUFBQSxTQUFBO0FBQUE7QUFDNUI7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU1BLElBQUksUUFBVSxFQUFBO0FBQ1YsSUFBTSxNQUFBLEtBQUEsR0FBUSxLQUFLLE1BQU8sRUFBQTtBQUMxQixJQUFBLE1BQU0sSUFBSSxJQUFJLEtBQUE7QUFBQTtBQUFBLE1BQXlCLEVBQUMsR0FBRyxLQUFBLENBQU0sVUFBVSxFQUFBO0FBQUEsTUFBSTtBQUFBLFFBQzNELEdBQUssRUFBQSxDQUFDQSxFQUFFLEVBQUEsQ0FBQSxFQUFFLENBQU0sS0FBQTtBQUNaLFVBQUcsSUFBQSxPQUFPLE1BQU0sUUFBVSxFQUFBO0FBQ3RCLFlBQUEsTUFBTSxJQUFJLEtBQU0sQ0FBQSxDQUFBLFVBQUEsRUFBYSxNQUFPLENBQUEsQ0FBQyxDQUFDLENBQTBCLHdCQUFBLENBQUEsQ0FBQTtBQUFBO0FBRXBFLFVBQUEsT0FBTyxDQUFDLFFBQWEsS0FBQTtBQUNqQixZQUFBLEtBQUEsQ0FBTSxPQUFXLElBQUEsUUFBQSxHQUFXLEtBQU0sQ0FBQSxVQUFBLENBQVcsQ0FBQyxDQUFBO0FBQUEsV0FDbEQ7QUFBQTtBQUNKO0FBQ0osS0FB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MkIsUUFBUSxDQUFBO0FBQUE7QUFFakQ7QUFFQSxJQUFNLHlCQUFBLEdBQTRCLE9BQU8sTUFBTyxDQUFBO0FBQUEsRUFDNUMsSUFBTSxFQUFBLENBQUE7QUFBQSxFQUNOLE9BQU8sQ0FBRSxHQUFBLENBQUE7QUFBQSxFQUNULFNBQUEsRUFBVyxJQUFFLElBQUssR0FBQSxDQUFBO0FBQUEsRUFDbEIsU0FBQSxFQUFXLENBQUUsR0FBQSxJQUFBLEdBQUssSUFBSyxHQUFBLENBQUE7QUFBQSxFQUN2QixTQUFXLEVBQUEsQ0FBQSxHQUFFLElBQUssR0FBQSxJQUFBLEdBQUssSUFBSyxHQUFBLENBQUE7QUFBQSxFQUM1QixTQUFXLEVBQUEsQ0FBQSxHQUFFLElBQUssR0FBQSxJQUFBLEdBQUssT0FBSyxJQUFLLEdBQUEsQ0FBQTtBQUFBLEVBQ2pDLFNBQUEsRUFBVyxJQUFFLEdBQUssR0FBQSxDQUFBO0FBQUEsRUFDbEIsU0FBQSxFQUFXLENBQUUsR0FBQSxHQUFBLEdBQUssR0FBSyxHQUFBLENBQUE7QUFBQSxFQUN2QixTQUFXLEVBQUEsQ0FBQSxHQUFFLEdBQUssR0FBQSxHQUFBLEdBQUssR0FBSyxHQUFBLENBQUE7QUFBQSxFQUM1QixTQUFXLEVBQUEsQ0FBQSxHQUFFLEdBQUssR0FBQSxHQUFBLEdBQUssTUFBSyxHQUFLLEdBQUE7QUFDckMsQ0FBQyxDQUFBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy9AdHMtY2hlY2tcblxuLyoqXG4gKiBAdGVtcGxhdGUge1JlY29yZDxzdHJpbmcsIG51bWJlcj59IFRcbiAqL1xuZXhwb3J0IGNsYXNzIFVuaXRTcGFuIHtcbiAgICAvKiogQHR5cGUge1R9ICovXG4gICAgI2NvbnZlcnRlcjtcbiAgICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgICAjcHJlY2lzaW9uO1xuICAgIC8qKiBcbiAgICAgKiBAcHJvdGVjdGVkIFxuICAgICAqIEB0eXBlIHtudW1iZXJ9IFxuICAgICAqL1xuICAgIF9fdmFsdWU7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge1R9IGNvbnZlcnRlciBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5pdGlhbFZhbHVlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByZWNpc2lvblxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNvbnZlcnRlciwgaW5pdGlhbFZhbHVlLCBwcmVjaXNpb249NSkge1xuICAgICAgICB0aGlzLiNjb252ZXJ0ZXIgPSBjb252ZXJ0ZXI7XG4gICAgICAgIHRoaXMuX192YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgICAgICAgdGhpcy4jcHJlY2lzaW9uID0gMTAgKiogcHJlY2lzaW9uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7KG9iajoge1tLIGluIGtleW9mIFRdOiAocXVhbnRpdHk6IG51bWJlcikgPT4gdm9pZH0pID0+IHZvaWR9IGNhbGxiYWNrXG4gICAgICogQHJldHVybnMge3RoaXN9XG4gICAgICovXG4gICAgYWRkKGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IGNsb25lID0gdGhpcy4jY2xvbmUoKTtcbiAgICAgICAgY29uc3QgdCA9IG5ldyBQcm94eSgvKiogQHR5cGUge2FueX0gKi8oey4uLmNsb25lLiNjb252ZXJ0ZXJ9KSwge1xuICAgICAgICAgICAgZ2V0OiAodCxwLHIpID0+IHtcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgcCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFByb3BlcnR5IFwiJHtTdHJpbmcocCl9XCIgaXMgbm90IG9mIHR5cGUgc3RyaW5nLmApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gKHF1YW50aXR5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNsb25lLl9fdmFsdWUgKz0gcXVhbnRpdHkgLyBjbG9uZS4jY29udmVydGVyW3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNhbGxiYWNrKHQpO1xuICAgICAgICByZXR1cm4gLyoqIEB0eXBlIHthbnl9ICovIChjbG9uZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHsob2JqOiB7W0sgaW4ga2V5b2YgVF06IChxdWFudGl0eTogbnVtYmVyKSA9PiB2b2lkfSkgPT4gdm9pZH0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICAgKi9cbiAgICBzdWIoY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgY2xvbmUgPSB0aGlzLiNjbG9uZSgpO1xuICAgICAgICBjb25zdCB0ID0gbmV3IFByb3h5KC8qKiBAdHlwZSB7YW55fSAqLyh7Li4uY2xvbmUuI2NvbnZlcnRlcn0pLCB7XG4gICAgICAgICAgICBnZXQ6ICh0LHAscikgPT4ge1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBwICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUHJvcGVydHkgXCIke1N0cmluZyhwKX1cIiBpcyBub3Qgb2YgdHlwZSBzdHJpbmcuYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAocXVhbnRpdHkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY2xvbmUuX192YWx1ZSAtPSBxdWFudGl0eSAvIGNsb25lLiNjb252ZXJ0ZXJbcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY2FsbGJhY2sodCk7XG4gICAgICAgIHJldHVybiAvKiogQHR5cGUge2FueX0gKi8gKGNsb25lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGNvbnZlcnNpb24gb2YgdW5pdHMgYXMgc3BlY2lmaWVkIGZyb20gdGhlIHByb3BlcnR5IHJlZmVyZW5jZSAoYW5kIHJldHVybiB2YWx1ZSkgZnJvbSB0aGUgYG1vZGVsYCBwYXJhbWV0ZXIgdXNlZCBpbiBgY2FsbGJhY2tgLlxuICAgICAqIEBvdmVybG9hZFxuICAgICAqIEBwYXJhbSB7KG1vZGVsOiBQcm9wZXJ0eVJldHJpZXZlcjxUPikgPT4ga2V5b2YgVH0gY2FsbGJhY2tcbiAgICAgKiBDYWxsYmFjayB1c2VkIHRvIGdldCB0aGUgdHlwZSBvZiBjb252ZXJzaW9uIChvciBvdGhlcndpc2UsIHRoZSBrZXkgb2YgY29udmVyc2lvbikgdG8gdXNlIHdoZW4gY29udmVydGluZy5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqIFRoZSBjb252ZXJ0ZWQgbnVtYmVyIGZyb20gdGhlIHVuaXQgcXVhbnRpdHkgaGVsZCBieSB0aGlzIFVuaXRTcGFuIGNsYXNzIG9iamVjdC5cbiAgICAgKiBAb3ZlcmxvYWRcbiAgICAgKiBAcGFyYW0ge2tleW9mIFR9IGtleVxuICAgICAqIFNvbWUgc3RyaW5nIHByb3BlcnR5IG9mIHRoZSBjb252ZXJzaW9uIG9iamVjdCB0byB1c2Ugd2hlbiBjb252ZXJ0aW5nLiBcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqIFRoZSBjb252ZXJ0ZWQgbnVtYmVyIGZyb20gdGhlIHVuaXQgcXVhbnRpdHkgaGVsZCBieSB0aGlzIFVuaXRTcGFuIGNsYXNzIG9iamVjdC5cbiAgICAgKiBAcGFyYW0geygobW9kZWw6IFByb3BlcnR5UmV0cmlldmVyPFQ+KSA9PiBrZXlvZiBUKXxrZXlvZiBUfSBjYWxsYmFja1xuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgdG8oY2FsbGJhY2spIHtcbiAgICAgICAgaWYodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHQgPSBuZXcgUHJveHkoLyoqIEB0eXBlIHthbnl9ICovKHsuLi50aGlzLiNjb252ZXJ0ZXJ9KSwge1xuICAgICAgICAgICAgICAgIGdldDogKHQscCxyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgdmFsID0gdGhpcy4jY29udmVydGVyW2NhbGxiYWNrKHQpXSAqIHRoaXMuX192YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHZhbCAqIHRoaXMuI3ByZWNpc2lvbikgLyB0aGlzLiNwcmVjaXNpb247XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdmFsID0gdGhpcy4jY29udmVydGVyW2NhbGxiYWNrXSAqIHRoaXMuX192YWx1ZTtcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQodmFsICogdGhpcy4jcHJlY2lzaW9uKSAvIHRoaXMuI3ByZWNpc2lvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIHByZWNpc2lvbiBvZiB0aGUgcmVzdWx0aW5nIGNvbnZlcnNpb25zLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1EaWdpdHMgXG4gICAgICogQHJldHVybnMge3RoaXN9XG4gICAgICovXG4gICAgcHJlY2lzaW9uKG51bURpZ2l0cykge1xuICAgICAgICBjb25zdCBjbG9uZSA9IHRoaXMuI2Nsb25lKCk7XG4gICAgICAgIGNsb25lLiNwcmVjaXNpb24gPSAxMCAqKiBudW1EaWdpdHM7XG4gICAgICAgIHJldHVybiAvKiogQHR5cGUge2FueX0gKi8gKGNsb25lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKi9cbiAgICAjY2xvbmUoKSB7XG4gICAgICAgIGNvbnN0IGNsb25lID0gbmV3IC8qKiBAdHlwZSB7YW55fSAqLyAodGhpcy5jb25zdHJ1Y3RvcikodGhpcy4jY29udmVydGVyKTtcbiAgICAgICAgY2xvbmUuX192YWx1ZSA9IHRoaXMuX192YWx1ZTtcbiAgICAgICAgcmV0dXJuIGNsb25lO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAdGVtcGxhdGUge1JlY29yZDxzdHJpbmcsYW55Pn0gVFxuICogQHR5cGVkZWYge3tbSyBpbiBrZXlvZiBUXTogS319IFByb3BlcnR5UmV0cmlldmVyXG4gKi8iLCIvL0B0cy1jaGVja1xuaW1wb3J0IHsgVW5pdFNwYW4gfSBmcm9tIFwiLi91bml0c3Bhbi5qc1wiO1xuXG4vKipcbiAqIEBleHRlbmRzIHtVbml0U3BhbjxUaW1lU3BhblVuaXRzQ29udmVydGVyPn1cbiAqL1xuZXhwb3J0IGNsYXNzIFRpbWVTcGFuIGV4dGVuZHMgVW5pdFNwYW4ge1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgZGlmZmVyZW50aWFsIHRpbWUgc3BhbiBiZXR3ZWVuIHR3byBkYXRlcywgYGRhdGUxYCBhbmQgYGRhdGUyYC5cbiAgICAgKiBAcGFyYW0ge0RhdGV9IGRhdGUxIFxuICAgICAqIFN0YXJ0IGRhdGVcbiAgICAgKiBAcGFyYW0ge0RhdGV9IGRhdGUyXG4gICAgICogRW5kIGRhdGUgXG4gICAgICogQHJldHVybnMge1RpbWVTcGFufVxuICAgICAqIE5ldyB7QGxpbmsgVGltZVNwYW59IGNsYXNzIG9iamVjdCB0aGF0IGNhbiBjb252ZXJ0IGJldHdlZW4gb3RoZXIgdW5pdHMgb2YgbWVhc3VyZW1lbnQgcGVyIHtAbGluayBUaW1lU3BhblVuaXRzQ29udmVydGVyfSBcbiAgICAgKi9cbiAgICBzdGF0aWMgYmV0d2VlbihkYXRlMSwgZGF0ZTIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lU3BhbigoZGF0ZTEuZ2V0VGltZSgpIC0gZGF0ZTIuZ2V0VGltZSgpKSAvIFRpbWVTcGFuVW5pdHNDb252ZXJ0ZXIuTWlsbGlzZWNvbmRzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBkaWZmZXJlbnRpYWwgdGltZSBzcGFuIGJldHdlZW4gYEphbnVhcnkgMXN0LCAxOTcwIDAwOjAwOjAwIFVUQ2AgYW5kIG5vdy5cbiAgICAgKiBAcmV0dXJucyB7VGltZVNwYW59XG4gICAgICogTmV3IHtAbGluayBUaW1lU3Bhbn0gY2xhc3Mgb2JqZWN0IHRoYXQgY2FuIGNvbnZlcnQgYmV0d2VlbiBvdGhlciB1bml0cyBvZiBtZWFzdXJlbWVudCBwZXIge0BsaW5rIFRpbWVTcGFuVW5pdHNDb252ZXJ0ZXJ9IFxuICAgICAqL1xuICAgIHN0YXRpYyBzaW5jZUVwb2NoKCkge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVTcGFuKERhdGUubm93KCkgLyBUaW1lU3BhblVuaXRzQ29udmVydGVyLk1pbGxpc2Vjb25kcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgZGlmZmVyZW50aWFsIHRpbWUgc3BhbiBiZXR3ZWVuIGEgZ2l2ZW4gZGF0ZSwgYGRhdGVgLCBhbmQgbm93LlxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSBcbiAgICAgKiBEYXRlIHRvIGRpZmZlcmVudGlhdGUgYmV0d2VlbiBub3cuXG4gICAgICogQHJldHVybnMge1RpbWVTcGFufVxuICAgICAqIE5ldyB7QGxpbmsgVGltZVNwYW59IGNsYXNzIG9iamVjdCB0aGF0IGNhbiBjb252ZXJ0IGJldHdlZW4gb3RoZXIgdW5pdHMgb2YgbWVhc3VyZW1lbnQgcGVyIHtAbGluayBUaW1lU3BhblVuaXRzQ29udmVydGVyfSBcbiAgICAgKi9cbiAgICBzdGF0aWMgc2luY2UoZGF0ZSkge1xuICAgICAgICBjb25zdCB0aW1lID0gRGF0ZS5ub3coKSAtIGRhdGUuZ2V0VGltZSgpO1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVTcGFuKHRpbWUgLyBUaW1lU3BhblVuaXRzQ29udmVydGVyLk1pbGxpc2Vjb25kcyk7XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIFRpbWVTcGFuIGNsYXNzIHdpdGggdGhlIGluaXRpYWwgbnVtYmVyIG9mIG5hbm9zZWNvbmRzLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1OYW5vc2Vjb25kcyBcbiAgICAgKiBOdW1iZXIgb2YgbmFub3NlY29uZHMgdG8gaW5pdGlhbGl6ZSB3aXRoLlxuICAgICAqIEByZXR1cm5zIHtUaW1lU3Bhbn1cbiAgICAgKiBOZXcge0BsaW5rIFRpbWVTcGFufSBjbGFzcyBvYmplY3QgdGhhdCBjYW4gY29udmVydCBiZXR3ZWVuIG90aGVyIHVuaXRzIG9mIG1lYXN1cmVtZW50IHBlciB7QGxpbmsgVGltZVNwYW5Vbml0c0NvbnZlcnRlcn0gXG4gICAgICovXG4gICAgc3RhdGljIGZyb21OYW5vc2Vjb25kcyhudW1OYW5vc2Vjb25kcykge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVTcGFuKG51bU5hbm9zZWNvbmRzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBUaW1lU3BhbiBjbGFzcyB3aXRoIHRoZSBpbml0aWFsIG51bWJlciBvZiBtaWNyb3NlY29uZHMuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bU1pY3Jvc2Vjb25kcyBcbiAgICAgKiBOdW1iZXIgb2YgbWljcm9zZWNvbmRzIHRvIGluaXRpYWxpemUgd2l0aC5cbiAgICAgKiBAcmV0dXJucyB7VGltZVNwYW59XG4gICAgICogTmV3IHtAbGluayBUaW1lU3Bhbn0gY2xhc3Mgb2JqZWN0IHRoYXQgY2FuIGNvbnZlcnQgYmV0d2VlbiBvdGhlciB1bml0cyBvZiBtZWFzdXJlbWVudCBwZXIge0BsaW5rIFRpbWVTcGFuVW5pdHNDb252ZXJ0ZXJ9IFxuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tTWljcm9zZWNvbmRzKG51bU1pY3Jvc2Vjb25kcykge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVTcGFuKG51bU1pY3Jvc2Vjb25kcyAvIFRpbWVTcGFuVW5pdHNDb252ZXJ0ZXIuTWljcm9zZWNvbmRzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBUaW1lU3BhbiBjbGFzcyB3aXRoIHRoZSBpbml0aWFsIG51bWJlciBvZiBtaWxsaXNlY29uZHMuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bU1pbGxpc2Vjb25kcyBcbiAgICAgKiBOdW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGluaXRpYWxpemUgd2l0aC5cbiAgICAgKiBAcmV0dXJucyB7VGltZVNwYW59XG4gICAgICogTmV3IHtAbGluayBUaW1lU3Bhbn0gY2xhc3Mgb2JqZWN0IHRoYXQgY2FuIGNvbnZlcnQgYmV0d2VlbiBvdGhlciB1bml0cyBvZiBtZWFzdXJlbWVudCBwZXIge0BsaW5rIFRpbWVTcGFuVW5pdHNDb252ZXJ0ZXJ9IFxuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tTWlsbGlzZWNvbmRzKG51bU1pbGxpc2Vjb25kcykge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVTcGFuKG51bU1pbGxpc2Vjb25kcyAvIFRpbWVTcGFuVW5pdHNDb252ZXJ0ZXIuTWlsbGlzZWNvbmRzKTtcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgVGltZVNwYW4gY2xhc3Mgd2l0aCB0aGUgaW5pdGlhbCBudW1iZXIgb2Ygc2Vjb25kcy5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtU2Vjb25kcyBcbiAgICAgKiBOdW1iZXIgb2Ygc2Vjb25kcyB0byBpbml0aWFsaXplIHdpdGguXG4gICAgICogQHJldHVybnMge1RpbWVTcGFufVxuICAgICAqIE5ldyB7QGxpbmsgVGltZVNwYW59IGNsYXNzIG9iamVjdCB0aGF0IGNhbiBjb252ZXJ0IGJldHdlZW4gb3RoZXIgdW5pdHMgb2YgbWVhc3VyZW1lbnQgcGVyIHtAbGluayBUaW1lU3BhblVuaXRzQ29udmVydGVyfSBcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbVNlY29uZHMobnVtU2Vjb25kcykge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVTcGFuKG51bVNlY29uZHMgLyBUaW1lU3BhblVuaXRzQ29udmVydGVyLlNlY29uZHMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIFRpbWVTcGFuIGNsYXNzIHdpdGggdGhlIGluaXRpYWwgbnVtYmVyIG9mIG1pbnV0ZXMuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bU1pbnV0ZXMgXG4gICAgICogTnVtYmVyIG9mIG1pbnV0ZXMgdG8gaW5pdGlhbGl6ZSB3aXRoLlxuICAgICAqIEByZXR1cm5zIHtUaW1lU3Bhbn1cbiAgICAgKiBOZXcge0BsaW5rIFRpbWVTcGFufSBjbGFzcyBvYmplY3QgdGhhdCBjYW4gY29udmVydCBiZXR3ZWVuIG90aGVyIHVuaXRzIG9mIG1lYXN1cmVtZW50IHBlciB7QGxpbmsgVGltZVNwYW5Vbml0c0NvbnZlcnRlcn0gXG4gICAgICovXG4gICAgc3RhdGljIGZyb21NaW51dGVzKG51bU1pbnV0ZXMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lU3BhbihudW1NaW51dGVzIC8gVGltZVNwYW5Vbml0c0NvbnZlcnRlci5NaW51dGVzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBUaW1lU3BhbiBjbGFzcyB3aXRoIHRoZSBpbml0aWFsIG51bWJlciBvZiBob3Vycy5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtSG91cnMgXG4gICAgICogTnVtYmVyIG9mIGhvdXJzIHRvIGluaXRpYWxpemUgd2l0aC5cbiAgICAgKiBAcmV0dXJucyB7VGltZVNwYW59XG4gICAgICogTmV3IHtAbGluayBUaW1lU3Bhbn0gY2xhc3Mgb2JqZWN0IHRoYXQgY2FuIGNvbnZlcnQgYmV0d2VlbiBvdGhlciB1bml0cyBvZiBtZWFzdXJlbWVudCBwZXIge0BsaW5rIFRpbWVTcGFuVW5pdHNDb252ZXJ0ZXJ9IFxuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tSG91cnMobnVtSG91cnMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lU3BhbihudW1Ib3VycyAvIFRpbWVTcGFuVW5pdHNDb252ZXJ0ZXIuSG91cnMpO1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBUaW1lU3BhbiBjbGFzcyB3aXRoIHRoZSBpbml0aWFsIG51bWJlciBvZiBkYXlzLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1EYXlzIFxuICAgICAqIE51bWJlciBvZiBkYXlzIHRvIGluaXRpYWxpemUgd2l0aC5cbiAgICAgKiBAcmV0dXJucyB7VGltZVNwYW59XG4gICAgICogTmV3IHtAbGluayBUaW1lU3Bhbn0gY2xhc3Mgb2JqZWN0IHRoYXQgY2FuIGNvbnZlcnQgYmV0d2VlbiBvdGhlciB1bml0cyBvZiBtZWFzdXJlbWVudCBwZXIge0BsaW5rIFRpbWVTcGFuVW5pdHNDb252ZXJ0ZXJ9IFxuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tRGF5cyhudW1EYXlzKSB7XG4gICAgICAgIHJldHVybiBuZXcgVGltZVNwYW4obnVtRGF5cyAvIFRpbWVTcGFuVW5pdHNDb252ZXJ0ZXIuRGF5cyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgVGltZVNwYW4gY2xhc3Mgd2l0aCB0aGUgaW5pdGlhbCBudW1iZXIgb2Ygd2Vla3MuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bVdlZWtzIFxuICAgICAqIE51bWJlciBvZiB3ZWVrcyB0byBpbml0aWFsaXplIHdpdGguXG4gICAgICogQHJldHVybnMge1RpbWVTcGFufVxuICAgICAqIE5ldyB7QGxpbmsgVGltZVNwYW59IGNsYXNzIG9iamVjdCB0aGF0IGNhbiBjb252ZXJ0IGJldHdlZW4gb3RoZXIgdW5pdHMgb2YgbWVhc3VyZW1lbnQgcGVyIHtAbGluayBUaW1lU3BhblVuaXRzQ29udmVydGVyfSBcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbVdlZWtzKG51bVdlZWtzKSB7XG4gICAgICAgIHJldHVybiBuZXcgVGltZVNwYW4obnVtV2Vla3MgLyBUaW1lU3BhblVuaXRzQ29udmVydGVyLldlZWtzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBUaW1lU3BhbiBjbGFzcyB3aXRoIHRoZSBpbml0aWFsIG51bWJlciBvZiBtb250aHMuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bU1vbnRocyBcbiAgICAgKiBOdW1iZXIgb2YgbW9udGhzIHRvIGluaXRpYWxpemUgd2l0aC5cbiAgICAgKiBAcmV0dXJucyB7VGltZVNwYW59XG4gICAgICogTmV3IHtAbGluayBUaW1lU3Bhbn0gY2xhc3Mgb2JqZWN0IHRoYXQgY2FuIGNvbnZlcnQgYmV0d2VlbiBvdGhlciB1bml0cyBvZiBtZWFzdXJlbWVudCBwZXIge0BsaW5rIFRpbWVTcGFuVW5pdHNDb252ZXJ0ZXJ9IFxuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tTW9udGhzKG51bU1vbnRocykge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVTcGFuKG51bU1vbnRocyAvIFRpbWVTcGFuVW5pdHNDb252ZXJ0ZXIuTW9udGhzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcXVhbnRpdHlcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocXVhbnRpdHkpIHtcbiAgICAgICAgc3VwZXIoVGltZVNwYW5Vbml0c0NvbnZlcnRlciwgcXVhbnRpdHkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHRpbWVvdXQgd2hlcmUgYGNhbGxiYWNrYCBpcyByYW4gb25seSBhZnRlciB0aGUgdGltZSB0aGF0IHRoaXMgVGltZVNwYW4gb2JqZWN0IGhvbGRzIGhhcyBwYXNzZWQuXG4gICAgICogQHVzYWdlXG4gICAgICogYGBganNcbiAgICAgKiBUaW1lU3Bhbi5mcm9tU2Vjb25kcygxMCkudGltZW91dCgoKSA9PiB7XG4gICAgICogICBjb25zb2xlLmxvZyhgVGhpcyB3aWxsIG9ubHkgcHJpbnQgYWZ0ZXIgMTAgc2Vjb25kc2ApO1xuICAgICAqIH0pO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSB7KCkgPT4gdm9pZHxQcm9taXNlPHZvaWQ+fSBjYWxsYmFjayBcbiAgICAgKiBGdW5jdGlvblxuICAgICAqIEByZXR1cm5zIHsoKSA9PiB2b2lkfSBGdW5jdGlvbiB0byB1bnN1YnNjcmliZSBmcm9tIHRoZSB0aW1lb3V0LlxuICAgICAqIFxuICAgICAqL1xuICAgIHRpbWVvdXQoY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgdGltZW91dCA9IHNldFRpbWVvdXQoY2FsbGJhY2ssIE1hdGguZmxvb3IodGhpcy50byhtID0+IG0uTWlsbGlzZWNvbmRzKSkpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbiBpbnRlcnZhbCB3aGVyZSBgY2FsbGJhY2tgIGlzIHJhbiBmb3IgZXZlcnkgdGltZSBhZnRlciB0aGUgdGltZSB0aGF0IHRoaXMgVGltZVNwYW4gb2JqZWN0IGhvbGRzIGhhcyBwYXNzZWQuICBcbiAgICAgKiBAdXNhZ2VcbiAgICAgKiBgYGBqc1xuICAgICAqIGxldCBpID0gMDtcbiAgICAgKiBjb25zdCB1bnN1YnNjcmliZSA9IFRpbWVTcGFuLmZyb21TZWNvbmRzKDEwKS5pbnRlcnZhbCgoKSA9PiB7XG4gICAgICogICBjb25zb2xlLmxvZyhgUHJpbnRpbmcgJHtpfS8zYCk7XG4gICAgICogICBpZigrK2kgPT09IDMpIHtcbiAgICAgKiAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgKiAgIH1cbiAgICAgKiB9KTtcbiAgICAgKiBcbiAgICAgKiAvLyB3aWxsIHByaW50IGVhY2ggbGluZSBldmVyeSAxMCBzZWNvbmRzOlxuICAgICAqIC8vIFByaW50aW5nIDEvM1xuICAgICAqIC8vIFByaW50aW5nIDIvM1xuICAgICAqIC8vIFByaW50aW5nIDMvM1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSB7KCkgPT4gdm9pZHxQcm9taXNlPHZvaWQ+fSBjYWxsYmFjayBcbiAgICAgKiBAcmV0dXJucyB7KCkgPT4gdm9pZH0gRnVuY3Rpb24gdG8gdW5zdWJzY3JpYmUgZnJvbSB0aGUgaW50ZXJ2YWwuXG4gICAgICovXG4gICAgaW50ZXJ2YWwoY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChjYWxsYmFjaywgTWF0aC5mbG9vcih0aGlzLnRvKG0gPT4gbS5NaWxsaXNlY29uZHMpKSk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBQcm9taXNlIHRoYXQgd2lsbCBvbmx5IHJlc29sdmUgYWZ0ZXIgdGhlIHRpbWUgdGhhdCB0aGlzIFRpbWVTcGFuIG9iamVjdCBob2xkcyBoYXMgcGFzc2VkLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICAgICAqL1xuICAgIGRlbGF5KCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0aGlzLnRpbWVvdXQocmVzb2x2ZSkpO1xuICAgIH1cbn07XG5cbmNvbnN0IFRpbWVTcGFuVW5pdHNDb252ZXJ0ZXIgPSB7XG4gICAgTmFub3NlY29uZHM6IDEsXG4gICAgTWljcm9zZWNvbmRzOiAxLzEwMDAsXG4gICAgTWlsbGlzZWNvbmRzOiAxLzEwMDAvMTAwMCxcbiAgICBTZWNvbmRzOiAxLzEwMDAvMTAwMC8xMDAwLFxuICAgIE1pbnV0ZXM6IDEvNjAvMTAwMC8xMDAwLzEwMDAsXG4gICAgSG91cnM6IDEvNjAvNjAvMTAwMC8xMDAwLzEwMDAsXG4gICAgRGF5czogMS8yNC82MC82MC8xMDAwLzEwMDAvMTAwMCxcbiAgICBXZWVrczogMS83LzI0LzYwLzYwLzEwMDAvMTAwMC8xMDAwLFxuICAgIE1vbnRoczogMS8zMC40MzcvMjQvNjAvNjAvMTAwMC8xMDAwLzEwMDAsXG4gICAgWWVhcnM6IDEvMzY1LjI0MjUvMjQvNjAvNjAvMTAwMC8xMDAwLzEwMDBcbn07IiwiLy9AdHMtY2hlY2tcbmltcG9ydCB7IFVuaXRTcGFuIH0gZnJvbSBcIi4vdW5pdHNwYW4uanNcIjtcblxuLyoqXG4gKiBAZXh0ZW5kcyB7VW5pdFNwYW48RGlnaXRhbFNwYW5Vbml0c0NvbnZlcnRlcj59XG4gKi9cbmV4cG9ydCBjbGFzcyBEaWdpU3BhbiBleHRlbmRzIFVuaXRTcGFuIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1CaXRzXG4gICAgICovXG4gICAgc3RhdGljIGZyb21CaXRzKG51bUJpdHMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEaWdpU3BhbihudW1CaXRzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtQnl0ZXMgXG4gICAgICovXG4gICAgc3RhdGljIGZyb21CeXRlcyhudW1CeXRlcykge1xuICAgICAgICByZXR1cm4gbmV3IERpZ2lTcGFuKG51bUJ5dGVzIC8gRGlnaXRhbFNwYW5Vbml0c0NvbnZlcnRlci5CeXRlcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bUtpYmlCeXRlcyBcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbUtpYmlCeXRlcyhudW1LaWJpQnl0ZXMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEaWdpU3BhbihudW1LaWJpQnl0ZXMgLyBEaWdpdGFsU3BhblVuaXRzQ29udmVydGVyLktpYmlieXRlcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bU1lYmlCeXRlcyBcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbU1lYmlCeXRlcyhudW1NZWJpQnl0ZXMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEaWdpU3BhbihudW1NZWJpQnl0ZXMgLyBEaWdpdGFsU3BhblVuaXRzQ29udmVydGVyLk1lYmlieXRlcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHF1YW50aXR5XG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHF1YW50aXR5KSB7XG4gICAgICAgIHN1cGVyKERpZ2l0YWxTcGFuVW5pdHNDb252ZXJ0ZXIsIHF1YW50aXR5KTtcbiAgICB9XG59XG5cbmNvbnN0IERpZ2l0YWxTcGFuVW5pdHNDb252ZXJ0ZXIgPSBPYmplY3QuZnJlZXplKHtcbiAgICBCaXRzOiAxLFxuICAgIEJ5dGVzOiAxLzgsXG4gICAgS2liaWJ5dGVzOiAxLzEwMjQvOCxcbiAgICBNZWJpYnl0ZXM6IDEvMTAyNC8xMDI0LzgsXG4gICAgR2liaWJ5dGVzOiAxLzEwMjQvMTAyNC8xMDI0LzgsXG4gICAgVGViaWJ5dGVzOiAxLzEwMjQvMTAyNC8xMDI0LzEwMjQvOCxcbiAgICBLaWxvYnl0ZXM6IDEvMTAwMC84LFxuICAgIE1lZ2FieXRlczogMS8xMDAwLzEwMDAvOCxcbiAgICBHaWdhYnl0ZXM6IDEvMTAwMC8xMDAwLzEwMDAvOCxcbiAgICBUZXJhYnl0ZXM6IDEvMTAwMC8xMDAwLzEwMDAvMTAwMC84XG59KTsiXX0=