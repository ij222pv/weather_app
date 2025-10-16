import { WeatherData, WeatherMetric } from "../types";
import Coordinate from "../utils/Coordinate";
import DateRange from "../utils/DateRange";

export default interface HistoricalWeatherApi {
  getDaily(
    location: Coordinate,
    dates: DateRange,
    selectedMetrics: WeatherMetric[],
  ): Promise<WeatherData[]>;
}
