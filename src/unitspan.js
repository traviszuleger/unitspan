//@ts-check

/**
 * @template {Record<string, number>} T
 */
export class UnitSpan {
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
    constructor(converter, initialValue, precision=5) {
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
        const t = new Proxy(/** @type {any} */({...clone.#converter}), {
            get: (t,p,r) => {
                if(typeof p !== "string") {
                    throw new Error(`Property "${String(p)}" is not of type string.`);
                }
                return (quantity) => {
                    clone.__value += quantity / clone.#converter[p];
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
                    clone.__value -= quantity / clone.#converter[p];
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
        if(typeof callback === "function") {
            const t = new Proxy(/** @type {any} */({...this.#converter}), {
                get: (t,p,r) => {
                    return p;
                }
            });
            const val = this.#converter[callback(t)] * this.__value;
            return Math.round(val * this.#precision) / this.#precision;
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
        return /** @type {any} */ (clone);
    }

    /**
     * 
     */
    #clone() {
        const clone = new /** @type {any} */ (this.constructor)(this.#converter);
        clone.__value = this.__value;
        return clone;
    }
}

/**
 * @template {Record<string,any>} T
 * @typedef {{[K in keyof T]: K}} PropertyRetriever
 */