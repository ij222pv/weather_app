import Coordinate from "../utils/Coordinate";

export default interface GeocodingApi {
  getCoordinatesFromCity(query: string): Promise<Coordinate>;
}
