const request = require('request');

const forecast = (latitude, longitude, cb) => {
    const url = `http://api.weatherstack.com/current?access_key=e98e1fe0c8cb90c07c135ccd518f0728&query=${latitude},${longitude}&units=f`

    request({ url, json: true }, (err, { body }) => {
        // console.log(res.body);
        if (err) {
            cb('Unable to connect to weather services!', undefined);
        } else if (body.error) {
            cb('Unable to find location', undefined);
        } else {
            // console.log(body.current)
            const currentTemp = body.current.temperature;
            const feelsLike = body.current.feelslike;
            const weatherDescription = body.current.weather_descriptions[0];
            const humidity = body.current.humidity;
            cb(
                undefined,
                `${weatherDescription}. It is currently ${currentTemp} degrees and feels like ${feelsLike}.
                Humidty levels are at ${humidity}%.`
            )
        }
    })
};

module.exports = forecast
