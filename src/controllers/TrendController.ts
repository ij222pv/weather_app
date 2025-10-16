import { Point } from "line-chart";
import OpenMeteoGeocoding from "../openMeteo/OpenMeteoGeocoding";
import OpenMeteoHistorical from "../openMeteo/OpenMeteoHistorical";
import DateRange from "../utils/DateRange";
import TooManyRequestsError from "../errors/TooManyRequestsError";
import FormHandler from "../ui/FormHandler";
import TrendModel from "../models/TrendModel";
import TrendResultRenderer from "../ui/TrendResultRenderer";
import { ChartData } from "../ui/ChartData";
import { WeatherData, WeatherMetric } from "../types";

export default class TrendController {
  private formHandler: FormHandler;
  private trendModel: TrendModel;

  constructor() {
    this.formHandler = new FormHandler();
    this.trendModel = new TrendModel();
  }

  public init(): void {
    this.formHandler.onSubmit(this.handleSubmit.bind(this));
  }

  private async handleSubmit(formData: FormData): Promise<void> {
    const city = this.trendModel.getCityFromFormData(formData);
    const metrics = this.trendModel.getWeatherMetricsFromFormData(formData);
    this.displayTrendGraphs(city, metrics);
  }

  private async displayTrendGraphs(
    city: string,
    metrics: WeatherMetric[],
  ): Promise<void> {
    const renderer = new TrendResultRenderer();
    renderer.renderLoadingMessage(city);

    const resultDiv = document.querySelector("#result-div");
    if (!resultDiv) throw new Error("Result div not found");

    const geocoding = new OpenMeteoGeocoding();
    let coordinates;
    try {
      coordinates = await geocoding.getCoordinatesFromCity(city);
    } catch {
      renderer.renderCouldNotFindCityMessage(city);
      return;
    }

    let weatherData: WeatherData[] = [];
    try {
      weatherData = await new OpenMeteoHistorical().getDaily(
        coordinates,
        new DateRange(new Date("1940-01-01"), new Date()),
        metrics,
      );
    } catch (error: unknown) {
      if (error instanceof TooManyRequestsError) {
        renderer.renderRateLimitExceededMessage();
        return;
      }
    }

    const weatherDataYearly = this.trendModel.getAverageYearlyData(weatherData);

    resultDiv.innerHTML = "";

    for (const metric of metrics) {
      const points = weatherDataYearly.map((entry) => {
        if (!entry[metric]) {
          throw new Error(`Missing metric ${metric} for year ${entry.date}`);
        }
        return new Point(
          entry.date.getFullYear(),
          entry[metric].getDisplayNumber() ?? 0,
        );
      });

      const windowSize = 20;
      const smoothed = this.trendModel.getRollingAverage(
        points.map((p) => p.y),
        windowSize,
      );
      const averagePoints: Point[] = smoothed.map(
        (value, index) => new Point(1940 + index, value),
      );

      const regression = this.trendModel.linearRegression(points);
      const regressionPoints: Point[] = [
        new Point(1940, regression.intercept + regression.slope * 1940),
        new Point(2025, regression.intercept + regression.slope * 2025),
      ];

      const chartData: ChartData = {
        rawPoints: points,
        rollingAverage: averagePoints,
        regression: regressionPoints,
      };

      renderer.renderChart(chartData, metric);
    }
  }
}
