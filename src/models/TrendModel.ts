import { Point } from "line-chart";
import { WeatherData, WeatherMetric } from "../api/HistoricalWeatherApi";
import Unit from "../utils/Unit";

const METRICS: WeatherMetric[] = [
  "temperature",
  "windSpeed",
  "rainfall",
  "snowfall",
];

enum SumOrAverage {
  SUM,
  AVERAGE,
}

const METRICS_AVERAGE_OR_SUM: Record<WeatherMetric, SumOrAverage> = {
  temperature: SumOrAverage.AVERAGE,
  windSpeed: SumOrAverage.AVERAGE,
  rainfall: SumOrAverage.SUM,
  snowfall: SumOrAverage.SUM,
};

export default class TrendModel {
  public getCityFromFormData(formData: FormData): string {
    const city = formData.get("city")?.toString();
    if (!city) throw new Error("City is required");
    return city;
  }

  public getWeatherMetricsFromFormData(formData: FormData): WeatherMetric[] {
    const metrics: WeatherMetric[] = [];
    for (const metric of METRICS) {
      if (formData.get(metric)) metrics.push(metric);
    }
    return metrics;
  }

  public getAverageYearlyData(data: WeatherData[]): WeatherData[] {
    const yearlyMetrics: Partial<Record<WeatherMetric, Record<number, Unit>>> =
      {};
    for (const metric of METRICS) {
      yearlyMetrics[metric] = this.getYearlyMetric(data, metric);
    }
    const result: WeatherData[] = [];
    // TODO: Don't use .temperature in case the user doesn't select the temperature checkbox
    for (const year in yearlyMetrics.temperature) {
      const entry: WeatherData = {
        date: new Date(Number(year), 0, 1),
      };
      for (const metric of METRICS) {
        const yearlyMetric = yearlyMetrics[metric];
        if (yearlyMetric && yearlyMetric[year]) {
          entry[metric] = yearlyMetric[year];
        }
      }
      result.push(entry);
    }
    return result;
  }

  public getRollingAverage(data: number[], windowSize: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - Math.floor(windowSize / 2));
      const end = Math.min(data.length - 1, i + Math.floor(windowSize / 2));
      const window = data.slice(start, end + 1);
      const average =
        window.reduce((sum, value) => sum + value, 0) / window.length;
      result.push(average);
    }
    return result;
  }

  public linearRegression(points: Point[]): {
    slope: number;
    intercept: number;
  } {
    const n = points.length;
    const meanX = points.reduce((a, b) => a + b.x, 0) / n;
    const meanY = points.reduce((a, b) => a + b.y, 0) / n;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (points[i].x - meanX) * (points[i].y - meanY);
      denominator += (points[i].x - meanX) ** 2;
    }

    const b = numerator / denominator;
    const a = meanY - b * meanX;

    return { slope: b, intercept: a };
  }

  private getYearlyMetric(
    data: WeatherData[],
    metric: Exclude<keyof WeatherData, "date">,
  ): Record<number, Unit> {
    const sums: Record<number, Unit> = {};
    const counts: Record<number, number> = {};
    data.forEach((entry) => {
      const year = new Date(entry.date).getFullYear();
      if (entry[metric] === undefined) {
        return;
      }
      if (!sums[year]) {
        sums[year] = entry[metric];
      } else {
        sums[year] = sums[year].add(entry[metric]);
      }
      counts[year] ??= 0;
      counts[year]++;
    });
    if (METRICS_AVERAGE_OR_SUM[metric] === SumOrAverage.SUM) {
      return sums;
    } else if (METRICS_AVERAGE_OR_SUM[metric] === SumOrAverage.AVERAGE) {
      return this.getYearlyAveragesFromSumsAndCounts(sums, counts);
    } else {
      throw new Error("Unknown metric");
    }
  }

  private getYearlyAveragesFromSumsAndCounts(
    sums: Record<number, Unit>,
    counts: Record<number, number>,
  ): Record<number, Unit> {
    const result: Record<number, Unit> = {};
    for (const year in sums) {
      const yearAsNumber = Number(year);
      result[yearAsNumber] = sums[yearAsNumber].divide(counts[yearAsNumber]);
    }
    return result;
  }
}
