import { Point } from "line-chart";

export type ChartData = {
  rawPoints: Point[];
  rollingAverage: Point[];
  regression: Point[];
};
