export default class TemperatureConverter {
  public kelvinToCelsius(kelvin: number): number {
    return kelvin - 273.15;
  }

  public kelvinToFahrenheit(kelvin: number): number {
    const celsius = this.kelvinToCelsius(kelvin);
    return this.celsiusToFahrenheit(celsius);
  }

  public celsiusToKelvin(celsius: number): number {
    return celsius + 273.15;
  }

  public fahrenheitToKelvin(fahrenheit: number): number {
    const celsius = this.fahrenheitToCelsius(fahrenheit);
    return this.celsiusToKelvin(celsius);
  }

  public celsiusToFahrenheit(celsius: number): number {
    return celsius * (9 / 5) + 32;
  }

  public fahrenheitToCelsius(fahrenheit: number): number {
    return (fahrenheit - 32) * (5 / 9);
  }
}
