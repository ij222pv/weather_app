import { describe, test, expect } from "@jest/globals";
import Temperature from "../../src/utils/Temperature";

const PRECISION = 5;

describe("Temperature", () => {
  test("should create Temperature from Kelvin", () => {
    const temp = Temperature.fromKelvin(50);
    expect(temp.toKelvin()).toBeCloseTo(50, PRECISION);
  });

  test("should create Temperature from Celsius", () => {
    const temp = Temperature.fromCelsius(50);
    expect(temp.toCelsius()).toBeCloseTo(50, PRECISION);
  });

  test("should create Temperature from Fahrenheit", () => {
    const temp = Temperature.fromFahrenheit(50);
    expect(temp.toFahrenheit()).toBeCloseTo(50, PRECISION);
  });

  test("should convert Temperature to Kelvin", () => {
    const temp = Temperature.fromCelsius(50);
    expect(temp.toKelvin()).toBeCloseTo(323.15, PRECISION);
  });

  test("should convert Temperature to Celsius", () => {
    const temp = Temperature.fromFahrenheit(50);
    expect(temp.toCelsius()).toBeCloseTo(10, PRECISION);
  });

  test("should convert Temperature to Fahrenheit", () => {
    const temp = Temperature.fromKelvin(300);
    expect(temp.toFahrenheit()).toBeCloseTo(80.33, PRECISION);
  });
});