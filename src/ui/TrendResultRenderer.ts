import { Color, LineChart, Polyline } from "line-chart";
import config from "../typedConfig";
import { ChartData, WeatherMetric } from "../types";

export default class TrendResultRenderer {
  private resultDiv: HTMLElement;

  public constructor() {
    this.resultDiv = document.querySelector("#result-div")!;
    if (!this.resultDiv) throw new Error("Result div not found");
  }

  public renderLoadingMessage(city: string): void {
    this.replaceWithText(
      `Loading data for ${city}...\nThis may take up to a minute.`,
    );
  }

  private replaceWithText(message: string): void {
    this.clear();
    this.resultDiv.appendChild(this.stringToPreTag(message));
  }

  public clear(): void {
    this.resultDiv.innerHTML = "";
  }

  private stringToPreTag(string: string): HTMLPreElement {
    const pre = document.createElement("pre");
    pre.textContent = string;
    return pre;
  }

  public renderCouldNotFindCityMessage(city: string): void {
    this.replaceWithText(`Could not find city: ${city}`);
  }

  public renderRateLimitExceededMessage(): void {
    this.replaceWithText(
      "Rate limit exceeded. Please try again in a few minutes.",
    );
  }

  public renderChart(chartData: ChartData, metric: WeatherMetric): void {
    const message = this.createTrendMessageElement(chartData, metric);
    const chart = this.createChart(chartData, metric);
    this.resultDiv.appendChild(message);
    this.resultDiv.appendChild(chart);
  }

  private createTrendMessageElement(
    chartData: ChartData,
    metric: WeatherMetric,
  ): HTMLPreElement {
    const change =
      chartData.regression[chartData.regression.length - 1].y -
      chartData.regression[0].y;
    return this.stringToPreTag(this.getChangeMessage(metric, change));
  }

  private getChangeMessage(metric: WeatherMetric, change: number): string {
    const template = this.getChangeMessageTemplate(metric, change);
    return template.replace("{change}", Math.abs(change).toFixed(2));
  }

  private getChangeMessageTemplate(
    metric: WeatherMetric,
    change: number,
  ): string {
    if (change > 0) {
      return config[metric].increase;
    } else if (change < 0) {
      return config[metric].decrease;
    }
    return "";
  }

  private createChart(chartData: ChartData, metric: WeatherMetric): LineChart {
    const chart = new LineChart();
    const lines = this.createLines(chartData, metric);
    for (const line of lines) {
      chart.addLine(line);
    }
    chart.autoFitViewport({
      paddingY: 50,
    });
    return chart;
  }

  private createLines(chartData: ChartData, metric: WeatherMetric): Polyline[] {
    return [
      new Polyline(chartData.rawPoints, {
        color: new Color(config[metric].color),
        thickness: 3,
      }),
      new Polyline(chartData.regression, {
        color: new Color("black"),
        thickness: 2,
      }),
    ];
  }
}
