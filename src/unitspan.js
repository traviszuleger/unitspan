//@ts-check

/** @typedef {Record<string, number|[convertToBaseUnit: (units: number) => number, convertFromBaseUnit: (baseUnits: number) => { decimal: number, remainder: number, fraction: number }]>} Converter */

/**
 * @template {Record<string, number|[convertToBaseUnit: (units: number) => number, convertFromBaseUnit: (baseUnits: number) => { decimal: number, remainder: number, fraction: number }]>} T
 */
export class UnitSpan {
    /** 
     * An object with values of numbers or functions. At least one property should map to the value of `1` and that property should
     * be the base unit of measurement in this class (i.o.w., `__baseUnitValue` should store this unit of measurement.)  
     * @type {T} 
     */
    #converter;
    /**
     * An object with the same keys as the `converter` object, but with values being objects holding
     * configurations for how the formatted strings should be handled.
     * @type {{[K in keyof T]: { padStart: number }}}
     */
    #formatter;
    /** @type {number} */
    #precision;
    /** 
     * Stored value of units, this should always be in one type of unit.  
     * 
     * For example, in the `TempSpan` class, this value will always be measured in units of `Kelvin`.
     * @protected 
     * @type {number} 
     */
    __baseUnitValue;

    /**
     * @protected
     * @param {number} quantity
     * @param {T} converter 
     * @param {{[K in keyof T]: { padStart: number }}} formatter
     * @param {number} precision
     */
    constructor(quantity, converter, formatter, precision=5) {
        this.#converter = converter;
        this.#formatter = formatter;
        this.#precision = 10 ** precision;
        this.__baseUnitValue = quantity;
    }

