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
        return new TempSpan((numFahrenheitDegrees - 32) * 5 / 9 + 273.15);
    }

    /**
     * 
     * @param {number} numCelsiusDegrees 
     */
    static fromCelsius(numCelsiusDegrees) {
        return new TempSpan(numCelsiusDegrees + 273.15);
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
    Fahrenheit: n => (n - 273.15) * 9 / 5 + 32,
    Celsius: n => (n - 273.15)
};