import { Point } from "line-chart";
import { ChartData, WeatherData, WeatherMetric } from "../types";
import LinearRegression from "./LinearRegression";
import Range from "../utils/Range";

export default class WeatherChartDataAdapter {
  public constructor(
    private readonly weatherData: WeatherData[],
    private readonly metric: WeatherMetric,
  ) {}

  public getChartData(): ChartData {
    const points = this.getPoints();

    const regression = new LinearRegression();
    const regressionPoints = regression.getRegressionLine(
      points,
      new Range(points[0]?.x ?? 0, points[points.length - 1]?.x ?? 0),
    );

    return {
      rawPoints: points,
      regression: regressionPoints,
    };
  }

  private getPoints(): Point[] {
    return this.weatherData
      .filter((entry) => {
        return entry[this.metric] !== undefined;
      })
      .map((entry) => {
        return new Point(
          entry.date.getFullYear(),
          entry[this.metric]!.getDisplayNumber() ?? 0,
        );
      });
  }
}