    /**
     * @param {(obj: {[K in keyof T]: (quantity: number) => void}) => void} callback
     * @returns {this}
     */
    add(callback) {
        const clone = this.#clone();
        const t = new Proxy(/** @type {any} */({...clone.#converter}), {
            get: (t,p,r) => {
                if(typeof p !== "string") {
                    throw new Error(`Property "${String(p)}" is not of type string.`);
                }
                return (quantity) => {
                    const converter = clone.#converter[p];
                    if(Array.isArray(converter)) {
                        const [convertToBaseUnits, convertFromBaseUnits] = converter;
                        clone.__baseUnitValue = convertToBaseUnits(convertFromBaseUnits(clone.__baseUnitValue) + quantity);
                    }
                    else
                    if(typeof converter === "number") {
                        clone.__baseUnitValue += quantity / converter;
                    }
                }
            }
        });
        callback(t);
        return /** @type {any} */ (clone);
    }

    /**
     * @param {(obj: {[K in keyof T]: (quantity: number) => void}) => void} callback
     * @returns {this}
     */
    sub(callback) {
        const clone = this.#clone();
        const t = new Proxy(/** @type {any} */({...clone.#converter}), {
            get: (t,p,r) => {
                if(typeof p !== "string") {
                    throw new Error(`Property "${String(p)}" is not of type string.`);
                }
                return (quantity) => {
                    const converter = clone.#converter[p];
                    if(Array.isArray(converter)) {
                        const [convertToBaseUnits, convertFromBaseUnits] = converter;
                        console.log(p, clone.__baseUnitValue, convertToBaseUnits(quantity));
                        clone.__baseUnitValue = convertToBaseUnits(convertFromBaseUnits(clone.__baseUnitValue) - quantity);
                    }
                    else
                    if(typeof converter === "number") {
                        clone.__baseUnitValue -= quantity / converter;
                    }
                }
            }
        });
        callback(t);
        return /** @type {any} */ (clone);
    }

    /**
     * @overload Overload 1
     * @param {(model: PropertyRetriever<T>) => keyof T} callback
     * Callback used to get the type of conversion (or otherwise, the key of conversion) to use when converting.
     * @returns {number}
     * The converted number from the unit quantity held by this UnitSpan class object.
     * 
     * @overload
     * @param {(model: PropertyRetriever<T>) => string} callback
     * Callback used to get the type of conversion (or otherwise, the key of conversion) to use when converting.
     * @returns {string}
     * The converted number from the unit quantity held by this UnitSpan class object.
     * 
     * @overload
     * @param {keyof T} key
     * Some string property of the conversion object to use when converting. 
     * @returns {number}
     * 
     * @overload
     * @param {string} key
     * @returns {string}
     * The converted number from the unit quantity held by this UnitSpan class object.
     * 
     * Get the conversion of units as specified from the property reference (and return value) from the `model` parameter used in `callback`.
     * @param {((model: PropertyRetriever<T>) => keyof T|string)|keyof T|string} callback
     * @returns {string|number}
     */
    to(callback) {
        let val = 0;
        if(typeof callback === "function") {
            const t = new Proxy(/** @type {any} */({...this.#converter}), {
                get: (t,p,r) => {
                    return `{{${String(p)}}}`;
                }
            });
            let keyOrString = callback(t);
            if(typeof keyOrString !== "string") {
                throw new Error(`Expected a string, but got "${typeof keyOrString}".`);
            }
            
            const replacedKeyOrString = keyOrString.replace(/\{\{([^\{\}]*)\}\}/, "$1");
            if(replacedKeyOrString in this.#converter) {
                return handleOverload1_3.bind(this)(replacedKeyOrString);
            }
            else {
                return handleOverload2_4.bind(this)(keyOrString);
            }
        }
        else {
            if(typeof callback !== "string") {
                callback = String(callback);
            }
            if(callback in this.#converter) {
                return handleOverload1_3.bind(this)(callback);
            }
            else {
                return handleOverload2_4.bind(this)(callback);
            }
        }
        /**
         * 
         * @this {UnitSpan<T>}
         * @param {keyof T} key
         * @returns {number} 
         */
        function handleOverload1_3(key) {
            const converter = this.#converter[key];
            if(Array.isArray(converter)) {
                const [,convertFromBaseUnits] = converter;
                const { decimal, fraction } = convertFromBaseUnits(this.__baseUnitValue);
                val = decimal + (Math.floor(fraction * this.#precision) / this.#precision);
            }
            else if(typeof converter === "number") {
                val = converter * this.__baseUnitValue;
            }
            return Math.round(val * this.#precision) / this.#precision;
        }

        /**
         * @this {UnitSpan<T>}
         * @param {string} formatString
         * @returns {string} 
         */
        function handleOverload2_4(formatString) {
            const entries = Object.entries(this.#converter)
                .sort(([k1,v1],[k2,v2]) => {
                    if(typeof v1 === "number" && typeof v2 === "number") {
                        return v1 - v2;
                    }
                    if(typeof v1 !== "number") {
                        const [,convertFromBaseUnits] = v1;
                        const { decimal, fraction, remainder } = convertFromBaseUnits(this.__baseUnitValue);
                        v1 = decimal + (Math.floor(fraction * this.#precision) / this.#precision);
                    }
                    if(typeof v2 !== "number") {
                        const [,convertFromBaseUnits] = v2;
                        const { decimal, fraction, remainder } = convertFromBaseUnits(this.__baseUnitValue);
                        v2 = decimal + (Math.floor(fraction * this.#precision) / this.#precision);
                    }
                    return v2 - v1;
                });
            
            let currentBaseUnitValue = this.__baseUnitValue;
            for(const [key, converter] of entries) {
                if(!formatString.includes(key)) {
                    continue;
                }
                if(Array.isArray(converter)) {
                    const [,convertFromBaseUnits] = converter;
                    const { decimal, remainder } = convertFromBaseUnits(currentBaseUnitValue);
                    formatString = formatString.replaceAll(`{{${key}}}`, Math.floor(decimal).toString().padStart(this.#formatter[key].padStart, "0"));
                    currentBaseUnitValue = remainder;
                }
                else if(typeof converter === "number") {
                    let val = converter * currentBaseUnitValue;
                    if(Number.isInteger(val)) {
                        currentBaseUnitValue = 0;
                    }
                    else {
                        if(Math.floor(val) === 0) {
                            val = 0;
                        }
                        else {
                            const frac = val - Math.floor(val);
                            const remainder = (Math.floor(frac * this.#precision) / this.#precision);
                            currentBaseUnitValue = (remainder / val) * currentBaseUnitValue;
                            val = Math.floor(val);
                        }
                    }
                    formatString = formatString.replaceAll(`{{${key}}}`, val.toString().padStart(this.#formatter[key].padStart, "0"));
                }
            }
            return formatString;
        }
    }



    /**
     * Set the precision of the resulting conversions.
     * @param {number} numDigits 
     * @returns {this}
     */
    precision(numDigits) {
        const clone = this.#clone();
        clone.#precision = 10 ** numDigits;
        return /** @type {any} */ (clone);
    }

    /**
     * 
     */
    #clone() {
        const clone = new /** @type {any} */ (this.constructor)(this.#converter);
        clone.__baseUnitValue = this.__baseUnitValue;
        return clone;
    }
}

/**
 * @template {Record<string,any>} T
 * @typedef {{[K in keyof T]: K}} PropertyRetriever
 */