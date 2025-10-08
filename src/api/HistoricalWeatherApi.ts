import Coordinate from "../utils/Coordinate";
import DateRange from "../utils/DateRange";
import Length from "../utils/Length";
import Speed from "../utils/Speed";
import Temperature from "../utils/Temperature";

export type WeatherData = {
  date: Date;
  temperature?: Temperature;
  windSpeed?: Speed;
  rain?: Length;
  snowfall?: Length;
};

export type HistoricalWeatherOptions = {
  temperature?: boolean;
  windSpeed?: boolean;
  rain?: boolean;
  snow?: boolean;
};

export default interface HistoricalWeatherApi {
  getDaily(
    location: Coordinate,
    dates: DateRange,
    options: HistoricalWeatherOptions,
  ): Promise<WeatherData[]>;
}
