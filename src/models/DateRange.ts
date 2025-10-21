export default class DateRange {
  public constructor(
    public readonly start: Date,
    public readonly end: Date,
  ) {
    this.validateRange(start, end);
  }

  private validateRange(start: Date, end: Date): void {
    if (start >= end) {
      throw new Error("Start date must be before end date");
    }
  }
}
