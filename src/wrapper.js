//@ts-check
/** @import { Converter } from "./unitspan.js" */
import { UnitSpan } from "./unitspan.js"

/**
 * @template {Converter} TConverter
 * @param {TConverter} unitSpanUnitsConverter 
 * @returns {{[K in keyof TConverter as `From${K}`]: (initialValue: number) => {[K in keyof TConverter]: number}}}
 */
export function wrapper(unitSpanUnitsConverter) {
    return new Proxy(/** @type {any} */ ({}), {
        get: (t,p,r) => {
            const prop = p.toString().replace("From", "");
            return (initialValue) => {
                const converter = unitSpanUnitsConverter[prop];
                let us = undefined;
                if(Array.isArray(converter)) {
                    const [convertTo, convertFrom] = converter;
                    us = new UnitSpan(unitSpanUnitsConverter, convertTo(initialValue));
                }
                else {
                    us = new UnitSpan(unitSpanUnitsConverter, initialValue / converter);
                }
                return new Proxy(unitSpanUnitsConverter, {
                    get: (t,p,r) => {
                        return us.to(m => m[p.toString()]);
                    }
                })
            }
        }
    });
}