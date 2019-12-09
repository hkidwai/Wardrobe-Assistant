export const getLatitudeLongitude = async (jwt) => {
    let result = await axios({
        method: "get",
        url: 'http://localhost:3000/user/geolocation',
        headers: {
            Authorization: `Bearer ${jwt}`
        },
        data: {
            data: {
                latitude: 'latitude',
                longitude: 'longitude',
            }
        }
    }).then(async response => {
        return response.data.result;
    }).catch(async error => {
        return {};
    });
    return result;
}

export const getWeatherData = async (latitude, longitude) => {
    let result = await axios({
        method: "get",
        url: `https://api.weather.gov/points/${latitude},${longitude}`,
    }).then(async response => {
        return response;
    }).catch(async error => {
        return {};
    });
    return result.data;
};

export const getForecastHourlyData = async (forecastHourlyEndpoint) => {
    let result = await axios({
        method: "get",
        url: forecastHourlyEndpoint,
    }).then(async response => {
        return response;
    }).catch(async error => {
        return {};
    });
    return result.data;
};

$(async () => {

    let jwt = localStorage.getItem('jwt')
    let { latitude, longitude } = await getLatitudeLongitude(jwt)
    console.log(latitude, longitude)
    let weatherData = await getWeatherData(latitude, longitude);
    let forecastHourlyEndpoint = weatherData.properties.forecastHourly;
    console.log(forecastHourlyEndpoint);
    let forecastHourlyData = await getForecastHourlyData(forecastHourlyEndpoint)
    console.log(forecastHourlyData);
    let soonestPeriod = forecastHourlyData.properties.periods[0];
    console.log(soonestPeriod)
    let shortForecast = soonestPeriod.shortForecast;
    console.log(shortForecast)
});
