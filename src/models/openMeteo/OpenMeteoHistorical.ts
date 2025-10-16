import type HistoricalWeatherApi from "../../api/HistoricalWeatherApi";
import TooManyRequestsError from "../../errors/TooManyRequestsError";
import config from "../../typedConfig";
import { WeatherData, WeatherMetric } from "../../types";
import Coordinate from "../../utils/Coordinate";
import DateRange from "../../utils/DateRange";

type HistoricalJsonResponse = {
  latitude: number;
  longitude: number;
  daily: {
    time: string[];
    temperature_2m_mean?: number[];
    windspeed_10m_mean?: number[];
    rain_sum?: number[];
    snowfall_sum?: number[];
  };
};

export default class OpenMeteoHistorical implements HistoricalWeatherApi {
  private static readonly apiUrl =
    "https://archive-api.open-meteo.com/v1/archive";
  private static readonly optionsMap: Record<WeatherMetric, string> = {
    temperature: "temperature_2m_mean",
    windSpeed: "windspeed_10m_mean",
    rainfall: "rain_sum",
    snowfall: "snowfall_sum",
  };

  public async getDaily(
    location: Coordinate,
    dates: DateRange,
    options: WeatherMetric[],
  ): Promise<WeatherData[]> {
    const response = await this.fetch(location, dates, options);
    const json = await this.getJsonFromResponse(response);
    const weatherData = this.getWeatherDataFromJson(json, options);
    return weatherData;
  }

  private async fetch(
    location: Coordinate,
    dates: DateRange,
    options: WeatherMetric[],
  ): Promise<Response> {
    const url = this.getFetchUrl(location, dates, options);
    const response = await fetch(url);
    this.validateResponse(response);
    return response;
  }

  private getFetchUrl(
    location: Coordinate,
    dates: DateRange,
    options: WeatherMetric[],
  ): URL {
    const url = new URL(OpenMeteoHistorical.apiUrl);
    url.searchParams.append("latitude", location.latitude.toString());
    url.searchParams.append("longitude", location.longitude.toString());
    url.searchParams.append(
      "start_date",
      this.convertDateToString(dates.start),
    );
    url.searchParams.append("end_date", this.convertDateToString(dates.end));
    for (const param of this.getListOfDailyParameters(options)) {
      url.searchParams.append("daily", param);
    }
    url.searchParams.append("format", "json");
    return url;
  }

  // Returns the date in the format YYYY-MM-DD
  private convertDateToString(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  private getListOfDailyParameters(options: WeatherMetric[]): string[] {
    const params: string[] = [];
    for (const option of options) {
      params.push(OpenMeteoHistorical.optionsMap[option]);
    }
    return params;
  }

  private validateResponse(response: Response): void {
    if (response.ok) {
      return;
    }
    if (response.status === 429) {
      throw new TooManyRequestsError("Rate limit exceeded");
    }
    throw new Error("Network response was not ok");
  }

  private async getJsonFromResponse(
    response: Response,
  ): Promise<HistoricalJsonResponse> {
    const json = await response.json();
    this.validateJson(json);
    return json;
  }

  private validateJson(data: unknown): void {
    if (!this.isHistoricalJsonResponse(data)) {
      throw new Error("Invalid JSON structure");
    }
  }

  private isHistoricalJsonResponse(
    data: unknown,
  ): data is HistoricalJsonResponse {
    return Boolean(
      data &&
        typeof data === "object" &&
        "latitude" in data &&
        "longitude" in data &&
        "daily" in data &&
        typeof data.daily === "object",
    );
  }

  private getWeatherDataFromJson(
    json: HistoricalJsonResponse,
    selectedMetrics: WeatherMetric[],
  ): WeatherData[] {
    const result: WeatherData[] = [];
    for (let i = 0; i < json.daily.time.length; i++) {
      const dailyData: WeatherData = {
        date: new Date(json.daily.time[i]),
      };

      for (const metric of selectedMetrics) {
        dailyData[metric] = config[metric].unitConstructor(
          json.daily[config[metric].openMeteoName][i],
        );
      }

      result.push(dailyData);
    }
    return result;
  }
}
