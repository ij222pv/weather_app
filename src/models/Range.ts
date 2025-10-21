export default class Range {
  public readonly start: number;
  public readonly end: number;

  public constructor(start: number = 0, end: number = 1) {
    this.validateNumber(start);
    this.validateNumber(end);
    this.start = start;
    this.end = end;
  }

  /**
   * @throws TypeError if not a number.
   */
  private validateNumber(value: number): void {
    if (typeof value !== "number") {
      throw new TypeError("argument must be number");
    }
  }

  public get length(): number {
    return this.end - this.start;
  }
}
