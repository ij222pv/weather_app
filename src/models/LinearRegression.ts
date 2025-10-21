import { Point } from "line-chart";
import Range from "./Range";

export type Regression = {
  slope: number;
  intercept: number;
};

export default class RegressionModel {
  public getRegressionLine(points: Point[], range: Range): Point[] {
    if (points.length < 2) return [];
    const regression = this.calculateLinearRegression(points);
    return this.createLineFromRegression(regression, range);
  }

  private calculateLinearRegression(points: Point[]): Regression {
    const numberOfPoints = points.length;
    const meanX = points.reduce((a, b) => a + b.x, 0) / numberOfPoints;
    const meanY = points.reduce((a, b) => a + b.y, 0) / numberOfPoints;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < numberOfPoints; i++) {
      numerator += (points[i].x - meanX) * (points[i].y - meanY);
      denominator += (points[i].x - meanX) ** 2;
    }

    const b = numerator / denominator;
    const a = meanY - b * meanX;

    return { slope: b, intercept: a };
  }

  private createLineFromRegression(
    regression: Regression,
    range: Range,
  ): Point[] {
    const startPoint = new Point(
      range.start,
      regression.intercept + regression.slope * range.start,
    );
    const endPoint = new Point(
      range.end,
      regression.intercept + regression.slope * range.end,
    );
    return [startPoint, endPoint];
  }
}
