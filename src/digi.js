//@ts-check
import { UnitSpan } from "./unitspan.js";

/**
 * @extends {UnitSpan<typeof DigitalSpanUnitsConverter>}
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
     * @param {number} numKibiBytes 
     */
    static fromKibiBytes(numKibiBytes) {
        return new DigiSpan(numKibiBytes / DigitalSpanUnitsConverter.Kibibytes);
    }

    /**
     * @param {number} numMebiBytes 
     */
    static fromMebiBytes(numMebiBytes) {
        return new DigiSpan(numMebiBytes / DigitalSpanUnitsConverter.Mebibytes);
    }

    /**
     * @param {number} numGibiBytes 
     */
    static fromGibiBytes(numGibiBytes) {
        return new DigiSpan(numGibiBytes / DigitalSpanUnitsConverter.Gibibytes);
    }

    /**
     * @param {number} numTebiBytes 
     */
    static fromTebibytes(numTebiBytes) {
        return new DigiSpan(numTebiBytes / DigitalSpanUnitsConverter.Tebibytes);
    }

    /**
     * @param {number} numKiloBytes 
     */
    static fromKiloBytes(numKiloBytes) {
        return new DigiSpan(numKiloBytes / DigitalSpanUnitsConverter.Kilobytes);
    }

    /**
     * @param {number} numMegaBytes 
     */
    static fromMegaBytes(numMegaBytes) {
        return new DigiSpan(numMegaBytes / DigitalSpanUnitsConverter.Megabytes);
    }

    /**
     * @param {number} numGigaBytes 
     */
    static fromGigaBytes(numGigaBytes) {
        return new DigiSpan(numGigaBytes / DigitalSpanUnitsConverter.Gigabytes);
    }

    /**
     * @param {number} numTeraBytes 
     */
    static fromTeraBytes(numTeraBytes) {
        return new DigiSpan(numTeraBytes / DigitalSpanUnitsConverter.Terabytes);
    }

    /**
     * 
     * @param {Uint8Array|Buffer} buffer 
     */
    static fromBuffer(buffer) {
        return new DigiSpan(buffer.byteLength / DigitalSpanUnitsConverter.Bytes);
    }

    /**
     * @param {number} quantity
     * @protected
     */
    constructor(quantity) {
        super(
            quantity,
            DigitalSpanUnitsConverter, 
            DigitalSpanUnitsFormatter 
        );
    }

    buffer() {
        return new Uint8Array(Math.ceil(this.to(m => m.Bytes)));
    }
}

/** @enum {typeof DigitalSpanUnitsConverter[keyof typeof DigitalSpanUnitsConverter]} */
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

const DigitalSpanUnitsFormatter = Object.freeze({
    Bits: {
        padStart: 1,
    },
    Bytes: {
        padStart: 1,
    },
    Kibibytes: {
        padStart: 1,
    },
    Mebibytes: {
        padStart: 1,
    },
    Gibibytes: {
        padStart: 1,
    },
    Tebibytes: {
        padStart: 1,
    },
    Kilobytes: {
        padStart: 1,
    },
    Megabytes: {
        padStart: 1,
    },
    Gigabytes: {
        padStart: 1,
    },
    Terabytes: {
        padStart: 1,
    },
});