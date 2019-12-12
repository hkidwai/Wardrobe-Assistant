import * as inventory from './inventory.js';
import { replaceItem } from './inventory.js';

//export let itemTypes = ['hats', 'shirts', 'pants', 'accessories'];

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

export const getIconType = (icon) => {
    let re = new RegExp('.*/(.+)[,?]');
    let iconType = icon.match(re)[1];
    return iconType;
}

export const needWeatherProofClothing = (iconType) => {
    let needWeatherProofClothingMap = {
        "skc": false,
        "few": false,
        "sct": false,
        "bkn": false,
        "ovc": false,
        "wind_skc": false,
        "wind_few": false,
        "wind_sct": false,
        "wind_bkn": false,
        "wind_ovc": false,
        "snow": true,
        "rain_snow": true,
        "rain_sleet": true,
        "snow_sleet": true,
        "fzra": true,
        "rain_fzra": true,
        "snow_fzra": true,
        "sleet": true,
        "rain": true,
        "rain_showers": true,
        "rain_showers_hi": true,
        "tsra": true,
        "tsra_sct": true,
        "tsra_hi": true,
        "tornado": true,
        "hurricane": true,
        "tropical_storm": true,
        "dust": true,
        "smoke": true,
        "haze": true,
        "hot": true,
        "cold": true,
        "blizzard": true,
        "fog": false,
    }
    return !!needWeatherProofClothingMap[iconType];
}

export const getNeedWeatherProofClothing = async () => {

    let jwt = localStorage.getItem('jwt')
    let { latitude, longitude } = await getLatitudeLongitude(jwt)
    let weatherData = await getWeatherData(latitude, longitude);
    let forecastEndpoint = weatherData.properties.forecast;
    let forecastHourlyEndpoint = weatherData.properties.forecastHourly;
    let forecastData = await getForecastHourlyData(forecastEndpoint)
    let forecastHourlyData = await getForecastHourlyData(forecastHourlyEndpoint)
    let soonestPeriod = forecastData.properties.periods[0];
    let soonestHourlyPeriod = forecastHourlyData.properties.periods[0];
    let shortForecast = soonestHourlyPeriod.shortForecast;
    let detailedForecast = soonestPeriod.detailedForecast;

    //detailedForecast
    $('#todays-weather-detailed').html(detailedForecast)
    
    let icon = soonestHourlyPeriod.icon;
    
    let iconType = getIconType(icon);
    //alert(iconType)
    
    let willNeedWeatherProofClothing = needWeatherProofClothing(iconType);
    //alert(willNeedWeatherProofClothing)
    return willNeedWeatherProofClothing;
}

let pick = (arr) => {
    let choice = arr[Math.floor(Math.random() * arr.length)];
    return choice;
}

let suggest = async () => {
    let willNeedWeatherProofClothing = await getNeedWeatherProofClothing();
    ///willNeedWeatherProofClothing = false;
    for (let itemType of inventory.itemTypes) {
        let itemRoot = $(`#${itemType}-item-root`)
        let items = await inventory.getAllItems(itemType);
        let filtered = items.filter(item => {
            let clothingIsWeatherProof = Object.values(item)[0]['weatherProof'];
            return (willNeedWeatherProofClothing == clothingIsWeatherProof)
        })
        
        ///console.log(`filtered for ${willNeedWeatherProofClothing}`, filtered);

        let choice = pick(filtered);
        // let temp = Object.values(choice)[0]['weatherProof'];
        // console.log(temp)
        if (choice === undefined) { // sometimes pick is will be given [], so it will return undefined. if so we pass
            ///console.log(itemType, 'did filtered')
            continue;
        } else {
            ///console.log(itemType, 'not filtered')
            //console.log('filtered',choice)
        }

        //console.log(choice)
        ///console.log(Object.keys(choice)[0])
        let choiceDataURL = Object.keys(choice)[0]
        inventory.replaceItem(choiceDataURL, itemType)
    }
}

$(async () => {
    
    await suggest();
    let resuggestSuggestionButton = $(`#resuggest-suggestion-button`);
    resuggestSuggestionButton.on('click', (event) => {window.location.reload()});

});
