import { SumOrAverage } from "./types";
import Length from "./utils/Length";
import Speed from "./utils/Speed";
import Temperature from "./utils/Temperature";

const rawConfig = {
  temperature: {
    increase:
      "Uh oh! It's getting hot in here!\nThe average temperature has increased by {change}°C since 1940.",
    decrease:
      "Good news! It's cooling down!\nThe average temperature has decreased by {change}°C since 1940.",
    unitConstructor: Temperature.fromCelsius,
    openMeteoName: "temperature_2m_mean",
    color: "orangered",
    sumOrAverage: SumOrAverage.AVERAGE,
  },
  windSpeed: {
    increase:
      "The average wind speed has increased by {change} m/s since 1940.",
    decrease:
      "The average wind speed has decreased by {change} m/s since 1940.",
    unitConstructor: Speed.fromKilometersPerHour,
    openMeteoName: "windspeed_10m_mean",
    color: "lightblue",
    sumOrAverage: SumOrAverage.AVERAGE,
  },
  rainfall: {
    increase:
      "The average yearly rainfall has increased by {change} mm since 1940.",
    decrease:
      "The average yearly rainfall has decreased by {change} mm since 1940.",
    unitConstructor: Length.fromMillimeters,
    openMeteoName: "rain_sum",
    color: "gray",
    sumOrAverage: SumOrAverage.SUM,
  },
  snowfall: {
    increase:
      "The average yearly snowfall has increased by {change} mm since 1940.",
    decrease:
      "The average yearly snowfall has decreased by {change} mm since 1940.",
    unitConstructor: Length.fromMillimeters,
    openMeteoName: "snowfall_sum",
    color: "lightgray",
    sumOrAverage: SumOrAverage.SUM,
  },
};

export default rawConfig;
