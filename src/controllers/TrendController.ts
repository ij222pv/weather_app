import { Point } from "line-chart";
import { WeatherData, WeatherMetric } from "../api/HistoricalWeatherApi";
import OpenMeteoGeocoding from "../openMeteo/OpenMeteoGeocoding";
import OpenMeteoHistorical from "../openMeteo/OpenMeteoHistorical";
import DateRange from "../utils/DateRange";
import TooManyRequestsError from "../errors/TooManyRequestsError";
import FormHandler from "../ui/FormHandler";
import TrendModel from "../models/TrendModel";

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
    document.querySelector("#result-div")!.innerHTML =
      `Loading data for ${city}...`;

    const geocoding = new OpenMeteoGeocoding();
    let coordinates;
    try {
      coordinates = await geocoding.getCoordinatesFromCity(city);
    } catch {
      document.querySelector("#result-div")!.innerHTML =
        `Could not find city: ${city}`;
      return;
    }

    const pointsTemp: Point[] = [];
    const pointsWind: Point[] = [];
    const pointsRain: Point[] = [];
    const pointsSnow: Point[] = [];
    let weatherData: WeatherData[] = [];
    try {
      weatherData = await new OpenMeteoHistorical().getDaily(
        coordinates,
        new DateRange(new Date("1940-01-01"), new Date()),
        metrics,
      );
    } catch (error: unknown) {
      if (error instanceof TooManyRequestsError) {
        document.querySelector("#result-div")!.innerHTML =
          "Rate limit exceeded. Please try again in a few minutes.";
        return;
      }
    }
    console.log(weatherData);
    for (const [index, data] of this.trendModel
      .getAverageYearlyData(weatherData)
      .entries()) {
      if (data !== undefined) {
        if (metrics.includes("temperature"))
          pointsTemp.push(
            new Point(1940 + index, data.temperature?.toCelsius() ?? 0),
          );
        if (metrics.includes("windSpeed"))
          pointsWind.push(
            new Point(1940 + index, data.windSpeed?.toMetersPerSecond() ?? 0),
          );
        if (metrics.includes("rainfall"))
          pointsRain.push(
            new Point(1940 + index, data.rainfall?.toMillimeters() ?? 0),
          );
        if (metrics.includes("snowfall"))
          pointsSnow.push(
            new Point(1940 + index, data.snowfall?.toMillimeters() ?? 0),
          );
      }
    }

    const windowSize = 10;
    const smoothedTemperatures = this.trendModel.getRollingAverage(
      pointsTemp.map((p) => p.y),
      windowSize,
    );

    const tempIncrease = smoothedTemperatures.at(-1)! - smoothedTemperatures[0];

    document.querySelector("#result-div")!.innerHTML = "";
    if (tempIncrease > 0) {
      document
        .querySelector("#result-div")!
        .appendChild(
          document.createTextNode(`Uh oh! It's getting hot in here! 🥵`),
        );
      document
        .querySelector("#result-div")!
        .appendChild(document.createElement("br"));
      document
        .querySelector("#result-div")!
        .appendChild(
          document.createTextNode(
            `The average temperature has increased by ${tempIncrease.toFixed(2)}°C since 1940.`,
          ),
        );
      document
        .querySelector("#result-div")!
        .appendChild(document.createElement("br"));
    }

    document
      .querySelector("#result-div")!
      .appendChild(
        this.trendModel.createChartFromPoints(pointsTemp, "orangered"),
      );
    document
      .querySelector("#result-div")!
      .appendChild(
        this.trendModel.createChartFromPoints(pointsWind, "lightblue"),
      );
    document
      .querySelector("#result-div")!
      .appendChild(this.trendModel.createChartFromPoints(pointsRain, "gray"));
    document
      .querySelector("#result-div")!
      .appendChild(
        this.trendModel.createChartFromPoints(pointsSnow, "lightgray"),
      );
  }
}
