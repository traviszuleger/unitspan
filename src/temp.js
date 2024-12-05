//@ts-check
import { UnitSpan } from "./unitspan.js";

/**
 * @extends {UnitSpan<TempSpanUnitsConverter>}
 */
export class TempSpan extends UnitSpan {

    /**
     * 
     * @param {number} numKelvins 
     */
    static fromKelvin(numKelvins) {
        return new TempSpan(numKelvins);
    }

    /**
     * 
     * @param {number} numFahrenheitDegrees 
     */
    static fromFahrenheit(numFahrenheitDegrees) {
        return new TempSpan(TempSpanUnitsConverter.Fahrenheit[0](numFahrenheitDegrees));
    }

    /**
     * 
     * @param {number} numCelsiusDegrees 
     */
    static fromCelsius(numCelsiusDegrees) {
        return new TempSpan(TempSpanUnitsConverter.Celsius[0](numCelsiusDegrees));
    }

    /**
     * @param {number} value 
     * @protected
     */
    constructor(value) {
        super(TempSpanUnitsConverter, value);
    }

}

const TempSpanUnitsConverter = {
    Kelvin: 1,
    Fahrenheit: /** @type {[(q: number) => number, (q: number) => number]} */ ([
        degreesF => (degreesF - 32) * 5 / 9 + 273.15, 
        kelvin => (kelvin - 273.15) * 9 / 5 + 32
    ]),
    Celsius: /** @type {[(q: number) => number, (q: number) => number]} */ ([
        degreesC => (degreesC + 273.15),
        kelvin => (kelvin - 273.15)
    ])
};