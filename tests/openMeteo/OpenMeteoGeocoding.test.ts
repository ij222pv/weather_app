import { describe, test, expect } from "@jest/globals";
import OpenMeteoGeocoding from "../../src/openMeteo/OpenMeteoGeocoding";
import Coordinate from "../../src/utils/Coordinate";

const VALID_CITY = "Stockholm";
const INVALID_CITY = "fnpkwapunh34ul53h5ul34qw";
const VALID_CITY_COORDINATE = new Coordinate(59.33, 18.07);

describe("OpenMeteoGeocoding", () => {
  test("should fetch coordinates for a valid city", async () => {
    const geocoding = new OpenMeteoGeocoding();
    const coordinate = await geocoding.getCoordinatesFromCity(VALID_CITY);
    expect(coordinate).toBeDefined();
    expect(coordinate.latitude).toBeCloseTo(VALID_CITY_COORDINATE.latitude, 2);
    expect(coordinate.longitude).toBeCloseTo(VALID_CITY_COORDINATE.longitude, 2);
  });

  test("should throw an exception for an invalid city", async () => {
    const geocoding = new OpenMeteoGeocoding();
    expect(
      geocoding.getCoordinatesFromCity(INVALID_CITY)
    ).rejects.toThrow(Error);
  });
});
