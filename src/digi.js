//@ts-check
import { UnitSpan } from "./unitspan.js";

/**
 * @extends {UnitSpan<DigitalSpanUnitsConverter>}
 */
export class DigiSpan extends UnitSpan {

    /**
     * @param {number} numBits
     */
    static fromBits(numBits) {
        return new DigiSpan(numBits);
    }

    /**
     * @param {number} numBytes 
     */
    static fromBytes(numBytes) {
        return new DigiSpan(numBytes / DigitalSpanUnitsConverter.Bytes);
    }

    /**
     * 
     * @param {number} numKibiBytes 
     */
    static fromKibiBytes(numKibiBytes) {
        return new DigiSpan(numKibiBytes / DigitalSpanUnitsConverter.Kibibytes);
    }

    /**
     * 
     * @param {number} numMebiBytes 
     */
    static fromMebiBytes(numMebiBytes) {
        return new DigiSpan(numMebiBytes / DigitalSpanUnitsConverter.Mebibytes);
    }

    /**
     * @param {number} quantity
     * @protected
     */
    constructor(quantity) {
        super(DigitalSpanUnitsConverter, quantity);
    }
}

const DigitalSpanUnitsConverter = Object.freeze({
    Bits: 1,
    Bytes: 1/8,
    Kibibytes: 1/1024/8,
    Mebibytes: 1/1024/1024/8,
    Gibibytes: 1/1024/1024/1024/8,
    Tebibytes: 1/1024/1024/1024/1024/8,
    Kilobytes: 1/1000/8,
    Megabytes: 1/1000/1000/8,
    Gigabytes: 1/1000/1000/1000/8,
    Terabytes: 1/1000/1000/1000/1000/8
});