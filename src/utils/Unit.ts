export default abstract class Unit {
  public abstract valueOf(): number;

  /**
   * Returns a new instance of the same type with the summed value
   * Does not modify the original instances.
   */
  public add(other: this | number): this {
    this.validateType(other);
    const constructor = this.constructor as {
      new (value: number): typeof this;
    };
    return new constructor(this.valueOf() + other.valueOf());
  }

  /**
   * Returns a new instance of the same type with the divided value
   * Does not modify the original instances.
   */
  public divide(other: this | number): this {
    this.validateType(other);
    const constructor = this.constructor as {
      new (value: number): typeof this;
    };
    return new constructor(this.valueOf() / other.valueOf());
  }

  private validateType(other: Unit | number): void {
    if (this.constructor !== other.constructor && typeof other !== "number") {
      throw new TypeError("Cannot compare different unit types");
    }
  }
}
