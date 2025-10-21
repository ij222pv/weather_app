import { AVAILABLE_METRICS } from "../typedConfig";
import { WeatherMetric } from "../types";

export default class FormParser {
  public constructor(private formData: FormData) {}

  public getCity(): string {
    const city = this.formData.get("city")?.toString();
    if (!city) throw new Error("City is required");
    return city;
  }

  public getWeatherMetrics(): WeatherMetric[] {
    const metrics: WeatherMetric[] = [];
    for (const metric of AVAILABLE_METRICS) {
      if (this.formData.get(metric)) {
        metrics.push(metric);
      }
    }
    return metrics;
  }
}
