import { Point } from "line-chart";
import { ChartData, WeatherData, WeatherMetric } from "../types";
import Coordinate from "../utils/Coordinate";
import HistoricalWeatherApi from "../api/HistoricalWeatherApi";
import DateRange from "../utils/DateRange";
import { AVAILABLE_METRICS, START_YEAR } from "../typedConfig";
import RegressionModel from "./RegressionModel";
import Range from "../utils/Range";
import MetricAnalyzer, { MultipleMetricYearlyData } from "./MetricAnalyzer";

export default class TrendModel {
  private historicalApi: HistoricalWeatherApi;

  constructor(historicalApi: HistoricalWeatherApi) {
    this.historicalApi = historicalApi;
  }

  public async getYearlyWeatherData(
    coordinates: Coordinate,
    metrics: WeatherMetric[],
  ): Promise<WeatherData[]> {
    const weatherData = await this.getRawWeatherData(coordinates, metrics);
    return this.getYearlyAveragesFromRawData(weatherData);
  }

  private async getRawWeatherData(
    coordinates: Coordinate,
    metrics: WeatherMetric[],
  ): Promise<WeatherData[]> {
    return await this.historicalApi.getDaily(
      coordinates,
      new DateRange(new Date(`${START_YEAR}-01-01`), new Date()),
      metrics,
    );
  }

  private getYearlyAveragesFromRawData(data: WeatherData[]): WeatherData[] {
    const yearlyMetrics: MultipleMetricYearlyData = {};
    for (const metric of AVAILABLE_METRICS) {
      const metricAnalyzer = new MetricAnalyzer(data, metric);
      yearlyMetrics[metric] = metricAnalyzer.getYearlyData();
    }
    return this.consolidateWeatherDataByYear(yearlyMetrics);
  }

  private consolidateWeatherDataByYear(
    data: MultipleMetricYearlyData,
  ): WeatherData[] {
    const result: WeatherData[] = [];
    for (let year = START_YEAR; year <= new Date().getFullYear(); year++) {
      const entry: WeatherData = { date: new Date(`${year}-01-01`) };
      for (const metric of Object.keys(data)) {
        entry[metric] = data[metric][year] ?? null;
      }
      result.push(entry);
    }
    return result;
  }

  public getChartDataFromWeatherData(
    weatherData: WeatherData[],
    metric: WeatherMetric,
  ): ChartData {
    const points = this.getPointsFromWeatherData(weatherData, metric);

    const regressionModel = new RegressionModel();
    const regressionPoints = regressionModel.getRegressionLine(
      points,
      new Range(points[0]?.x ?? 0, points[points.length - 1]?.x ?? 0),
    );

    return {
      rawPoints: points,
      regression: regressionPoints,
    };
  }

  private getPointsFromWeatherData(
    weatherData: WeatherData[],
    metric: WeatherMetric,
  ): Point[] {
    return weatherData
      .filter((entry) => {
        return entry[metric] !== undefined;
      })
      .map((entry) => {
        return new Point(
          entry.date.getFullYear(),
          entry[metric]!.getDisplayNumber() ?? 0,
        );
      });
  }
}
