import GeocodingApi from "../../api/GeocodingApi";
import Coordinate from "../Coordinate";

type GeocodingJsonResponse = {
  results: { latitude: number; longitude: number }[];
};

export default class OpenMeteoGeocoding implements GeocodingApi {
  private static readonly apiUrl =
    "https://geocoding-api.open-meteo.com/v1/search";

  public async getCoordinatesFromCity(query: string): Promise<Coordinate> {
    const response = await this.fetch(query);
    const json = await this.getJsonFromResponse(response);
    const coordinate = await this.getCoordinateFromJson(json);
    return coordinate;
  }

  private async fetch(cityQuery: string): Promise<Response> {
    const url = this.getFetchUrl(cityQuery);
    const response = await fetch(url);
    this.validateResponse(response);
    return response;
  }

  private getFetchUrl(cityQuery: string): URL {
    const url = new URL(OpenMeteoGeocoding.apiUrl);
    url.searchParams.append("name", cityQuery);
    url.searchParams.append("count", "1");
    url.searchParams.append("language", "en");
    url.searchParams.append("format", "json");
    return url;
  }

  private validateResponse(response: Response): void {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  }

  private async getJsonFromResponse(
    response: Response,
  ): Promise<GeocodingJsonResponse> {
    const json = await response.json();
    this.validateJson(json);
    return json;
  }

  private validateJson(data: unknown): void {
    if (!this.isGeocodingResponse(data)) {
      throw new Error("Invalid JSON structure");
    }
  }

  private isGeocodingResponse(data: unknown): data is GeocodingJsonResponse {
    if (
      !data ||
      typeof data !== "object" ||
      !("results" in data) ||
      !Array.isArray(data.results) ||
      data.results.length === 0
    ) {
      return false;
    }
    return true;
  }

  private async getCoordinateFromJson(
    json: GeocodingJsonResponse,
  ): Promise<Coordinate> {
    const { latitude, longitude } = json.results[0];
    return new Coordinate(latitude, longitude);
  }
}
