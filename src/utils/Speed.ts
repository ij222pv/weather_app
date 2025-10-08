export default class Speed {
  private constructor(private metersPerSecond: number) {}

  public static fromMetersPerSecond(mps: number): Speed {
    return new Speed(mps);
  }

  public static fromKilometersPerHour(kph: number): Speed {
    return new Speed(kph / 3.6);
  }

  public toMetersPerSecond(): number {
    return this.metersPerSecond;
  }

  public toKilometersPerHour(): number {
    return this.metersPerSecond * 3.6;
  }
}
