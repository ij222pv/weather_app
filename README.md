# Weather Trend Analyzer

![Version](https://img.shields.io/github/package-json/v/ij222pv/weather_app)
[![License](https://img.shields.io/github/license/ij222pv/weather_app)](LICENSE)

Deployed at: https://ij222pv.github.io/weather_app/

This app is meant to allow anyone to view graphs over weather trends. The app should allow you to type in a location, select a number of weather metrics like temperature and snowfall, and then show a graph over how these metrics have changed over the years. It should also show a linear regression in the graphs to more clearly illustrate the trend. And you should see a text associated with each graph, describing trend.

This app is built using Vite and TypeScript, gets weather data from the Open-Meteo API, and displays data using the [line chart library](https://github.com/ij222pv/line-chart) I have previously made.

## Documents 

- [Requirements](requirements.md)
- [Test report](test_report.md)
- [Reflection](reflection.md)

## Contributing

If you find any issues or have suggestions for improvements, please feel free to open an issue.

If you want to contribute code, please fork the repository and create a pull request with your modifications.

## Building and running

**Development server:**

```bash
npm install
npm run dev
```

Then navigate to the link in the terminal, usually `http://localhost:5173/`.

**Production server:**

```bash
npm install --omit=dev
npm run build
```

Then serve the contents of the `docs` folder using a static file server.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.