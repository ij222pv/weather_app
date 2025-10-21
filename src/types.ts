import { Point } from "line-chart";
import config from "./rawConfig";
import Unit from "./models/Unit";

export type WeatherData = {
  date: Date;
} & {
  [K in keyof typeof config]?: Unit;
};

export type WeatherMetric = Exclude<keyof WeatherData, "date">;

export type ChartData = {
  rawPoints: Point[];
  regression: Point[];
};

export enum SumOrAverage {
  SUM,
  AVERAGE,
}
