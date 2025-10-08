import TemperatureConverter from "./TemperatureConverter";

export default class Temperature {
  private constructor(private kelvin: number) {}

  static fromKelvin(kelvin: number): Temperature {
    return new Temperature(kelvin);
  }

  static fromCelsius(celsius: number): Temperature {
    const converter = new TemperatureConverter();
    return new Temperature(converter.celsiusToKelvin(celsius));
  }

  static fromFahrenheit(fahrenheit: number): Temperature {
    const converter = new TemperatureConverter();
    return new Temperature(converter.fahrenheitToKelvin(fahrenheit));
  }

  toKelvin(): number {
    return this.kelvin;
  }

  toCelsius(): number {
    const converter = new TemperatureConverter();
    return converter.kelvinToCelsius(this.kelvin);
  }

  toFahrenheit(): number {
    const converter = new TemperatureConverter();
    return converter.kelvinToFahrenheit(this.kelvin);
  }
}
