export default class Length {
  private constructor(private meters: number) {}

  public static fromMillimeters(mm: number): Length {
    return new Length(mm / 1000);
  }

  public static fromMeters(meters: number): Length {
    return new Length(meters);
  }

  public static fromKilometers(kilometers: number): Length {
    return new Length(kilometers * 1000);
  }

  public toMillimeters(): number {
    return this.meters * 1000;
  }

  public toMeters(): number {
    return this.meters;
  }

  public toKilometers(): number {
    return this.meters / 1000;
  }
}
