//@ts-check

/** @typedef {Record<string, number|[convertToBaseUnit: (units: number) => number, convertFromBaseUnit: (baseUnits: number) => number]>} Converter */

/**
 * @template {Record<string, number|[convertToBaseUnit: (units: number) => number, convertFromBaseUnit: (baseUnits: number) => number]>} T
 */
export class UnitSpan {
    /** 
     * An object with values of numbers or functions. At least one property should map to the value of `1` and that property should
     * be the base unit of measurement in this class (i.o.w., `__baseUnitValue` should store this unit of measurement.)  
     * @type {T} 
     */
    #converter;
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
     * @param {T} converter 
     * @param {number} initialValue
     * @param {number} precision
     */
    constructor(converter, initialValue, precision=5) {
        this.#converter = converter;
        this.#precision = 10 ** precision;
        this.__baseUnitValue = initialValue;
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
        let val = 0;
        if(typeof callback === "function") {
            const t = new Proxy(/** @type {any} */({...this.#converter}), {
                get: (t,p,r) => {
                    return p;
                }
            });
            const converter = this.#converter[callback(t)];
            if(Array.isArray(converter)) {
                const [convertToBaseUnits, convertFromBaseUnits] = converter;
                val = convertFromBaseUnits(this.__baseUnitValue);
            }
            else
            if(typeof converter === "number") {
                val = converter * this.__baseUnitValue;
            }
            return Math.round(val * this.#precision) / this.#precision;
        }
        const converter = this.#converter[callback];
        if(Array.isArray(converter)) {
            const [convertToBaseUnits, convertFromBaseUnits] = converter;
            val = convertFromBaseUnits(this.__baseUnitValue);
        }
        else
        if(typeof converter === "number") {
            val = converter * this.__baseUnitValue;
        }
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