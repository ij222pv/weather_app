import rawConfig from "./rawConfig";
import { SumOrAverage, WeatherMetric } from "./types";
import Unit from "./models/Unit";

const typedConfig: Record<
  WeatherMetric,
  {
    increase: string;
    decrease: string;
    unitConstructor: (value: number) => Unit;
    openMeteoName: string;
    color: string;
    sumOrAverage: SumOrAverage;
  }
> = rawConfig;

export default typedConfig;

export const AVAILABLE_METRICS: WeatherMetric[] = Object.keys(
  typedConfig,
) as WeatherMetric[];

export const START_YEAR = 1940;
