//@ts-check
import { test, expect, suite, vi } from 'vitest';
import { TempSpan } from '../src/index.js';

suite(`Conversion from Fahrenheit`, () => {
    test(`Expect TempSpan.fromFahrenheit(212) to equal [Fahrenheit: 212, Celsius: 100, Kelvin: 373.15].`, () => {
        const ts = TempSpan.fromFahrenheit(212);
        expect(ts.to(m => m.Fahrenheit)).toBe(212);
        expect(ts.to(m => m.Celsius)).toBe(100);
        expect(ts.to(m => m.Kelvin)).toBe(373.15);
    });

    test(`Expect TempSpan.fromFahrenheit(212).sub(m => m.Celsius(100)) to equal [Fahrenheit: 0, Celsius: -17.77778, Kelvin: 255.37222]`, () => {
        const ts = TempSpan.fromFahrenheit(212)
            .sub(m => m.Fahrenheit(212));
        expect(ts.to(m => m.Fahrenheit)).toBe(0);
        expect(ts.to(m => m.Celsius)).toBe(-17.77778);
        expect(ts.to(m => m.Kelvin)).toBe(255.37222);
    });

    test(`Expect TempSpan.fromFahrenheit(0).add(m => m.Celsius(100)) to equal [Fahrenheit: 180, Celsius: 82.22222, Kelvin: 355.37222]`, () => {
        const ts = TempSpan.fromFahrenheit(0)
            .add(m => m.Celsius(100));
        expect(ts.to(m => m.Fahrenheit)).toBe(180);
        expect(ts.to(m => m.Celsius)).toBe(82.22222);
        expect(ts.to(m => m.Kelvin)).toBe(355.37222);
    });
    
    test(`Expect TempSpan.fromKelvin(0).add(m => m.Kelvin(10)).add(m => m.Kelvin(42)).sub(m => m.Kelvin(3)) to equal [Fahrenheit: -371.47, Celsius: -224.15, Kelvin: 49]`, () => {
        const ts = TempSpan.fromKelvin(0)
            .add(m => m.Kelvin(10))
            .add(m => m.Kelvin(42))
            .sub(m => m.Kelvin(3));
        expect(ts.to(m => m.Fahrenheit)).toBe(-371.47);
        expect(ts.to(m => m.Celsius)).toBe(-224.15)
        expect(ts.to(m => m.Kelvin)).toBe(49);
    })
})