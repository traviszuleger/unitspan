//@ts-check
import { expect, suite, test } from 'vitest';
import { DigiSpan } from '../src/index.js';

suite(`Conversion from Bits`, () => {
    const ds = DigiSpan.fromBits(12);
    test(`Expect DigiSpan.fromBits(12) to equal 1.5 when converted to bytes`, () => {
        expect(ds.to(m => m.Bytes)).toBe(1.5);
    });
});

suite(`Create from Buffer`, () => {
    const buf = new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]);
    const ds = DigiSpan.fromBuffer(buf);
    test(`Expect DigiSpan.fromBuffer(new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF])) to equal [Bits: 32, Bytes: 4]`, () => {
        expect(ds.to(m => m.Bits)).toEqual(32);
        expect(ds.to(m => m.Bytes)).toEqual(4);
    });

    test(`Expect DigiSpan.fromBuffer(...).add(m => m.Bytes(4)).buffer() to equal Uint8Array(8)`, () => {
        expect(ds.add(m => m.Bytes(4)).buffer().byteLength).toEqual(8);
        expect(ds.add(m => m.Bytes(4)).buffer()[0]).toEqual(0);
        expect(ds.add(m => m.Bytes(4)).buffer()[1]).toEqual(0);
        expect(ds.add(m => m.Bytes(4)).buffer()[2]).toEqual(0);
        expect(ds.add(m => m.Bytes(4)).buffer()[3]).toEqual(0);
        expect(ds.add(m => m.Bytes(4)).buffer()[4]).toEqual(0);
        expect(ds.add(m => m.Bytes(4)).buffer()[5]).toEqual(0);
        expect(ds.add(m => m.Bytes(4)).buffer()[6]).toEqual(0);
        expect(ds.add(m => m.Bytes(4)).buffer()[7]).toEqual(0);
        expect(ds.add(m => m.Bytes(4)).buffer()[8]).toBeUndefined();
    });
})
