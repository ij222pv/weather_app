import rawConfig from "./rawConfig";
import { WeatherMetric } from "./types";
import Unit from "./utils/Unit";

const typedConfig: Record<
  WeatherMetric,
  {
    increase: string;
    decrease: string;
    unitConstructor: (value: number) => Unit;
    openMeteoName: string;
  }
> = rawConfig;

export default typedConfig;
