import { Color, LineChart, Polyline } from "line-chart";
import { WeatherMetric } from "../api/HistoricalWeatherApi";
import { ChartData as ChartData } from "./ChartData";
import MESSAGES_FOR_CHANGE from "./messages.json";

const COLOR_FOR_METRIC: Record<WeatherMetric, string> = {
  temperature: "orangered",
  windSpeed: "lightblue",
  rainfall: "gray",
  snowfall: "lightgray",
};

export default class TrendResultRenderer {
  private resultDiv: HTMLElement;

  public constructor() {
    this.resultDiv = document.querySelector("#result-div")!;
    if (!this.resultDiv) throw new Error("Result div not found");
  }

  public renderLoadingMessage(city: string): void {
    if (!this.resultDiv) throw new Error("Result div not found");
    this.resultDiv.innerHTML = "";
    this.resultDiv.appendChild(
      this.stringToPreTag(
        `Loading data for ${city}...\nThis may take up to a minute.`,
      ),
    );
  }

  public renderCouldNotFindCityMessage(city: string): void {
    this.resultDiv.textContent = `Could not find city: ${city}`;
  }

  public renderRateLimitExceededMessage(): void {
    this.resultDiv.textContent =
      "Rate limit exceeded. Please try again in a few minutes.";
  }

  public renderChart(chartData: ChartData, metric: WeatherMetric): void {
    const message = this.createTrendMessageElement(chartData, metric);
    this.resultDiv.appendChild(message);
    const chart = this.createChart(chartData, metric);
    this.resultDiv.appendChild(chart);
  }

  private createChart(chartData: ChartData, metric: WeatherMetric): LineChart {
    const chart = new LineChart();
    const lines = this.getLines(chartData, metric);
    for (const line of lines) {
      chart.addLine(line);
    }
    chart.autoFitViewport({
      paddingY: 50,
    });
    return chart;
  }

  private createTrendMessageElement(
    chartData: ChartData,
    metric: WeatherMetric,
  ): HTMLPreElement {
    const change =
      chartData.regression[chartData.regression.length - 1].y -
      chartData.regression[0].y;
    return this.stringToPreTag(this.getMetricChangeMessage(metric, change));
  }

  private getLines(chartData: ChartData, metric: WeatherMetric): Polyline[] {
    return [
      new Polyline(chartData.rawPoints, {
        color: new Color("orange"),
        thickness: 2,
      }),
      new Polyline(chartData.rollingAverage, {
        color: new Color(COLOR_FOR_METRIC[metric]),
        thickness: 5,
      }),
      new Polyline(chartData.regression, {
        color: new Color("black"),
        thickness: 2,
      }),
    ];
  }

  private stringToPreTag(string: string): HTMLPreElement {
    const pre = document.createElement("pre");
    pre.textContent = string;
    return pre;
  }

  private getMetricChangeMessage(
    metric: WeatherMetric,
    change: number,
  ): string {
    let message = "";
    if (change > 0) {
      message = MESSAGES_FOR_CHANGE[metric].increase;
    } else if (change < 0) {
      message = MESSAGES_FOR_CHANGE[metric].decrease;
    }
    return message.replace("{change}", Math.abs(change).toFixed(2));
  }
}
