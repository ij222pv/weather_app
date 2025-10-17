# Test report

## TC1 - Input form

| Step | Action                                                           | Expected Result                                                                                                                  |
| ---- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Visit the web page at https://ij222pv.github.io/weather_app/     | The web page loads without errors.                                                                                               |
| 2    | Input "Paris" as the city name.                                  | The form has a text input for the city name that accepts input.                                                                  |
| 3    | Make sure that all weather metrics can be checked and unchecked. | The form has checkboxes for all weather metrics (temperature, wind speed, rainfall, snowfall) that can be checked and unchecked. |
| 4    | Uncheck all weather metrics and try to submit the form.          | An error message is shown indicating that at least one metric must be selected.                                                  |
| 5    | Check at least one weather metric and submit the form.           | The form is submitted successfully without errors.                                                                               |

## TC2 - Show trends

| Step | Action                                                                                           | Expected Result                                                                                                  |
| ---- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| 1    | Fill in the form with the city name "Stockholm", check all weather metrics, and submit the form. | The form is submitted and a text appears indicating that the data is being loaded.                               |
| 2    | Wait for the data to load and the charts to be displayed.                                        | A line chart for each selected weather metric is displayed, and above each chart is a text describing the trend. |

## TC3 - Chart

| Step | Action                                                                                           | Expected Result                                                                                                                                                       |
| ---- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Fill in the form with the city name "Stockholm", check all weather metrics, and submit the form. | The form is submitted and charts are displayed for each selected weather metric.                                                                                      |
| 2    | Verify the graph lines on each chart.                                                            | Each chart displays a line representing the yearly data points from 1940 to the most recent year, along with a straight regression line indicating the overall trend. |
| 3    | Verify the x-axis and y-axis of each chart.                                                      | The x-axis displays the year, going from 1940 to the current year, and the y-axis displays the value of the weather metric.                                           |

## TC4 - Units

| Step | Action                                                                                           | Expected Result                                                                                                                                                                                                                                                     |
| ---- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Fill in the form with the city name "Stockholm", check all weather metrics, and submit the form. | The form is submitted and charts are displayed for each selected weather metric.                                                                                                                                                                                    |
| 2    | Verify the units in the messages written above each chart.                                        | The units used are as follows: temperature in °C, wind speed in m/s, rainfall in mm, and snowfall in mm.                                                                                                                                                            |
| 3    | Verify the units on the y-axis of each chart.                                                    | The y-axis displays values that can feasibly be in the same unit as the unit used in the message above. For Stockholm, the y-axis should show values for temperature in the range 4-10, wind speed in the range 3.3-4.1, rainfall in the range 250-750, and snowfall in the range 20-160 |
