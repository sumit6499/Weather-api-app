const express = require("express");
const https = require("https");
const bodyParse = require("body-parser");
const { response } = require("express");
const app = express();
const port = 3000;

app.use(express.static(__dirname + "/public"));

//Method to fecth data when user send post request
app.use(bodyParse.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const endpoint = "https://api.openweathermap.org/data/2.5/weather";
  const apiKey = "550fac61c6d4c00ecc161973a094d34d";
  const units = "metric";
  let city = req.body.city;
  const url = endpoint + "?q=" + city + "&appid=" + apiKey + "&units=" + units;
  https.get(url, (response) => {
    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      const weatherDescription = weatherData.weather[0].description;
      const temp = weatherData.main.temp;
      const icon = weatherData.weather[0].icon;
      const imgUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<h1>Tempreture in " + city + " is " + temp + "Celsius</h1>");
      res.write(
        `<h3>Weather Condition in ${city} is ${weatherDescription}</h3>`
      );
      res.write(`<img src="${imgUrl}" alt="_blank">`);
      res.send();
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on ${port}\n http://localhost:${port}`);
});
