//@ts-check
import { expect, suite, test } from 'vitest';
import { DigiSpan } from '../src/index.js';

suite(`Conversion from Bits`, () => {
    const ds = DigiSpan.fromBits(12);
    test(`Expect DigiSpan.fromBits(12) to equal 1.5 when converted to bytes`, () => {
        expect(ds.to(m => m.Bytes)).toBe(1.5);
    });
});
