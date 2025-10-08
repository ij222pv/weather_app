import TemperatureConverter from "./TemperatureConverter";

export default class Temperature {
  private constructor(private kelvin: number) {}

  public static fromKelvin(kelvin: number): Temperature {
    return new Temperature(kelvin);
  }

  public static fromCelsius(celsius: number): Temperature {
    const converter = new TemperatureConverter();
    return new Temperature(converter.celsiusToKelvin(celsius));
  }

  public static fromFahrenheit(fahrenheit: number): Temperature {
    const converter = new TemperatureConverter();
    return new Temperature(converter.fahrenheitToKelvin(fahrenheit));
  }

  public toKelvin(): number {
    return this.kelvin;
  }

  public toCelsius(): number {
    const converter = new TemperatureConverter();
    return converter.kelvinToCelsius(this.kelvin);
  }

  public toFahrenheit(): number {
    const converter = new TemperatureConverter();
    return converter.kelvinToFahrenheit(this.kelvin);
  }
}
