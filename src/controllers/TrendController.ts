import OpenMeteoGeocoding from "../models/openMeteo/OpenMeteoGeocoding";
import OpenMeteoHistorical from "../models/openMeteo/OpenMeteoHistorical";
import TooManyRequestsError from "../errors/TooManyRequestsError";
import FormHandler from "../ui/FormHandler";
import WeatherRetriever from "../models/WeatherRetriever";
import TrendResultRenderer from "../ui/TrendResultRenderer";
import { WeatherData, WeatherMetric } from "../types";
import Coordinate from "../models/Coordinate";
import FormParser from "../models/FormParser";
import WeatherChartDataAdapter from "../models/WeatherChartDataAdapter";

export default class TrendController {
  private formHandler: FormHandler;
  private weatherRetriever: WeatherRetriever;
  private renderer: TrendResultRenderer;

  public constructor() {
    this.formHandler = new FormHandler();
    this.weatherRetriever = new WeatherRetriever(new OpenMeteoHistorical());
    this.renderer = new TrendResultRenderer();
  }

  public init(): void {
    this.formHandler.onSubmit(this.handleSubmit.bind(this));
  }

  private async handleSubmit(formData: FormData): Promise<void> {
    const { city, metrics } = this.parseFormData(formData);
    this.displayTrendGraphs(city, metrics);
  }

  private parseFormData(formData: FormData): {
    city: string;
    metrics: WeatherMetric[];
  } {
    const formParser = new FormParser(formData);
    return {
      city: formParser.getCity(),
      metrics: formParser.getWeatherMetrics(),
    };
  }

  private async displayTrendGraphs(
    city: string,
    metrics: WeatherMetric[],
  ): Promise<void> {
    this.renderer.renderLoadingMessage(city);
    const coordinates = await this.getCoordinates(city);
    const weatherData = await this.getWeatherData(coordinates, metrics);
    this.renderWeatherData(weatherData, metrics);
  }

  private async getCoordinates(city: string): Promise<Coordinate> {
    const geocoding = new OpenMeteoGeocoding();
    try {
      return await geocoding.getCoordinatesFromCity(city);
    } catch {
      this.renderer.renderCouldNotFindCityMessage(city);
      throw new Error("Could not get coordinates");
    }
  }

  private async getWeatherData(
    coordinates: Coordinate,
    metrics: WeatherMetric[],
  ): Promise<WeatherData[]> {
    try {
      return await this.weatherRetriever.getYearlyWeatherData(
        coordinates,
        metrics,
      );
    } catch (error: unknown) {
      if (error instanceof TooManyRequestsError) {
        this.renderer.renderRateLimitExceededMessage();
      }
      throw error;
    }
  }

  private async renderWeatherData(
    weatherData: WeatherData[],
    metrics: WeatherMetric[],
  ): Promise<void> {
    this.renderer.clear();

    for (const metric of metrics) {
      this.renderSingleMetricWeatherData(weatherData, metric);
    }
  }

  private async renderSingleMetricWeatherData(
    weatherData: WeatherData[],
    metric: WeatherMetric,
  ): Promise<void> {
    const weatherAdapter = new WeatherChartDataAdapter(weatherData, metric);
    const chartData = weatherAdapter.getChartData();
    this.renderer.renderChart(chartData, metric);
  }
}
