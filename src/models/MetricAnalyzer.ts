import typedConfig from "../typedConfig";
import { SumOrAverage, WeatherData, WeatherMetric } from "../types";
import Unit from "./Unit";

export type SingleMetricYearlyData = Record<number, Unit>;
export type MultipleMetricYearlyData = Partial<
  Record<WeatherMetric, SingleMetricYearlyData>
>;

export default class MetricAnalyzer {
  public constructor(
    private weatherData: WeatherData[],
    private metric: WeatherMetric,
  ) {}

  public getYearlyData(): SingleMetricYearlyData {
    const sums = this.getYearlySums();
    const counts = this.getYearlyCounts();

    if (typedConfig[this.metric].sumOrAverage === SumOrAverage.SUM) {
      return sums;
    } else {
      return this.getYearlyAveragesFromSumsAndCounts(sums, counts);
    }
  }

  private getYearlySums(): Record<number, Unit> {
    const sums: Record<number, Unit> = {};
    for (const entry of this.weatherData) {
      const year = new Date(entry.date).getFullYear();
      if (entry[this.metric] === undefined) {
        continue;
      }
      if (sums[year] !== undefined) {
        sums[year] = sums[year].add(entry[this.metric]!);
      } else {
        sums[year] = entry[this.metric]!;
      }
    }
    return sums;
  }

  private getYearlyCounts(): Record<number, number> {
    const counts: Record<number, number> = {};
    for (const entry of this.weatherData) {
      const year = new Date(entry.date).getFullYear();
      if (entry[this.metric] === undefined) {
        continue;
      }
      counts[year] ??= 0;
      counts[year]++;
    }
    return counts;
  }

  private getYearlyAveragesFromSumsAndCounts(
    sums: Record<number, Unit>,
    counts: Record<number, number>,
  ): SingleMetricYearlyData {
    const result: Record<number, Unit> = {};
    for (const year in sums) {
      const yearAsNumber = Number(year);
      result[yearAsNumber] = sums[yearAsNumber].divide(counts[yearAsNumber]);
    }
    return result;
  }
}
