import Coordinate from "../utils/Coordinate";
import DateRange from "../utils/DateRange";
import Length from "../utils/Length";
import Speed from "../utils/Speed";
import Temperature from "../utils/Temperature";

export type WeatherData = {
  date: Date;
  temperature?: Temperature;
  windSpeed?: Speed;
  rainfall?: Length;
  snowfall?: Length;
};

export type WeatherMetric = Exclude<keyof WeatherData, "date">;

export default interface HistoricalWeatherApi {
  getDaily(
    location: Coordinate,
    dates: DateRange,
    options: WeatherMetric[],
  ): Promise<WeatherData[]>;
}
