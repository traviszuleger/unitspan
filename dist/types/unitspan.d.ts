/**
 * @template {Record<string, number>} T
 */
export class UnitSpan<T extends Record<string, number>> {
    /**
     * @param {T} converter
     * @param {number} initialValue
     * @param {number} precision
     */
    constructor(converter: T, initialValue: number, precision?: number);
    /**
     * @protected
     * @type {number}
     */
    protected __value: number;
    /**
     * @param {(obj: {[K in keyof T]: (quantity: number) => void}) => void} callback
     * @returns {this}
     */
    add(callback: (obj: { [K in keyof T]: (quantity: number) => void; }) => void): this;
    /**
     * @param {(obj: {[K in keyof T]: (quantity: number) => void}) => void} callback
     * @returns {this}
     */
    sub(callback: (obj: { [K in keyof T]: (quantity: number) => void; }) => void): this;
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
    to(callback: (model: PropertyRetriever<T>) => keyof T): number;
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
    to(key: keyof T): number;
    /**
     * Set the precision of the resulting conversions.
     * @param {number} numDigits
     * @returns {this}
     */
    precision(numDigits: number): this;
    #private;
}
export type PropertyRetriever<T extends Record<string, any>> = { [K in keyof T]: K; };
