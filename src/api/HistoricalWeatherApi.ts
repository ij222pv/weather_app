import { WeatherData, WeatherMetric } from "../types";
import Coordinate from "../models/Coordinate";
import DateRange from "../models/DateRange";

export default interface HistoricalWeatherApi {
  getDailyWeatherData(
    location: Coordinate,
    dates: DateRange,
    selectedMetrics: WeatherMetric[],
  ): Promise<WeatherData[]>;
}
