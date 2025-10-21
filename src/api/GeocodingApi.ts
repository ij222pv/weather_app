import Coordinate from "../models/Coordinate";

export default interface GeocodingApi {
  getCoordinatesFromCity(query: string): Promise<Coordinate>;
}
