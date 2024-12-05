/**
 * @extends {UnitSpan<DigitalSpanUnitsConverter>}
 */
export class DigiSpan extends UnitSpan<Readonly<{
    Bits: 1;
    Bytes: number;
    Kibibytes: number;
    Mebibytes: number;
    Gibibytes: number;
    Tebibytes: number;
    Kilobytes: number;
    Megabytes: number;
    Gigabytes: number;
    Terabytes: number;
}>> {
    /**
     * @param {number} numBits
     */
    static fromBits(numBits: number): DigiSpan;
    /**
     * @param {number} numBytes
     */
    static fromBytes(numBytes: number): DigiSpan;
    /**
     *
     * @param {number} numKibiBytes
     */
    static fromKibiBytes(numKibiBytes: number): DigiSpan;
    /**
     *
     * @param {number} numMebiBytes
     */
    static fromMebiBytes(numMebiBytes: number): DigiSpan;
    /**
     * @param {number} quantity
     * @protected
     */
    protected constructor();
}
import { UnitSpan } from "./unitspan.js";
