import rawConfig from "./rawConfig";
import { SumOrAverage, WeatherMetric } from "./types";
import Unit from "./utils/Unit";

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
