import { Color, LineChart, Point, Polyline } from "line-chart";

const points: Point[] = [];
for (let x = 0; x <= 10; x += 0.1) {
  const y = Math.sin(x);
  points.push(new Point(x, y));
}

const chart = new LineChart();
chart.addLine(
  new Polyline(points, {
    color: new Color("blue"),
    thickness: 3,
  })
);

document.body.appendChild(chart);