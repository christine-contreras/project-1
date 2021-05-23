const apiKey = 'fba8c59e3a5f9d7d2ed8d4014b3ddc97';
const form = document.getElementById('form');
const resultsContainer = document.getElementById('calendar-results');
const newCalendar = document.createElement('div');
newCalendar.setAttribute('id', `js-calendar`);
newCalendar.setAttribute('class', 'calendar');
const UlDates = document.createElement('ul');
UlDates.setAttribute('class', 'date-grid');

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
let year1, year2, year3, year4, year5;
//console.log(today.toDateString());
var [week1Day0,week1Day1,week1Day2,week1Day3,week1Day4,week1Day5,week1Day6,week2Day0,week2Day1,week2Day2,week2Day3,week2Day4,week2Day5,week2Day6,week3Day0,week3Day1,week3Day2,week3Day3,week3Day4,week3Day5,week3Day6,week4Day0,week4Day1,week4Day2,week4Day3,week4Day4,week4Day5,week4Day6,week5Day0,week5Day1,week5Day2,week5Day3,week5Day4,week5Day5,week5Day6,week6Day0,week6Day1,week6Day2,week6Day3,week6Day4,week6Day5,week6Day6] = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

function init() {
    resultsContainer.innerHTML = '';
    newCalendar.innerHTML = '';
    UlDates.innerHTML = '';

    [week1Day0,week1Day1,week1Day2,week1Day3,week1Day4,week1Day5,week1Day6,week2Day0,week2Day1,week2Day2,week2Day3,week2Day4,week2Day5,week2Day6,week3Day0,week3Day1,week3Day2,week3Day3,week3Day4,week3Day5,week3Day6,week4Day0,week4Day1,week4Day2,week4Day3,week4Day4,week4Day5,week4Day6,week5Day0,week5Day1,week5Day2,week5Day3,week5Day4,week5Day5,week5Day6,week6Day0,week6Day1,week6Day2,week6Day3,week6Day4,week6Day5,week6Day6] = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
}

//form submit actions
form.addEventListener('submit', (event) => {
    event.preventDefault();

    init();
    
    const locationInput = document.getElementById('input-location').value;
    const monthName = document.getElementById('input-month').value;
    const monthIndex = (document.getElementById('input-month').selectedIndex);
    const timeframeIndex = document.getElementById('input-timeframe').selectedIndex;
    let monthNum;
    

    //check which year to start search on then the next few years
    if(currentMonth > monthIndex) {
        year1 = currentYear;
    } else {
        year1 = currentYear - 1;
    }
    //console.log(`year to start search on: ${year1}`);
    year2 = year1 - 1;
    year3 = year1 - 2;
    year4 = year1 - 3;
    year5 = year1 - 4;


    let numDays = daysInMonth(monthIndex, year1)
    //let firstDayOfWeek = dayOfWeek(monthIndex, year1);
    //console.log('number of days in month: ' + numDays)
    

    //changing month into correct format for URL
    if (monthIndex < 10) {
        monthNum = `0${monthIndex + 1}`;
    } 
    //console.log(`month to pass into URL: ${monthIndex}`)

    const calendarTitle = document.createElement('h2');
    calendarTitle.setAttribute('class', 'h1')
    calendarTitle.innerHTML = `${locationInput}`;
    const calendarYears = document.createElement('h3');
    calendarYears.setAttribute('class', 'calendar-years')

    //calendar years
    if(timeframeIndex === 4) {
        calendarYears.innerHTML = `${year1} - ${year5}`;

    } else if (timeframeIndex === 3) {
        calendarYears.innerHTML = `${year1} - ${year4}`;

    } else if (timeframeIndex === 2) {
        calendarYears.innerHTML = `${year1} - ${year3}`;

    } else if (timeframeIndex === 1) {
        calendarYears.innerHTML = `${year1} - ${year2}`;

    } else {
        calendarYears.innerHTML = `${year1}`;
    }

    resultsContainer.append(calendarTitle,calendarYears)


    //how many times to fetch 
    switch(timeframeIndex) {
        case 4:
            fetchSubmit(locationInput, monthNum, monthIndex, year5, numDays);
        case 3:
            fetchSubmit(locationInput, monthNum, monthIndex,year4, numDays);
        case 2:
            fetchSubmit(locationInput, monthNum, monthIndex, year3, numDays);
        case 1:          
            fetchSubmit(locationInput, monthNum, monthIndex,year2, numDays);
        case 0:
            fetchSubmit(locationInput, monthNum, monthIndex,year1, numDays);

    }

    

    createCalendar(monthName);
    newCalendar.appendChild(UlDates);
    dayAverages();

});

function dayAverages() {
    const dayOfMonthArrays = [week1Day0,week1Day1,week1Day2,week1Day3,week1Day4,week1Day5,week1Day6,week2Day0,week2Day1,week2Day2,week2Day3,week2Day4,week2Day5,week2Day6,week3Day0,week3Day1,week3Day2,week3Day3,week3Day4,week3Day5,week3Day6,week4Day0,week4Day1,week4Day2,week4Day3,week4Day4,week4Day5,week4Day6,week5Day0,week5Day1,week5Day2,week5Day3,week5Day4,week5Day5,week5Day6,week6Day0,week6Day1,week6Day2,week6Day3,week6Day4,week6Day5,week6Day6]

    
    dayOfMonthArrays.forEach(day => {
        //console.log(day);

        if (day.length === 0){
            emptyLi();
        } else {
            let newObject = {};
            createDateObjects(day, newObject);

        }
    });

}

function createDateObjects(array, object) {
    //calculate mintemp avg & add to object
    const minTempAvg = Math.ceil(averages(array, 'mintemp'))
    object.mintemp = minTempAvg;

    //calculate maxtemp ave & add to object
    const maxTempAvg = Math.ceil(averages(array, 'maxtemp'))
    object.maxtemp = maxTempAvg;

    //calculate rain ave & add to object
    const rainAvg = averages(array, 'hourly', 'precip');
    object.rain = rainAvg;

    //calculate wind ave & add to object
    const windAvg = Math.ceil(averages(array, 'hourly', 'wind_speed'))
    object.wind = windAvg;

    //calculate humidity ave & add to object
    const humidityAvg = Math.ceil(averages(array, 'hourly', 'humidity'))
    object.humidity = humidityAvg;

    //calculate humidity ave & add to object
    const sunAvg = Math.ceil(averages(array, 'sunhour'))
    object.sun = sunAvg;

    //create new array from weather description
    const descriptionArray = array.map(item => {
        let description = item['hourly'][0]['weather_descriptions'];
        return description;
    });

    const descriptionOccur = descriptionArray.reduce((accum, element) => {
        if (typeof accum[element] == 'undefined') {
            accum[element] = 1;
        } else {
            accum[element] += 1
        }
        return accum;
    }, {});

    const description = Object.keys(descriptionOccur).reduce((a, b) => descriptionOccur[a] > descriptionOccur[b] ? a : b);
    object.description = description;


    //create new array from weather icon
    const iconArray = array.map(item => {
        let iconURL = item['hourly'][0]['weather_icons'];
        return iconURL;
    });

    const iconOccur = iconArray.reduce((accum, element) => {
        if (typeof accum[element] == 'undefined') {
            accum[element] = 1;
        } else {
            accum[element] += 1
        }
        return accum;
    }, {});

    const icon = Object.keys(iconOccur).reduce((a, b) => iconOccur[a] > iconOccur[b] ? a : b);
    object.icon = icon;

    createLi(object);
}

function createLi(info){
    const li = document.createElement('li');
    li.setAttribute('class', 'item');

    const quickInfo = document.createElement('div');
    quickInfo.setAttribute('class', 'date-quickinfo');

    const icon = document.createElement('img');
    icon.setAttribute('class', 'icon');
    icon.src = info.icon; 
    const description = document.createElement('p');
    description.setAttribute('class', 'description');
    description.innerText = info.description;
    const temp = document.createElement('p');
    temp.setAttribute('class', 'temperature');
    temp.innerHTML = `${info.mintemp}&deg;F / ${info.maxtemp}&deg;F`;

    quickInfo.append(icon,description,temp);


    const infoContainer = document.createElement('div');
    infoContainer.setAttribute('class', 'info');

    const rain = document.createElement('div');
    rain.setAttribute('class', 'info-group');
    const rainDecimal = (info.rain).toFixed(2);
    rain.innerHTML = `<div class="info-label"><i class="bi-cloud-rain" role="img" aria-label="rain"></i><p class="info-title">Precip</p></div><p class="info-data">${rainDecimal} mm</p>`;

    const humidity = document.createElement('div');
    humidity.setAttribute('class', 'info-group');
    humidity.innerHTML = `<div class="info-label"><i class="bi-thermometer-sun" aria-label="humidity"></i><p class="info-title">Humidity</p></div><p class="info-data">${info.humidity}&#37;</p>`;

    const wind = document.createElement('div');
    wind.setAttribute('class', 'info-group');
    const windMph = (info.wind * 0.621371).toFixed(2);
    wind.innerHTML = `<div class="info-label"><i class="bi-wind" role="img" aria-label="wind"></i><p class="info-title">Wind</p></div><p class="info-data">${windMph} mph</p>`;

    const sun = document.createElement('div');
    sun.setAttribute('class', 'info-group');
    sun.innerHTML = `<div class="info-label"><i class="bi-sunset" role="img" aria-label="sun hours"></i><p class="info-title">Sun</p></div><p class="info-data">${info.sun} hrs.</p>`;

    infoContainer.append(rain, humidity, wind, sun);

    li.append(quickInfo, infoContainer);
    UlDates.appendChild(li);


}

function averages(array, value1, value2) {

    return array.reduce((accum, element) =>{
        if(value1 === 'hourly'){
            return accum + element[value1][0][value2];

        } else {
        return accum + element[value1];
        }

    },0) / array.length;
    
}

function emptyLi(){
    const li = document.createElement('li');
    UlDates.appendChild(li);
}

function createCalendar(month){
    const calendarTitle = document.createElement('h3');
    calendarTitle.setAttribute('class', 'calendar-title');
    calendarTitle.innerText = `${month}`;

    const calendarDays = document.createElement('div');
    calendarDays.setAttribute('class', 'days-of-week');
    const daysArray = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

    daysArray.forEach(day => {
        const dayContainer = document.createElement('div');
        dayContainer.innerText = day;
        calendarDays.appendChild(dayContainer);
    });

    newCalendar.append(calendarTitle, calendarDays)
    resultsContainer.appendChild(newCalendar)
}

//use for coding look so I won't use API data
function fetchSubmit(location, monthNum, monthIndex, year, endDate) {
    let object; 

    switch(year) {
        case 2017:
            object = {
                'request': {
                    'type': 'City',
                    'query': 'Austin, United States of America',
                    'language': 'en',
                    'unit': 'f'
                },
                'location': {
                    'name': 'Austin',
                    'country': 'United States of America',
                    'region': 'Texas',
                    'lat': '30.267',
                    'lon': '-97.743',
                    'timezone_id': 'America/Chicago',
                    'localtime': '2021-05-21 16:37',
                    'localtime_epoch': 1621615020,
                    'utc_offset': '-5.0'
                },
                'current': {
                    'observation_time': '09:37 PM',
                    'temperature': 86,
                    'weather_code': 116,
                    'weather_icons': [
                        'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                    ],
                    'weather_descriptions': [
                        'Partly cloudy'
                    ],
                    'wind_speed': 9,
                    'wind_degree': 140,
                    'wind_dir': 'SE',
                    'pressure': 1018,
                    'precip': 0,
                    'humidity': 52,
                    'cloudcover': 50,
                    'feelslike': 90,
                    'uv_index': 7,
                    'visibility': 10,
                    'is_day': 'yes'
                },
                'historical': {
                    '2017-03-01': {
                        'date': '2017-03-01',
                        'date_epoch': 1488326400,
                        'astro': {
                            'sunrise': '07:57 AM',
                            'sunset': '07:30 PM',
                            'moonrise': '10:03 AM',
                            'moonset': '10:55 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 19
                        },
                        'mintemp': 54,
                        'maxtemp': 66,
                        'avgtemp': 63,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 66,
                                'wind_speed': 12,
                                'wind_degree': 143,
                                'wind_dir': 'SE',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 65,
                                'visibility': 6,
                                'pressure': 1018,
                                'cloudcover': 17,
                                'heatindex': 63,
                                'dewpoint': 50,
                                'windchill': 63,
                                'windgust': 19,
                                'feelslike': 63,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2017-03-02': {
                        'date': '2017-03-02',
                        'date_epoch': 1488412800,
                        'astro': {
                            'sunrise': '07:56 AM',
                            'sunset': '07:31 PM',
                            'moonrise': '10:45 AM',
                            'moonset': '11:59 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 26
                        },
                        'mintemp': 45,
                        'maxtemp': 63,
                        'avgtemp': 55,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 3,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 63,
                                'wind_speed': 9,
                                'wind_degree': 36,
                                'wind_dir': 'NE',
                                'weather_code': 119,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0003_white_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Cloudy'
                                ],
                                'precip': 0,
                                'humidity': 43,
                                'visibility': 6,
                                'pressure': 1028,
                                'cloudcover': 24,
                                'heatindex': 52,
                                'dewpoint': 30,
                                'windchill': 50,
                                'windgust': 16,
                                'feelslike': 50,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 3
                            }
                        ]
                    },
                    '2017-03-03': {
                        'date': '2017-03-03',
                        'date_epoch': 1488499200,
                        'astro': {
                            'sunrise': '07:55 AM',
                            'sunset': '07:32 PM',
                            'moonrise': '11:29 AM',
                            'moonset': 'No moonset',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 34
                        },
                        'mintemp': 43,
                        'maxtemp': 63,
                        'avgtemp': 55,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 63,
                                'wind_speed': 7,
                                'wind_degree': 102,
                                'wind_dir': 'ESE',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 49,
                                'visibility': 6,
                                'pressure': 1032,
                                'cloudcover': 29,
                                'heatindex': 54,
                                'dewpoint': 34,
                                'windchill': 50,
                                'windgust': 13,
                                'feelslike': 50,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2017-03-04': {
                        'date': '2017-03-04',
                        'date_epoch': 1488585600,
                        'astro': {
                            'sunrise': '07:54 AM',
                            'sunset': '07:33 PM',
                            'moonrise': '12:16 PM',
                            'moonset': '01:02 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 41
                        },
                        'mintemp': 50,
                        'maxtemp': 59,
                        'avgtemp': 55,
                        'totalsnow': 0,
                        'sunhour': 5.9,
                        'uv_index': 3,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 59,
                                'wind_speed': 9,
                                'wind_degree': 130,
                                'wind_dir': 'SE',
                                'weather_code': 302,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0018_cloudy_with_heavy_rain.png'
                                ],
                                'weather_descriptions': [
                                    'Moderate rain'
                                ],
                                'precip': 0.3,
                                'humidity': 80,
                                'visibility': 6,
                                'pressure': 1027,
                                'cloudcover': 79,
                                'heatindex': 55,
                                'dewpoint': 48,
                                'windchill': 52,
                                'windgust': 14,
                                'feelslike': 52,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 3
                            }
                        ]
                    },
                    '2017-03-05': {
                        'date': '2017-03-05',
                        'date_epoch': 1488672000,
                        'astro': {
                            'sunrise': '07:52 AM',
                            'sunset': '07:33 PM',
                            'moonrise': '01:07 PM',
                            'moonset': '02:05 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 48
                        },
                        'mintemp': 57,
                        'maxtemp': 70,
                        'avgtemp': 64,
                        'totalsnow': 0,
                        'sunhour': 5.9,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 70,
                                'wind_speed': 7,
                                'wind_degree': 150,
                                'wind_dir': 'SSE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.4,
                                'humidity': 93,
                                'visibility': 5,
                                'pressure': 1019,
                                'cloudcover': 95,
                                'heatindex': 63,
                                'dewpoint': 61,
                                'windchill': 63,
                                'windgust': 11,
                                'feelslike': 63,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2017-03-06': {
                        'date': '2017-03-06',
                        'date_epoch': 1488758400,
                        'astro': {
                            'sunrise': '07:51 AM',
                            'sunset': '07:34 PM',
                            'moonrise': '02:02 PM',
                            'moonset': '03:07 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 55
                        },
                        'mintemp': 64,
                        'maxtemp': 77,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 5.9,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 14,
                                'wind_degree': 177,
                                'wind_dir': 'S',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.1,
                                'humidity': 90,
                                'visibility': 5,
                                'pressure': 1014,
                                'cloudcover': 90,
                                'heatindex': 72,
                                'dewpoint': 66,
                                'windchill': 70,
                                'windgust': 22,
                                'feelslike': 70,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2017-03-07': {
                        'date': '2017-03-07',
                        'date_epoch': 1488844800,
                        'astro': {
                            'sunrise': '07:50 AM',
                            'sunset': '07:35 PM',
                            'moonrise': '03:00 PM',
                            'moonset': '04:04 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 63
                        },
                        'mintemp': 57,
                        'maxtemp': 70,
                        'avgtemp': 66,
                        'totalsnow': 0,
                        'sunhour': 5.9,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 70,
                                'wind_speed': 11,
                                'wind_degree': 116,
                                'wind_dir': 'ESE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.1,
                                'humidity': 78,
                                'visibility': 4,
                                'pressure': 1019,
                                'cloudcover': 79,
                                'heatindex': 66,
                                'dewpoint': 57,
                                'windchill': 64,
                                'windgust': 16,
                                'feelslike': 64,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2017-03-08': {
                        'date': '2017-03-08',
                        'date_epoch': 1488931200,
                        'astro': {
                            'sunrise': '07:49 AM',
                            'sunset': '07:35 PM',
                            'moonrise': '04:00 PM',
                            'moonset': '04:58 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 70
                        },
                        'mintemp': 55,
                        'maxtemp': 73,
                        'avgtemp': 64,
                        'totalsnow': 0,
                        'sunhour': 5.9,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 73,
                                'wind_speed': 6,
                                'wind_degree': 106,
                                'wind_dir': 'ESE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.2,
                                'humidity': 70,
                                'visibility': 6,
                                'pressure': 1024,
                                'cloudcover': 86,
                                'heatindex': 63,
                                'dewpoint': 52,
                                'windchill': 63,
                                'windgust': 9,
                                'feelslike': 63,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2017-03-09': {
                        'date': '2017-03-09',
                        'date_epoch': 1489017600,
                        'astro': {
                            'sunrise': '07:48 AM',
                            'sunset': '07:36 PM',
                            'moonrise': '05:00 PM',
                            'moonset': '05:47 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 77
                        },
                        'mintemp': 63,
                        'maxtemp': 75,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 5.9,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 75,
                                'wind_speed': 8,
                                'wind_degree': 179,
                                'wind_dir': 'S',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.1,
                                'humidity': 92,
                                'visibility': 5,
                                'pressure': 1020,
                                'cloudcover': 88,
                                'heatindex': 68,
                                'dewpoint': 64,
                                'windchill': 68,
                                'windgust': 12,
                                'feelslike': 68,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2017-03-10': {
                        'date': '2017-03-10',
                        'date_epoch': 1489104000,
                        'astro': {
                            'sunrise': '07:47 AM',
                            'sunset': '07:37 PM',
                            'moonrise': '06:00 PM',
                            'moonset': '06:31 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 85
                        },
                        'mintemp': 64,
                        'maxtemp': 75,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 8.8,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 75,
                                'wind_speed': 5,
                                'wind_degree': 145,
                                'wind_dir': 'SE',
                                'weather_code': 356,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0010_heavy_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Moderate or heavy rain shower'
                                ],
                                'precip': 0.3,
                                'humidity': 90,
                                'visibility': 4,
                                'pressure': 1019,
                                'cloudcover': 66,
                                'heatindex': 70,
                                'dewpoint': 64,
                                'windchill': 68,
                                'windgust': 9,
                                'feelslike': 68,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2017-03-11': {
                        'date': '2017-03-11',
                        'date_epoch': 1489190400,
                        'astro': {
                            'sunrise': '07:46 AM',
                            'sunset': '07:37 PM',
                            'moonrise': '06:59 PM',
                            'moonset': '07:13 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 92
                        },
                        'mintemp': 63,
                        'maxtemp': 64,
                        'avgtemp': 64,
                        'totalsnow': 0,
                        'sunhour': 6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 64,
                                'wind_speed': 5,
                                'wind_degree': 115,
                                'wind_dir': 'ESE',
                                'weather_code': 302,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0018_cloudy_with_heavy_rain.png'
                                ],
                                'weather_descriptions': [
                                    'Moderate rain'
                                ],
                                'precip': 0.7,
                                'humidity': 95,
                                'visibility': 3,
                                'pressure': 1018,
                                'cloudcover': 99,
                                'heatindex': 64,
                                'dewpoint': 63,
                                'windchill': 64,
                                'windgust': 7,
                                'feelslike': 64,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2017-03-12': {
                        'date': '2017-03-12',
                        'date_epoch': 1489276800,
                        'astro': {
                            'sunrise': '07:44 AM',
                            'sunset': '07:38 PM',
                            'moonrise': '07:56 PM',
                            'moonset': '07:51 AM',
                            'moon_phase': 'Full Moon',
                            'moon_illumination': 99
                        },
                        'mintemp': 46,
                        'maxtemp': 55,
                        'avgtemp': 52,
                        'totalsnow': 0,
                        'sunhour': 6,
                        'uv_index': 3,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 55,
                                'wind_speed': 12,
                                'wind_degree': 37,
                                'wind_dir': 'NE',
                                'weather_code': 266,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0017_cloudy_with_light_rain.png'
                                ],
                                'weather_descriptions': [
                                    'Light drizzle'
                                ],
                                'precip': 0.2,
                                'humidity': 86,
                                'visibility': 5,
                                'pressure': 1022,
                                'cloudcover': 86,
                                'heatindex': 52,
                                'dewpoint': 48,
                                'windchill': 50,
                                'windgust': 16,
                                'feelslike': 50,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 3
                            }
                        ]
                    },
                    '2017-03-13': {
                        'date': '2017-03-13',
                        'date_epoch': 1489363200,
                        'astro': {
                            'sunrise': '07:43 AM',
                            'sunset': '07:38 PM',
                            'moonrise': '08:52 PM',
                            'moonset': '08:26 AM',
                            'moon_phase': 'Full Moon',
                            'moon_illumination': 100
                        },
                        'mintemp': 45,
                        'maxtemp': 66,
                        'avgtemp': 57,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 3,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 66,
                                'wind_speed': 7,
                                'wind_degree': 76,
                                'wind_dir': 'ENE',
                                'weather_code': 122,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Overcast'
                                ],
                                'precip': 0,
                                'humidity': 80,
                                'visibility': 6,
                                'pressure': 1020,
                                'cloudcover': 30,
                                'heatindex': 54,
                                'dewpoint': 46,
                                'windchill': 52,
                                'windgust': 10,
                                'feelslike': 52,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 3
                            }
                        ]
                    },
                    '2017-03-14': {
                        'date': '2017-03-14',
                        'date_epoch': 1489449600,
                        'astro': {
                            'sunrise': '07:42 AM',
                            'sunset': '07:39 PM',
                            'moonrise': '09:46 PM',
                            'moonset': '09:02 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 86
                        },
                        'mintemp': 43,
                        'maxtemp': 68,
                        'avgtemp': 57,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 68,
                                'wind_speed': 6,
                                'wind_degree': 109,
                                'wind_dir': 'ESE',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 65,
                                'visibility': 6,
                                'pressure': 1024,
                                'cloudcover': 0,
                                'heatindex': 54,
                                'dewpoint': 41,
                                'windchill': 52,
                                'windgust': 11,
                                'feelslike': 52,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2017-03-15': {
                        'date': '2017-03-15',
                        'date_epoch': 1489536000,
                        'astro': {
                            'sunrise': '07:41 AM',
                            'sunset': '07:40 PM',
                            'moonrise': '10:40 PM',
                            'moonset': '09:37 AM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 79
                        },
                        'mintemp': 46,
                        'maxtemp': 70,
                        'avgtemp': 61,
                        'totalsnow': 0,
                        'sunhour': 10.2,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 70,
                                'wind_speed': 7,
                                'wind_degree': 147,
                                'wind_dir': 'SSE',
                                'weather_code': 119,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0003_white_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Cloudy'
                                ],
                                'precip': 0,
                                'humidity': 73,
                                'visibility': 6,
                                'pressure': 1024,
                                'cloudcover': 17,
                                'heatindex': 59,
                                'dewpoint': 48,
                                'windchill': 57,
                                'windgust': 11,
                                'feelslike': 57,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2017-03-16': {
                        'date': '2017-03-16',
                        'date_epoch': 1489622400,
                        'astro': {
                            'sunrise': '07:40 AM',
                            'sunset': '07:40 PM',
                            'moonrise': '11:33 PM',
                            'moonset': '10:12 AM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 72
                        },
                        'mintemp': 55,
                        'maxtemp': 73,
                        'avgtemp': 66,
                        'totalsnow': 0,
                        'sunhour': 6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 73,
                                'wind_speed': 11,
                                'wind_degree': 161,
                                'wind_dir': 'SSE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0,
                                'humidity': 88,
                                'visibility': 5,
                                'pressure': 1022,
                                'cloudcover': 80,
                                'heatindex': 64,
                                'dewpoint': 59,
                                'windchill': 63,
                                'windgust': 16,
                                'feelslike': 63,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2017-03-17': {
                        'date': '2017-03-17',
                        'date_epoch': 1489708800,
                        'astro': {
                            'sunrise': '07:38 AM',
                            'sunset': '07:41 PM',
                            'moonrise': 'No moonrise',
                            'moonset': '10:49 AM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 65
                        },
                        'mintemp': 63,
                        'maxtemp': 79,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 8.8,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 79,
                                'wind_speed': 14,
                                'wind_degree': 179,
                                'wind_dir': 'S',
                                'weather_code': 266,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0017_cloudy_with_light_rain.png'
                                ],
                                'weather_descriptions': [
                                    'Light drizzle'
                                ],
                                'precip': 0,
                                'humidity': 84,
                                'visibility': 5,
                                'pressure': 1020,
                                'cloudcover': 74,
                                'heatindex': 70,
                                'dewpoint': 64,
                                'windchill': 68,
                                'windgust': 21,
                                'feelslike': 68,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2017-03-18': {
                        'date': '2017-03-18',
                        'date_epoch': 1489795200,
                        'astro': {
                            'sunrise': '07:37 AM',
                            'sunset': '07:42 PM',
                            'moonrise': '12:25 AM',
                            'moonset': '11:29 AM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 57
                        },
                        'mintemp': 63,
                        'maxtemp': 79,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 8.8,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 79,
                                'wind_speed': 7,
                                'wind_degree': 172,
                                'wind_dir': 'S',
                                'weather_code': 386,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0016_thundery_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Patchy light rain with thunder'
                                ],
                                'precip': 0,
                                'humidity': 87,
                                'visibility': 6,
                                'pressure': 1023,
                                'cloudcover': 70,
                                'heatindex': 72,
                                'dewpoint': 64,
                                'windchill': 70,
                                'windgust': 11,
                                'feelslike': 70,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2017-03-19': {
                        'date': '2017-03-19',
                        'date_epoch': 1489881600,
                        'astro': {
                            'sunrise': '07:36 AM',
                            'sunset': '07:42 PM',
                            'moonrise': '01:17 AM',
                            'moonset': '12:10 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 50
                        },
                        'mintemp': 63,
                        'maxtemp': 79,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 10.2,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 79,
                                'wind_speed': 9,
                                'wind_degree': 193,
                                'wind_dir': 'SSW',
                                'weather_code': 122,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Overcast'
                                ],
                                'precip': 0,
                                'humidity': 86,
                                'visibility': 6,
                                'pressure': 1023,
                                'cloudcover': 47,
                                'heatindex': 70,
                                'dewpoint': 64,
                                'windchill': 68,
                                'windgust': 14,
                                'feelslike': 68,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2017-03-20': {
                        'date': '2017-03-20',
                        'date_epoch': 1489968000,
                        'astro': {
                            'sunrise': '07:35 AM',
                            'sunset': '07:43 PM',
                            'moonrise': '02:07 AM',
                            'moonset': '12:56 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 43
                        },
                        'mintemp': 61,
                        'maxtemp': 81,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 6,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 81,
                                'wind_speed': 11,
                                'wind_degree': 192,
                                'wind_dir': 'SSW',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 79,
                                'visibility': 6,
                                'pressure': 1020,
                                'cloudcover': 27,
                                'heatindex': 70,
                                'dewpoint': 61,
                                'windchill': 70,
                                'windgust': 18,
                                'feelslike': 70,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 6
                            }
                        ]
                    },
                    '2017-03-21': {
                        'date': '2017-03-21',
                        'date_epoch': 1490054400,
                        'astro': {
                            'sunrise': '07:33 AM',
                            'sunset': '07:44 PM',
                            'moonrise': '02:56 AM',
                            'moonset': '01:45 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 35
                        },
                        'mintemp': 57,
                        'maxtemp': 81,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 6,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 81,
                                'wind_speed': 11,
                                'wind_degree': 183,
                                'wind_dir': 'S',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 80,
                                'visibility': 6,
                                'pressure': 1018,
                                'cloudcover': 12,
                                'heatindex': 70,
                                'dewpoint': 61,
                                'windchill': 68,
                                'windgust': 17,
                                'feelslike': 70,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 6
                            }
                        ]
                    },
                    '2017-03-22': {
                        'date': '2017-03-22',
                        'date_epoch': 1490140800,
                        'astro': {
                            'sunrise': '07:32 AM',
                            'sunset': '07:44 PM',
                            'moonrise': '03:44 AM',
                            'moonset': '02:36 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 28
                        },
                        'mintemp': 64,
                        'maxtemp': 77,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 8.8,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 9,
                                'wind_degree': 177,
                                'wind_dir': 'S',
                                'weather_code': 143,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0006_mist.png'
                                ],
                                'weather_descriptions': [
                                    'Mist'
                                ],
                                'precip': 0,
                                'humidity': 84,
                                'visibility': 6,
                                'pressure': 1018,
                                'cloudcover': 54,
                                'heatindex': 70,
                                'dewpoint': 64,
                                'windchill': 68,
                                'windgust': 14,
                                'feelslike': 68,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2017-03-23': {
                        'date': '2017-03-23',
                        'date_epoch': 1490227200,
                        'astro': {
                            'sunrise': '07:31 AM',
                            'sunset': '07:45 PM',
                            'moonrise': '04:29 AM',
                            'moonset': '03:32 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 21
                        },
                        'mintemp': 63,
                        'maxtemp': 79,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 79,
                                'wind_speed': 16,
                                'wind_degree': 170,
                                'wind_dir': 'S',
                                'weather_code': 119,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0003_white_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Cloudy'
                                ],
                                'precip': 0,
                                'humidity': 76,
                                'visibility': 6,
                                'pressure': 1017,
                                'cloudcover': 29,
                                'heatindex': 70,
                                'dewpoint': 61,
                                'windchill': 68,
                                'windgust': 24,
                                'feelslike': 70,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2017-03-24': {
                        'date': '2017-03-24',
                        'date_epoch': 1490313600,
                        'astro': {
                            'sunrise': '07:30 AM',
                            'sunset': '07:45 PM',
                            'moonrise': '05:13 AM',
                            'moonset': '04:29 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 14
                        },
                        'mintemp': 63,
                        'maxtemp': 79,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 10.2,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 79,
                                'wind_speed': 12,
                                'wind_degree': 192,
                                'wind_dir': 'SSW',
                                'weather_code': 359,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0018_cloudy_with_heavy_rain.png'
                                ],
                                'weather_descriptions': [
                                    'Torrential rain shower'
                                ],
                                'precip': 0.6,
                                'humidity': 77,
                                'visibility': 5,
                                'pressure': 1013,
                                'cloudcover': 50,
                                'heatindex': 70,
                                'dewpoint': 61,
                                'windchill': 70,
                                'windgust': 20,
                                'feelslike': 70,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2017-03-25': {
                        'date': '2017-03-25',
                        'date_epoch': 1490400000,
                        'astro': {
                            'sunrise': '07:29 AM',
                            'sunset': '07:46 PM',
                            'moonrise': '05:55 AM',
                            'moonset': '05:30 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 6
                        },
                        'mintemp': 54,
                        'maxtemp': 81,
                        'avgtemp': 68,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 81,
                                'wind_speed': 7,
                                'wind_degree': 249,
                                'wind_dir': 'WSW',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 55,
                                'visibility': 6,
                                'pressure': 1015,
                                'cloudcover': 2,
                                'heatindex': 66,
                                'dewpoint': 48,
                                'windchill': 64,
                                'windgust': 11,
                                'feelslike': 64,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2017-03-26': {
                        'date': '2017-03-26',
                        'date_epoch': 1490486400,
                        'astro': {
                            'sunrise': '07:27 AM',
                            'sunset': '07:47 PM',
                            'moonrise': '06:36 AM',
                            'moonset': '06:31 PM',
                            'moon_phase': 'New Moon',
                            'moon_illumination': 0
                        },
                        'mintemp': 57,
                        'maxtemp': 82,
                        'avgtemp': 73,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 82,
                                'wind_speed': 11,
                                'wind_degree': 162,
                                'wind_dir': 'SSE',
                                'weather_code': 248,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0007_fog.png'
                                ],
                                'weather_descriptions': [
                                    'Fog'
                                ],
                                'precip': 0,
                                'humidity': 77,
                                'visibility': 6,
                                'pressure': 1011,
                                'cloudcover': 27,
                                'heatindex': 70,
                                'dewpoint': 61,
                                'windchill': 68,
                                'windgust': 17,
                                'feelslike': 70,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2017-03-27': {
                        'date': '2017-03-27',
                        'date_epoch': 1490572800,
                        'astro': {
                            'sunrise': '07:26 AM',
                            'sunset': '07:47 PM',
                            'moonrise': '07:17 AM',
                            'moonset': '07:35 PM',
                            'moon_phase': 'New Moon',
                            'moon_illumination': 0
                        },
                        'mintemp': 64,
                        'maxtemp': 81,
                        'avgtemp': 75,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 6,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 81,
                                'wind_speed': 7,
                                'wind_degree': 149,
                                'wind_dir': 'SSE',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 83,
                                'visibility': 6,
                                'pressure': 1011,
                                'cloudcover': 51,
                                'heatindex': 75,
                                'dewpoint': 66,
                                'windchill': 72,
                                'windgust': 10,
                                'feelslike': 75,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 6
                            }
                        ]
                    },
                    '2017-03-28': {
                        'date': '2017-03-28',
                        'date_epoch': 1490659200,
                        'astro': {
                            'sunrise': '07:25 AM',
                            'sunset': '07:48 PM',
                            'moonrise': '07:57 AM',
                            'moonset': '08:39 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 1
                        },
                        'mintemp': 68,
                        'maxtemp': 82,
                        'avgtemp': 75,
                        'totalsnow': 0,
                        'sunhour': 8.9,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 82,
                                'wind_speed': 13,
                                'wind_degree': 148,
                                'wind_dir': 'SSE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0,
                                'humidity': 84,
                                'visibility': 6,
                                'pressure': 1008,
                                'cloudcover': 59,
                                'heatindex': 73,
                                'dewpoint': 66,
                                'windchill': 72,
                                'windgust': 19,
                                'feelslike': 73,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2017-03-29': {
                        'date': '2017-03-29',
                        'date_epoch': 1490745600,
                        'astro': {
                            'sunrise': '07:24 AM',
                            'sunset': '07:48 PM',
                            'moonrise': '08:39 AM',
                            'moonset': '09:46 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 8
                        },
                        'mintemp': 64,
                        'maxtemp': 79,
                        'avgtemp': 73,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 79,
                                'wind_speed': 7,
                                'wind_degree': 232,
                                'wind_dir': 'SW',
                                'weather_code': 359,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0018_cloudy_with_heavy_rain.png'
                                ],
                                'weather_descriptions': [
                                    'Torrential rain shower'
                                ],
                                'precip': 1.1,
                                'humidity': 64,
                                'visibility': 5,
                                'pressure': 1008,
                                'cloudcover': 20,
                                'heatindex': 73,
                                'dewpoint': 57,
                                'windchill': 72,
                                'windgust': 13,
                                'feelslike': 73,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2017-03-30': {
                        'date': '2017-03-30',
                        'date_epoch': 1490832000,
                        'astro': {
                            'sunrise': '07:22 AM',
                            'sunset': '07:49 PM',
                            'moonrise': '09:24 AM',
                            'moonset': '10:52 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 15
                        },
                        'mintemp': 54,
                        'maxtemp': 77,
                        'avgtemp': 66,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 9,
                                'wind_degree': 268,
                                'wind_dir': 'W',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 54,
                                'visibility': 6,
                                'pressure': 1012,
                                'cloudcover': 3,
                                'heatindex': 64,
                                'dewpoint': 46,
                                'windchill': 63,
                                'windgust': 16,
                                'feelslike': 63,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2017-03-31': {
                        'date': '2017-03-31',
                        'date_epoch': 1490918400,
                        'astro': {
                            'sunrise': '07:21 AM',
                            'sunset': '07:50 PM',
                            'moonrise': '10:11 AM',
                            'moonset': '11:57 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 19
                        },
                        'mintemp': 55,
                        'maxtemp': 82,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 6,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 82,
                                'wind_speed': 12,
                                'wind_degree': 176,
                                'wind_dir': 'S',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 63,
                                'visibility': 6,
                                'pressure': 1009,
                                'cloudcover': 0,
                                'heatindex': 68,
                                'dewpoint': 54,
                                'windchill': 66,
                                'windgust': 21,
                                'feelslike': 66,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 6
                            }
                        ]
                    }
                }
            };
            break;
        case 2018: 
            object = {
                'request': {
                    'type': 'City',
                    'query': 'Austin, United States of America',
                    'language': 'en',
                    'unit': 'f'
                },
                'location': {
                    'name': 'Austin',
                    'country': 'United States of America',
                    'region': 'Texas',
                    'lat': '30.267',
                    'lon': '-97.743',
                    'timezone_id': 'America/Chicago',
                    'localtime': '2021-05-21 16:37',
                    'localtime_epoch': 1621615020,
                    'utc_offset': '-5.0'
                },
                'current': {
                    'observation_time': '09:37 PM',
                    'temperature': 86,
                    'weather_code': 116,
                    'weather_icons': [
                        'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                    ],
                    'weather_descriptions': [
                        'Partly cloudy'
                    ],
                    'wind_speed': 9,
                    'wind_degree': 140,
                    'wind_dir': 'SE',
                    'pressure': 1018,
                    'precip': 0,
                    'humidity': 52,
                    'cloudcover': 50,
                    'feelslike': 90,
                    'uv_index': 7,
                    'visibility': 10,
                    'is_day': 'yes'
                },
                'historical': {
                    '2018-03-01': {
                        'date': '2018-03-01',
                        'date_epoch': 1519862400,
                        'astro': {
                            'sunrise': '07:57 AM',
                            'sunset': '07:30 PM',
                            'moonrise': '07:24 PM',
                            'moonset': '07:48 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 96
                        },
                        'mintemp': 55,
                        'maxtemp': 66,
                        'avgtemp': 63,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 66,
                                'wind_speed': 11,
                                'wind_degree': 158,
                                'wind_dir': 'SSE',
                                'weather_code': 176,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Patchy rain possible'
                                ],
                                'precip': 0.1,
                                'humidity': 68,
                                'visibility': 6,
                                'pressure': 1016,
                                'cloudcover': 33,
                                'heatindex': 63,
                                'dewpoint': 52,
                                'windchill': 63,
                                'windgust': 16,
                                'feelslike': 63,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2018-03-02': {
                        'date': '2018-03-02',
                        'date_epoch': 1519948800,
                        'astro': {
                            'sunrise': '07:56 AM',
                            'sunset': '07:31 PM',
                            'moonrise': '08:28 PM',
                            'moonset': '08:30 AM',
                            'moon_phase': 'Full Moon',
                            'moon_illumination': 100
                        },
                        'mintemp': 50,
                        'maxtemp': 72,
                        'avgtemp': 63,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 72,
                                'wind_speed': 7,
                                'wind_degree': 70,
                                'wind_dir': 'ENE',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 74,
                                'visibility': 6,
                                'pressure': 1024,
                                'cloudcover': 13,
                                'heatindex': 61,
                                'dewpoint': 52,
                                'windchill': 57,
                                'windgust': 11,
                                'feelslike': 57,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2018-03-03': {
                        'date': '2018-03-03',
                        'date_epoch': 1520035200,
                        'astro': {
                            'sunrise': '07:55 AM',
                            'sunset': '07:32 PM',
                            'moonrise': '09:30 PM',
                            'moonset': '09:09 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 89
                        },
                        'mintemp': 55,
                        'maxtemp': 72,
                        'avgtemp': 63,
                        'totalsnow': 0,
                        'sunhour': 5.9,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 72,
                                'wind_speed': 7,
                                'wind_degree': 135,
                                'wind_dir': 'SE',
                                'weather_code': 266,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0017_cloudy_with_light_rain.png'
                                ],
                                'weather_descriptions': [
                                    'Light drizzle'
                                ],
                                'precip': 0,
                                'humidity': 88,
                                'visibility': 3,
                                'pressure': 1021,
                                'cloudcover': 63,
                                'heatindex': 63,
                                'dewpoint': 57,
                                'windchill': 61,
                                'windgust': 11,
                                'feelslike': 61,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2018-03-04': {
                        'date': '2018-03-04',
                        'date_epoch': 1520121600,
                        'astro': {
                            'sunrise': '07:54 AM',
                            'sunset': '07:32 PM',
                            'moonrise': '10:30 PM',
                            'moonset': '09:47 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 82
                        },
                        'mintemp': 63,
                        'maxtemp': 75,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 8.7,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 75,
                                'wind_speed': 10,
                                'wind_degree': 162,
                                'wind_dir': 'SSE',
                                'weather_code': 266,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0017_cloudy_with_light_rain.png'
                                ],
                                'weather_descriptions': [
                                    'Light drizzle'
                                ],
                                'precip': 0.1,
                                'humidity': 88,
                                'visibility': 4,
                                'pressure': 1016,
                                'cloudcover': 76,
                                'heatindex': 70,
                                'dewpoint': 64,
                                'windchill': 68,
                                'windgust': 16,
                                'feelslike': 68,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2018-03-05': {
                        'date': '2018-03-05',
                        'date_epoch': 1520208000,
                        'astro': {
                            'sunrise': '07:53 AM',
                            'sunset': '07:33 PM',
                            'moonrise': '11:28 PM',
                            'moonset': '10:23 AM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 74
                        },
                        'mintemp': 61,
                        'maxtemp': 75,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 8.8,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 75,
                                'wind_speed': 9,
                                'wind_degree': 132,
                                'wind_dir': 'SE',
                                'weather_code': 356,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0010_heavy_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Moderate or heavy rain shower'
                                ],
                                'precip': 0.3,
                                'humidity': 78,
                                'visibility': 4,
                                'pressure': 1013,
                                'cloudcover': 62,
                                'heatindex': 70,
                                'dewpoint': 61,
                                'windchill': 68,
                                'windgust': 15,
                                'feelslike': 68,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2018-03-06': {
                        'date': '2018-03-06',
                        'date_epoch': 1520294400,
                        'astro': {
                            'sunrise': '07:52 AM',
                            'sunset': '07:34 PM',
                            'moonrise': 'No moonrise',
                            'moonset': '11:00 AM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 67
                        },
                        'mintemp': 50,
                        'maxtemp': 68,
                        'avgtemp': 61,
                        'totalsnow': 0,
                        'sunhour': 10.2,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 68,
                                'wind_speed': 7,
                                'wind_degree': 37,
                                'wind_dir': 'NE',
                                'weather_code': 119,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0003_white_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Cloudy'
                                ],
                                'precip': 0,
                                'humidity': 40,
                                'visibility': 6,
                                'pressure': 1019,
                                'cloudcover': 17,
                                'heatindex': 59,
                                'dewpoint': 34,
                                'windchill': 57,
                                'windgust': 13,
                                'feelslike': 57,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2018-03-07': {
                        'date': '2018-03-07',
                        'date_epoch': 1520380800,
                        'astro': {
                            'sunrise': '07:50 AM',
                            'sunset': '07:34 PM',
                            'moonrise': '12:24 AM',
                            'moonset': '11:39 AM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 60
                        },
                        'mintemp': 45,
                        'maxtemp': 63,
                        'avgtemp': 54,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 63,
                                'wind_speed': 8,
                                'wind_degree': 30,
                                'wind_dir': 'NNE',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 38,
                                'visibility': 6,
                                'pressure': 1025,
                                'cloudcover': 38,
                                'heatindex': 54,
                                'dewpoint': 28,
                                'windchill': 50,
                                'windgust': 13,
                                'feelslike': 50,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2018-03-08': {
                        'date': '2018-03-08',
                        'date_epoch': 1520467200,
                        'astro': {
                            'sunrise': '07:49 AM',
                            'sunset': '07:35 PM',
                            'moonrise': '01:20 AM',
                            'moonset': '12:18 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 53
                        },
                        'mintemp': 46,
                        'maxtemp': 66,
                        'avgtemp': 57,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 66,
                                'wind_speed': 7,
                                'wind_degree': 125,
                                'wind_dir': 'SE',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 51,
                                'visibility': 6,
                                'pressure': 1022,
                                'cloudcover': 34,
                                'heatindex': 55,
                                'dewpoint': 36,
                                'windchill': 54,
                                'windgust': 12,
                                'feelslike': 54,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2018-03-09': {
                        'date': '2018-03-09',
                        'date_epoch': 1520553600,
                        'astro': {
                            'sunrise': '07:48 AM',
                            'sunset': '07:36 PM',
                            'moonrise': '02:13 AM',
                            'moonset': '01:01 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 45
                        },
                        'mintemp': 50,
                        'maxtemp': 68,
                        'avgtemp': 61,
                        'totalsnow': 0,
                        'sunhour': 5.9,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 68,
                                'wind_speed': 11,
                                'wind_degree': 176,
                                'wind_dir': 'S',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0,
                                'humidity': 85,
                                'visibility': 6,
                                'pressure': 1015,
                                'cloudcover': 65,
                                'heatindex': 59,
                                'dewpoint': 54,
                                'windchill': 57,
                                'windgust': 17,
                                'feelslike': 57,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2018-03-10': {
                        'date': '2018-03-10',
                        'date_epoch': 1520640000,
                        'astro': {
                            'sunrise': '07:47 AM',
                            'sunset': '07:36 PM',
                            'moonrise': '03:04 AM',
                            'moonset': '01:47 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 38
                        },
                        'mintemp': 63,
                        'maxtemp': 86,
                        'avgtemp': 75,
                        'totalsnow': 0,
                        'sunhour': 10.2,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 86,
                                'wind_speed': 9,
                                'wind_degree': 200,
                                'wind_dir': 'SSW',
                                'weather_code': 119,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0003_white_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Cloudy'
                                ],
                                'precip': 0,
                                'humidity': 76,
                                'visibility': 6,
                                'pressure': 1008,
                                'cloudcover': 45,
                                'heatindex': 72,
                                'dewpoint': 63,
                                'windchill': 72,
                                'windgust': 14,
                                'feelslike': 72,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2018-03-11': {
                        'date': '2018-03-11',
                        'date_epoch': 1520726400,
                        'astro': {
                            'sunrise': '07:46 AM',
                            'sunset': '07:37 PM',
                            'moonrise': '03:54 AM',
                            'moonset': '02:34 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 31
                        },
                        'mintemp': 59,
                        'maxtemp': 68,
                        'avgtemp': 64,
                        'totalsnow': 0,
                        'sunhour': 7.4,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 68,
                                'wind_speed': 16,
                                'wind_degree': 128,
                                'wind_dir': 'SE',
                                'weather_code': 122,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Overcast'
                                ],
                                'precip': 0,
                                'humidity': 66,
                                'visibility': 6,
                                'pressure': 1013,
                                'cloudcover': 53,
                                'heatindex': 64,
                                'dewpoint': 52,
                                'windchill': 64,
                                'windgust': 22,
                                'feelslike': 64,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2018-03-12': {
                        'date': '2018-03-12',
                        'date_epoch': 1520812800,
                        'astro': {
                            'sunrise': '07:45 AM',
                            'sunset': '07:38 PM',
                            'moonrise': '04:40 AM',
                            'moonset': '03:25 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 24
                        },
                        'mintemp': 45,
                        'maxtemp': 63,
                        'avgtemp': 55,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 63,
                                'wind_speed': 11,
                                'wind_degree': 74,
                                'wind_dir': 'ENE',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 51,
                                'visibility': 6,
                                'pressure': 1025,
                                'cloudcover': 19,
                                'heatindex': 54,
                                'dewpoint': 36,
                                'windchill': 50,
                                'windgust': 16,
                                'feelslike': 50,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2018-03-13': {
                        'date': '2018-03-13',
                        'date_epoch': 1520899200,
                        'astro': {
                            'sunrise': '07:43 AM',
                            'sunset': '07:38 PM',
                            'moonrise': '05:24 AM',
                            'moonset': '04:17 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 16
                        },
                        'mintemp': 46,
                        'maxtemp': 66,
                        'avgtemp': 59,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 66,
                                'wind_speed': 6,
                                'wind_degree': 48,
                                'wind_dir': 'NE',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 52,
                                'visibility': 6,
                                'pressure': 1024,
                                'cloudcover': 11,
                                'heatindex': 55,
                                'dewpoint': 37,
                                'windchill': 54,
                                'windgust': 9,
                                'feelslike': 54,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2018-03-14': {
                        'date': '2018-03-14',
                        'date_epoch': 1520985600,
                        'astro': {
                            'sunrise': '07:42 AM',
                            'sunset': '07:39 PM',
                            'moonrise': '06:04 AM',
                            'moonset': '05:12 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 9
                        },
                        'mintemp': 43,
                        'maxtemp': 68,
                        'avgtemp': 59,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 68,
                                'wind_speed': 6,
                                'wind_degree': 86,
                                'wind_dir': 'E',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 47,
                                'visibility': 6,
                                'pressure': 1024,
                                'cloudcover': 5,
                                'heatindex': 55,
                                'dewpoint': 36,
                                'windchill': 54,
                                'windgust': 10,
                                'feelslike': 54,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2018-03-15': {
                        'date': '2018-03-15',
                        'date_epoch': 1521072000,
                        'astro': {
                            'sunrise': '07:41 AM',
                            'sunset': '07:40 PM',
                            'moonrise': '06:43 AM',
                            'moonset': '06:07 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 2
                        },
                        'mintemp': 48,
                        'maxtemp': 70,
                        'avgtemp': 63,
                        'totalsnow': 0,
                        'sunhour': 7.4,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 70,
                                'wind_speed': 11,
                                'wind_degree': 180,
                                'wind_dir': 'S',
                                'weather_code': 122,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Overcast'
                                ],
                                'precip': 0,
                                'humidity': 78,
                                'visibility': 6,
                                'pressure': 1016,
                                'cloudcover': 55,
                                'heatindex': 59,
                                'dewpoint': 52,
                                'windchill': 57,
                                'windgust': 17,
                                'feelslike': 57,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2018-03-16': {
                        'date': '2018-03-16',
                        'date_epoch': 1521158400,
                        'astro': {
                            'sunrise': '07:40 AM',
                            'sunset': '07:40 PM',
                            'moonrise': '07:20 AM',
                            'moonset': '07:04 PM',
                            'moon_phase': 'New Moon',
                            'moon_illumination': 0
                        },
                        'mintemp': 63,
                        'maxtemp': 86,
                        'avgtemp': 75,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 86,
                                'wind_speed': 7,
                                'wind_degree': 218,
                                'wind_dir': 'SW',
                                'weather_code': 119,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0003_white_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Cloudy'
                                ],
                                'precip': 0,
                                'humidity': 69,
                                'visibility': 6,
                                'pressure': 1012,
                                'cloudcover': 42,
                                'heatindex': 72,
                                'dewpoint': 59,
                                'windchill': 72,
                                'windgust': 11,
                                'feelslike': 72,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2018-03-17': {
                        'date': '2018-03-17',
                        'date_epoch': 1521244800,
                        'astro': {
                            'sunrise': '07:39 AM',
                            'sunset': '07:41 PM',
                            'moonrise': '07:55 AM',
                            'moonset': '08:01 PM',
                            'moon_phase': 'New Moon',
                            'moon_illumination': 0
                        },
                        'mintemp': 64,
                        'maxtemp': 77,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 7.4,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 9,
                                'wind_degree': 179,
                                'wind_dir': 'S',
                                'weather_code': 200,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0016_thundery_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Thundery outbreaks possible'
                                ],
                                'precip': 0.2,
                                'humidity': 88,
                                'visibility': 5,
                                'pressure': 1012,
                                'cloudcover': 69,
                                'heatindex': 72,
                                'dewpoint': 66,
                                'windchill': 70,
                                'windgust': 14,
                                'feelslike': 72,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2018-03-18': {
                        'date': '2018-03-18',
                        'date_epoch': 1521331200,
                        'astro': {
                            'sunrise': '07:37 AM',
                            'sunset': '07:42 PM',
                            'moonrise': '08:31 AM',
                            'moonset': '09:00 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 5
                        },
                        'mintemp': 66,
                        'maxtemp': 86,
                        'avgtemp': 75,
                        'totalsnow': 0,
                        'sunhour': 10.2,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 86,
                                'wind_speed': 6,
                                'wind_degree': 177,
                                'wind_dir': 'S',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.2,
                                'humidity': 81,
                                'visibility': 6,
                                'pressure': 1009,
                                'cloudcover': 53,
                                'heatindex': 75,
                                'dewpoint': 66,
                                'windchill': 73,
                                'windgust': 9,
                                'feelslike': 75,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2018-03-19': {
                        'date': '2018-03-19',
                        'date_epoch': 1521417600,
                        'astro': {
                            'sunrise': '07:36 AM',
                            'sunset': '07:42 PM',
                            'moonrise': '09:08 AM',
                            'moonset': '09:59 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 13
                        },
                        'mintemp': 61,
                        'maxtemp': 79,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 6,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 79,
                                'wind_speed': 11,
                                'wind_degree': 297,
                                'wind_dir': 'WNW',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0.1,
                                'humidity': 53,
                                'visibility': 6,
                                'pressure': 1008,
                                'cloudcover': 18,
                                'heatindex': 68,
                                'dewpoint': 48,
                                'windchill': 68,
                                'windgust': 17,
                                'feelslike': 68,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 6
                            }
                        ]
                    },
                    '2018-03-20': {
                        'date': '2018-03-20',
                        'date_epoch': 1521504000,
                        'astro': {
                            'sunrise': '07:35 AM',
                            'sunset': '07:43 PM',
                            'moonrise': '09:46 AM',
                            'moonset': '11:01 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 20
                        },
                        'mintemp': 50,
                        'maxtemp': 70,
                        'avgtemp': 61,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 70,
                                'wind_speed': 9,
                                'wind_degree': 227,
                                'wind_dir': 'SW',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 49,
                                'visibility': 6,
                                'pressure': 1017,
                                'cloudcover': 2,
                                'heatindex': 59,
                                'dewpoint': 39,
                                'windchill': 55,
                                'windgust': 14,
                                'feelslike': 55,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2018-03-21': {
                        'date': '2018-03-21',
                        'date_epoch': 1521590400,
                        'astro': {
                            'sunrise': '07:34 AM',
                            'sunset': '07:43 PM',
                            'moonrise': '10:26 AM',
                            'moonset': 'No moonset',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 27
                        },
                        'mintemp': 48,
                        'maxtemp': 72,
                        'avgtemp': 63,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 72,
                                'wind_speed': 7,
                                'wind_degree': 128,
                                'wind_dir': 'SE',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 51,
                                'visibility': 6,
                                'pressure': 1021,
                                'cloudcover': 2,
                                'heatindex': 61,
                                'dewpoint': 41,
                                'windchill': 59,
                                'windgust': 12,
                                'feelslike': 59,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2018-03-22': {
                        'date': '2018-03-22',
                        'date_epoch': 1521676800,
                        'astro': {
                            'sunrise': '07:33 AM',
                            'sunset': '07:44 PM',
                            'moonrise': '11:12 AM',
                            'moonset': '12:03 AM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 34
                        },
                        'mintemp': 50,
                        'maxtemp': 77,
                        'avgtemp': 66,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 11,
                                'wind_degree': 169,
                                'wind_dir': 'S',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 69,
                                'visibility': 6,
                                'pressure': 1023,
                                'cloudcover': 12,
                                'heatindex': 64,
                                'dewpoint': 52,
                                'windchill': 63,
                                'windgust': 17,
                                'feelslike': 63,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2018-03-23': {
                        'date': '2018-03-23',
                        'date_epoch': 1521763200,
                        'astro': {
                            'sunrise': '07:31 AM',
                            'sunset': '07:45 PM',
                            'moonrise': '12:01 PM',
                            'moonset': '01:06 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 42
                        },
                        'mintemp': 57,
                        'maxtemp': 75,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 8.8,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 75,
                                'wind_speed': 13,
                                'wind_degree': 178,
                                'wind_dir': 'S',
                                'weather_code': 122,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Overcast'
                                ],
                                'precip': 0,
                                'humidity': 82,
                                'visibility': 6,
                                'pressure': 1018,
                                'cloudcover': 59,
                                'heatindex': 68,
                                'dewpoint': 61,
                                'windchill': 66,
                                'windgust': 20,
                                'feelslike': 66,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2018-03-24': {
                        'date': '2018-03-24',
                        'date_epoch': 1521849600,
                        'astro': {
                            'sunrise': '07:30 AM',
                            'sunset': '07:45 PM',
                            'moonrise': '12:56 PM',
                            'moonset': '02:07 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 49
                        },
                        'mintemp': 64,
                        'maxtemp': 81,
                        'avgtemp': 75,
                        'totalsnow': 0,
                        'sunhour': 8.8,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 81,
                                'wind_speed': 10,
                                'wind_degree': 192,
                                'wind_dir': 'SSW',
                                'weather_code': 266,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0017_cloudy_with_light_rain.png'
                                ],
                                'weather_descriptions': [
                                    'Light drizzle'
                                ],
                                'precip': 0,
                                'humidity': 82,
                                'visibility': 6,
                                'pressure': 1013,
                                'cloudcover': 66,
                                'heatindex': 73,
                                'dewpoint': 66,
                                'windchill': 72,
                                'windgust': 14,
                                'feelslike': 73,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2018-03-25': {
                        'date': '2018-03-25',
                        'date_epoch': 1521936000,
                        'astro': {
                            'sunrise': '07:29 AM',
                            'sunset': '07:46 PM',
                            'moonrise': '01:55 PM',
                            'moonset': '03:07 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 56
                        },
                        'mintemp': 66,
                        'maxtemp': 73,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 6.1,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 73,
                                'wind_speed': 8,
                                'wind_degree': 159,
                                'wind_dir': 'SSE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0,
                                'humidity': 88,
                                'visibility': 4,
                                'pressure': 1012,
                                'cloudcover': 82,
                                'heatindex': 72,
                                'dewpoint': 66,
                                'windchill': 70,
                                'windgust': 11,
                                'feelslike': 70,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2018-03-26': {
                        'date': '2018-03-26',
                        'date_epoch': 1522022400,
                        'astro': {
                            'sunrise': '07:28 AM',
                            'sunset': '07:46 PM',
                            'moonrise': '02:58 PM',
                            'moonset': '04:03 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 63
                        },
                        'mintemp': 66,
                        'maxtemp': 82,
                        'avgtemp': 75,
                        'totalsnow': 0,
                        'sunhour': 10.2,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 82,
                                'wind_speed': 14,
                                'wind_degree': 168,
                                'wind_dir': 'SSE',
                                'weather_code': 263,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Patchy light drizzle'
                                ],
                                'precip': 0,
                                'humidity': 78,
                                'visibility': 6,
                                'pressure': 1011,
                                'cloudcover': 55,
                                'heatindex': 75,
                                'dewpoint': 64,
                                'windchill': 73,
                                'windgust': 19,
                                'feelslike': 75,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2018-03-27': {
                        'date': '2018-03-27',
                        'date_epoch': 1522108800,
                        'astro': {
                            'sunrise': '07:26 AM',
                            'sunset': '07:47 PM',
                            'moonrise': '04:03 PM',
                            'moonset': '04:54 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 71
                        },
                        'mintemp': 63,
                        'maxtemp': 77,
                        'avgtemp': 73,
                        'totalsnow': 0,
                        'sunhour': 8.9,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 11,
                                'wind_degree': 121,
                                'wind_dir': 'ESE',
                                'weather_code': 359,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0018_cloudy_with_heavy_rain.png'
                                ],
                                'weather_descriptions': [
                                    'Torrential rain shower'
                                ],
                                'precip': 0.6,
                                'humidity': 84,
                                'visibility': 5,
                                'pressure': 1013,
                                'cloudcover': 79,
                                'heatindex': 75,
                                'dewpoint': 66,
                                'windchill': 72,
                                'windgust': 16,
                                'feelslike': 75,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2018-03-28': {
                        'date': '2018-03-28',
                        'date_epoch': 1522195200,
                        'astro': {
                            'sunrise': '07:25 AM',
                            'sunset': '07:48 PM',
                            'moonrise': '05:07 PM',
                            'moonset': '05:41 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 78
                        },
                        'mintemp': 61,
                        'maxtemp': 72,
                        'avgtemp': 66,
                        'totalsnow': 0,
                        'sunhour': 7.5,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 72,
                                'wind_speed': 7,
                                'wind_degree': 114,
                                'wind_dir': 'ESE',
                                'weather_code': 356,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0010_heavy_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Moderate or heavy rain shower'
                                ],
                                'precip': 1.8,
                                'humidity': 91,
                                'visibility': 5,
                                'pressure': 1010,
                                'cloudcover': 88,
                                'heatindex': 66,
                                'dewpoint': 63,
                                'windchill': 66,
                                'windgust': 11,
                                'feelslike': 66,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2018-03-29': {
                        'date': '2018-03-29',
                        'date_epoch': 1522281600,
                        'astro': {
                            'sunrise': '07:24 AM',
                            'sunset': '07:48 PM',
                            'moonrise': '06:11 PM',
                            'moonset': '06:23 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 85
                        },
                        'mintemp': 55,
                        'maxtemp': 79,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 6,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 79,
                                'wind_speed': 7,
                                'wind_degree': 187,
                                'wind_dir': 'S',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 73,
                                'visibility': 6,
                                'pressure': 1012,
                                'cloudcover': 16,
                                'heatindex': 68,
                                'dewpoint': 55,
                                'windchill': 66,
                                'windgust': 11,
                                'feelslike': 66,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 6
                            }
                        ]
                    },
                    '2018-03-30': {
                        'date': '2018-03-30',
                        'date_epoch': 1522368000,
                        'astro': {
                            'sunrise': '07:23 AM',
                            'sunset': '07:49 PM',
                            'moonrise': '07:13 PM',
                            'moonset': '07:03 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 93
                        },
                        'mintemp': 54,
                        'maxtemp': 70,
                        'avgtemp': 63,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 70,
                                'wind_speed': 9,
                                'wind_degree': 58,
                                'wind_dir': 'ENE',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 70,
                                'visibility': 6,
                                'pressure': 1023,
                                'cloudcover': 6,
                                'heatindex': 63,
                                'dewpoint': 52,
                                'windchill': 61,
                                'windgust': 14,
                                'feelslike': 61,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2018-03-31': {
                        'date': '2018-03-31',
                        'date_epoch': 1522454400,
                        'astro': {
                            'sunrise': '07:22 AM',
                            'sunset': '07:49 PM',
                            'moonrise': '08:13 PM',
                            'moonset': '07:41 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 96
                        },
                        'mintemp': 55,
                        'maxtemp': 79,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 79,
                                'wind_speed': 12,
                                'wind_degree': 178,
                                'wind_dir': 'S',
                                'weather_code': 143,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0006_mist.png'
                                ],
                                'weather_descriptions': [
                                    'Mist'
                                ],
                                'precip': 0,
                                'humidity': 78,
                                'visibility': 6,
                                'pressure': 1019,
                                'cloudcover': 18,
                                'heatindex': 68,
                                'dewpoint': 59,
                                'windchill': 66,
                                'windgust': 18,
                                'feelslike': 66,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    }
                }
            };
            break;
        case 2019:
            object = {
                'request': {
                    'type': 'City',
                    'query': 'Austin, United States of America',
                    'language': 'en',
                    'unit': 'f'
                },
                'location': {
                    'name': 'Austin',
                    'country': 'United States of America',
                    'region': 'Texas',
                    'lat': '30.267',
                    'lon': '-97.743',
                    'timezone_id': 'America/Chicago',
                    'localtime': '2021-05-21 16:53',
                    'localtime_epoch': 1621615980,
                    'utc_offset': '-5.0'
                },
                'current': {
                    'observation_time': '09:53 PM',
                    'temperature': 86,
                    'weather_code': 116,
                    'weather_icons': [
                        'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                    ],
                    'weather_descriptions': [
                        'Partly cloudy'
                    ],
                    'wind_speed': 9,
                    'wind_degree': 140,
                    'wind_dir': 'SE',
                    'pressure': 1018,
                    'precip': 0,
                    'humidity': 52,
                    'cloudcover': 50,
                    'feelslike': 90,
                    'uv_index': 7,
                    'visibility': 10,
                    'is_day': 'yes'
                },
                'historical': {
                    '2019-03-01': {
                        'date': '2019-03-01',
                        'date_epoch': 1551398400,
                        'astro': {
                            'sunrise': '07:57 AM',
                            'sunset': '07:30 PM',
                            'moonrise': '04:48 AM',
                            'moonset': '03:21 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 26
                        },
                        'mintemp': 43,
                        'maxtemp': 63,
                        'avgtemp': 52,
                        'totalsnow': 0,
                        'sunhour': 8.7,
                        'uv_index': 3,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 63,
                                'wind_speed': 4,
                                'wind_degree': 88,
                                'wind_dir': 'E',
                                'weather_code': 122,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Overcast'
                                ],
                                'precip': 0,
                                'humidity': 71,
                                'visibility': 6,
                                'pressure': 1018,
                                'cloudcover': 71,
                                'heatindex': 50,
                                'dewpoint': 41,
                                'windchill': 48,
                                'windgust': 6,
                                'feelslike': 48,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 3
                            }
                        ]
                    },
                    '2019-03-02': {
                        'date': '2019-03-02',
                        'date_epoch': 1551484800,
                        'astro': {
                            'sunrise': '07:56 AM',
                            'sunset': '07:31 PM',
                            'moonrise': '05:35 AM',
                            'moonset': '04:12 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 19
                        },
                        'mintemp': 46,
                        'maxtemp': 50,
                        'avgtemp': 48,
                        'totalsnow': 0,
                        'sunhour': 5.9,
                        'uv_index': 2,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 50,
                                'wind_speed': 5,
                                'wind_degree': 43,
                                'wind_dir': 'NE',
                                'weather_code': 266,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0017_cloudy_with_light_rain.png'
                                ],
                                'weather_descriptions': [
                                    'Light drizzle'
                                ],
                                'precip': 0,
                                'humidity': 82,
                                'visibility': 4,
                                'pressure': 1018,
                                'cloudcover': 97,
                                'heatindex': 48,
                                'dewpoint': 45,
                                'windchill': 46,
                                'windgust': 8,
                                'feelslike': 46,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 2
                            }
                        ]
                    },
                    '2019-03-03': {
                        'date': '2019-03-03',
                        'date_epoch': 1551571200,
                        'astro': {
                            'sunrise': '07:55 AM',
                            'sunset': '07:31 PM',
                            'moonrise': '06:17 AM',
                            'moonset': '05:05 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 12
                        },
                        'mintemp': 37,
                        'maxtemp': 50,
                        'avgtemp': 46,
                        'totalsnow': 0,
                        'sunhour': 10.2,
                        'uv_index': 2,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 50,
                                'wind_speed': 9,
                                'wind_degree': 53,
                                'wind_dir': 'NE',
                                'weather_code': 266,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0017_cloudy_with_light_rain.png'
                                ],
                                'weather_descriptions': [
                                    'Light drizzle'
                                ],
                                'precip': 0,
                                'humidity': 73,
                                'visibility': 5,
                                'pressure': 1020,
                                'cloudcover': 58,
                                'heatindex': 45,
                                'dewpoint': 37,
                                'windchill': 39,
                                'windgust': 16,
                                'feelslike': 39,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 2
                            }
                        ]
                    },
                    '2019-03-04': {
                        'date': '2019-03-04',
                        'date_epoch': 1551657600,
                        'astro': {
                            'sunrise': '07:54 AM',
                            'sunset': '07:32 PM',
                            'moonrise': '06:57 AM',
                            'moonset': '05:58 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 4
                        },
                        'mintemp': 28,
                        'maxtemp': 41,
                        'avgtemp': 34,
                        'totalsnow': 0,
                        'sunhour': 8.7,
                        'uv_index': 1,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 41,
                                'wind_speed': 12,
                                'wind_degree': 17,
                                'wind_dir': 'NNE',
                                'weather_code': 119,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0003_white_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Cloudy'
                                ],
                                'precip': 0,
                                'humidity': 50,
                                'visibility': 6,
                                'pressure': 1028,
                                'cloudcover': 27,
                                'heatindex': 34,
                                'dewpoint': 16,
                                'windchill': 23,
                                'windgust': 16,
                                'feelslike': 23,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 1
                            }
                        ]
                    },
                    '2019-03-05': {
                        'date': '2019-03-05',
                        'date_epoch': 1551744000,
                        'astro': {
                            'sunrise': '07:53 AM',
                            'sunset': '07:33 PM',
                            'moonrise': '07:33 AM',
                            'moonset': '06:51 PM',
                            'moon_phase': 'New Moon',
                            'moon_illumination': 0
                        },
                        'mintemp': 28,
                        'maxtemp': 46,
                        'avgtemp': 37,
                        'totalsnow': 0,
                        'sunhour': 7.3,
                        'uv_index': 1,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 46,
                                'wind_speed': 8,
                                'wind_degree': 18,
                                'wind_dir': 'NNE',
                                'weather_code': 122,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Overcast'
                                ],
                                'precip': 0,
                                'humidity': 46,
                                'visibility': 6,
                                'pressure': 1032,
                                'cloudcover': 42,
                                'heatindex': 36,
                                'dewpoint': 16,
                                'windchill': 28,
                                'windgust': 12,
                                'feelslike': 28,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 1
                            }
                        ]
                    },
                    '2019-03-06': {
                        'date': '2019-03-06',
                        'date_epoch': 1551830400,
                        'astro': {
                            'sunrise': '07:52 AM',
                            'sunset': '07:34 PM',
                            'moonrise': '08:07 AM',
                            'moonset': '07:45 PM',
                            'moon_phase': 'New Moon',
                            'moon_illumination': 0
                        },
                        'mintemp': 30,
                        'maxtemp': 55,
                        'avgtemp': 46,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 3,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 55,
                                'wind_speed': 4,
                                'wind_degree': 100,
                                'wind_dir': 'E',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 49,
                                'visibility': 6,
                                'pressure': 1030,
                                'cloudcover': 9,
                                'heatindex': 43,
                                'dewpoint': 25,
                                'windchill': 39,
                                'windgust': 11,
                                'feelslike': 39,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 3
                            }
                        ]
                    },
                    '2019-03-07': {
                        'date': '2019-03-07',
                        'date_epoch': 1551916800,
                        'astro': {
                            'sunrise': '07:51 AM',
                            'sunset': '07:34 PM',
                            'moonrise': '08:39 AM',
                            'moonset': '08:38 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 3
                        },
                        'mintemp': 45,
                        'maxtemp': 70,
                        'avgtemp': 61,
                        'totalsnow': 0,
                        'sunhour': 10.2,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 70,
                                'wind_speed': 6,
                                'wind_degree': 187,
                                'wind_dir': 'S',
                                'weather_code': 122,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Overcast'
                                ],
                                'precip': 0,
                                'humidity': 84,
                                'visibility': 6,
                                'pressure': 1019,
                                'cloudcover': 64,
                                'heatindex': 57,
                                'dewpoint': 52,
                                'windchill': 55,
                                'windgust': 16,
                                'feelslike': 55,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2019-03-08': {
                        'date': '2019-03-08',
                        'date_epoch': 1552003200,
                        'astro': {
                            'sunrise': '07:50 AM',
                            'sunset': '07:35 PM',
                            'moonrise': '09:10 AM',
                            'moonset': '09:32 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 10
                        },
                        'mintemp': 61,
                        'maxtemp': 79,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 7.3,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 79,
                                'wind_speed': 7,
                                'wind_degree': 193,
                                'wind_dir': 'SSW',
                                'weather_code': 122,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Overcast'
                                ],
                                'precip': 0,
                                'humidity': 87,
                                'visibility': 6,
                                'pressure': 1012,
                                'cloudcover': 81,
                                'heatindex': 72,
                                'dewpoint': 64,
                                'windchill': 68,
                                'windgust': 18,
                                'feelslike': 68,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2019-03-09': {
                        'date': '2019-03-09',
                        'date_epoch': 1552089600,
                        'astro': {
                            'sunrise': '07:48 AM',
                            'sunset': '07:36 PM',
                            'moonrise': '09:42 AM',
                            'moonset': '10:26 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 17
                        },
                        'mintemp': 68,
                        'maxtemp': 84,
                        'avgtemp': 75,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 84,
                                'wind_speed': 9,
                                'wind_degree': 225,
                                'wind_dir': 'SW',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.1,
                                'humidity': 63,
                                'visibility': 4,
                                'pressure': 1009,
                                'cloudcover': 48,
                                'heatindex': 72,
                                'dewpoint': 57,
                                'windchill': 73,
                                'windgust': 16,
                                'feelslike': 72,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2019-03-10': {
                        'date': '2019-03-10',
                        'date_epoch': 1552176000,
                        'astro': {
                            'sunrise': '07:47 AM',
                            'sunset': '07:36 PM',
                            'moonrise': '10:15 AM',
                            'moonset': '11:22 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 24
                        },
                        'mintemp': 63,
                        'maxtemp': 77,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 7.4,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 6,
                                'wind_degree': 97,
                                'wind_dir': 'E',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.1,
                                'humidity': 81,
                                'visibility': 6,
                                'pressure': 1014,
                                'cloudcover': 67,
                                'heatindex': 70,
                                'dewpoint': 61,
                                'windchill': 68,
                                'windgust': 8,
                                'feelslike': 68,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2019-03-11': {
                        'date': '2019-03-11',
                        'date_epoch': 1552262400,
                        'astro': {
                            'sunrise': '07:46 AM',
                            'sunset': '07:37 PM',
                            'moonrise': '10:50 AM',
                            'moonset': 'No moonset',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 32
                        },
                        'mintemp': 57,
                        'maxtemp': 66,
                        'avgtemp': 63,
                        'totalsnow': 0,
                        'sunhour': 6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 66,
                                'wind_speed': 6,
                                'wind_degree': 24,
                                'wind_dir': 'NNE',
                                'weather_code': 266,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0017_cloudy_with_light_rain.png'
                                ],
                                'weather_descriptions': [
                                    'Light drizzle'
                                ],
                                'precip': 0.1,
                                'humidity': 85,
                                'visibility': 6,
                                'pressure': 1020,
                                'cloudcover': 100,
                                'heatindex': 61,
                                'dewpoint': 57,
                                'windchill': 61,
                                'windgust': 11,
                                'feelslike': 61,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2019-03-12': {
                        'date': '2019-03-12',
                        'date_epoch': 1552348800,
                        'astro': {
                            'sunrise': '07:45 AM',
                            'sunset': '07:38 PM',
                            'moonrise': '11:29 AM',
                            'moonset': '12:19 AM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 39
                        },
                        'mintemp': 57,
                        'maxtemp': 77,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 8.8,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 9,
                                'wind_degree': 110,
                                'wind_dir': 'ESE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.1,
                                'humidity': 85,
                                'visibility': 4,
                                'pressure': 1016,
                                'cloudcover': 86,
                                'heatindex': 68,
                                'dewpoint': 61,
                                'windchill': 66,
                                'windgust': 16,
                                'feelslike': 66,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2019-03-13': {
                        'date': '2019-03-13',
                        'date_epoch': 1552435200,
                        'astro': {
                            'sunrise': '07:44 AM',
                            'sunset': '07:38 PM',
                            'moonrise': '12:12 PM',
                            'moonset': '01:18 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 46
                        },
                        'mintemp': 64,
                        'maxtemp': 81,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 81,
                                'wind_speed': 6,
                                'wind_degree': 204,
                                'wind_dir': 'SSW',
                                'weather_code': 299,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0010_heavy_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Moderate rain at times'
                                ],
                                'precip': 0.4,
                                'humidity': 64,
                                'visibility': 5,
                                'pressure': 1005,
                                'cloudcover': 40,
                                'heatindex': 72,
                                'dewpoint': 57,
                                'windchill': 72,
                                'windgust': 23,
                                'feelslike': 72,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2019-03-14': {
                        'date': '2019-03-14',
                        'date_epoch': 1552521600,
                        'astro': {
                            'sunrise': '07:43 AM',
                            'sunset': '07:39 PM',
                            'moonrise': '01:02 PM',
                            'moonset': '02:18 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 54
                        },
                        'mintemp': 57,
                        'maxtemp': 72,
                        'avgtemp': 64,
                        'totalsnow': 0,
                        'sunhour': 8.8,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 72,
                                'wind_speed': 11,
                                'wind_degree': 230,
                                'wind_dir': 'SW',
                                'weather_code': 119,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0003_white_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Cloudy'
                                ],
                                'precip': 0,
                                'humidity': 50,
                                'visibility': 6,
                                'pressure': 1014,
                                'cloudcover': 45,
                                'heatindex': 64,
                                'dewpoint': 45,
                                'windchill': 64,
                                'windgust': 16,
                                'feelslike': 64,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2019-03-15': {
                        'date': '2019-03-15',
                        'date_epoch': 1552608000,
                        'astro': {
                            'sunrise': '07:41 AM',
                            'sunset': '07:39 PM',
                            'moonrise': '01:58 PM',
                            'moonset': '03:19 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 61
                        },
                        'mintemp': 48,
                        'maxtemp': 57,
                        'avgtemp': 54,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 3,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 57,
                                'wind_speed': 13,
                                'wind_degree': 23,
                                'wind_dir': 'NNE',
                                'weather_code': 119,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0003_white_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Cloudy'
                                ],
                                'precip': 0,
                                'humidity': 44,
                                'visibility': 6,
                                'pressure': 1027,
                                'cloudcover': 33,
                                'heatindex': 52,
                                'dewpoint': 30,
                                'windchill': 48,
                                'windgust': 17,
                                'feelslike': 48,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 3
                            }
                        ]
                    },
                    '2019-03-16': {
                        'date': '2019-03-16',
                        'date_epoch': 1552694400,
                        'astro': {
                            'sunrise': '07:40 AM',
                            'sunset': '07:40 PM',
                            'moonrise': '03:00 PM',
                            'moonset': '04:17 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 68
                        },
                        'mintemp': 43,
                        'maxtemp': 61,
                        'avgtemp': 54,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 61,
                                'wind_speed': 8,
                                'wind_degree': 44,
                                'wind_dir': 'NE',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 43,
                                'visibility': 6,
                                'pressure': 1028,
                                'cloudcover': 19,
                                'heatindex': 52,
                                'dewpoint': 28,
                                'windchill': 48,
                                'windgust': 11,
                                'feelslike': 48,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2019-03-17': {
                        'date': '2019-03-17',
                        'date_epoch': 1552780800,
                        'astro': {
                            'sunrise': '07:39 AM',
                            'sunset': '07:41 PM',
                            'moonrise': '04:07 PM',
                            'moonset': '05:13 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 75
                        },
                        'mintemp': 43,
                        'maxtemp': 64,
                        'avgtemp': 57,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 64,
                                'wind_speed': 7,
                                'wind_degree': 49,
                                'wind_dir': 'NE',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 46,
                                'visibility': 6,
                                'pressure': 1026,
                                'cloudcover': 10,
                                'heatindex': 54,
                                'dewpoint': 32,
                                'windchill': 52,
                                'windgust': 9,
                                'feelslike': 52,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2019-03-18': {
                        'date': '2019-03-18',
                        'date_epoch': 1552867200,
                        'astro': {
                            'sunrise': '07:38 AM',
                            'sunset': '07:41 PM',
                            'moonrise': '05:16 PM',
                            'moonset': '06:04 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 83
                        },
                        'mintemp': 46,
                        'maxtemp': 68,
                        'avgtemp': 61,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 68,
                                'wind_speed': 7,
                                'wind_degree': 73,
                                'wind_dir': 'ENE',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 48,
                                'visibility': 6,
                                'pressure': 1024,
                                'cloudcover': 15,
                                'heatindex': 57,
                                'dewpoint': 36,
                                'windchill': 55,
                                'windgust': 9,
                                'feelslike': 55,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2019-03-19': {
                        'date': '2019-03-19',
                        'date_epoch': 1552953600,
                        'astro': {
                            'sunrise': '07:37 AM',
                            'sunset': '07:42 PM',
                            'moonrise': '06:25 PM',
                            'moonset': '06:50 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 90
                        },
                        'mintemp': 46,
                        'maxtemp': 70,
                        'avgtemp': 61,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 70,
                                'wind_speed': 6,
                                'wind_degree': 151,
                                'wind_dir': 'SSE',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 53,
                                'visibility': 6,
                                'pressure': 1024,
                                'cloudcover': 23,
                                'heatindex': 57,
                                'dewpoint': 41,
                                'windchill': 57,
                                'windgust': 9,
                                'feelslike': 57,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2019-03-20': {
                        'date': '2019-03-20',
                        'date_epoch': 1553040000,
                        'astro': {
                            'sunrise': '07:35 AM',
                            'sunset': '07:43 PM',
                            'moonrise': '07:34 PM',
                            'moonset': '07:33 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 97
                        },
                        'mintemp': 50,
                        'maxtemp': 72,
                        'avgtemp': 63,
                        'totalsnow': 0,
                        'sunhour': 8.8,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 72,
                                'wind_speed': 4,
                                'wind_degree': 158,
                                'wind_dir': 'SSE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0,
                                'humidity': 72,
                                'visibility': 6,
                                'pressure': 1023,
                                'cloudcover': 55,
                                'heatindex': 59,
                                'dewpoint': 50,
                                'windchill': 59,
                                'windgust': 6,
                                'feelslike': 59,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2019-03-21': {
                        'date': '2019-03-21',
                        'date_epoch': 1553126400,
                        'astro': {
                            'sunrise': '07:34 AM',
                            'sunset': '07:43 PM',
                            'moonrise': '08:41 PM',
                            'moonset': '08:13 AM',
                            'moon_phase': 'Full Moon',
                            'moon_illumination': 100
                        },
                        'mintemp': 50,
                        'maxtemp': 79,
                        'avgtemp': 68,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 79,
                                'wind_speed': 4,
                                'wind_degree': 127,
                                'wind_dir': 'SE',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 53,
                                'visibility': 6,
                                'pressure': 1023,
                                'cloudcover': 19,
                                'heatindex': 64,
                                'dewpoint': 45,
                                'windchill': 63,
                                'windgust': 6,
                                'feelslike': 63,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2019-03-22': {
                        'date': '2019-03-22',
                        'date_epoch': 1553212800,
                        'astro': {
                            'sunrise': '07:33 AM',
                            'sunset': '07:44 PM',
                            'moonrise': '09:47 PM',
                            'moonset': '08:52 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 88
                        },
                        'mintemp': 54,
                        'maxtemp': 77,
                        'avgtemp': 68,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 6,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 8,
                                'wind_degree': 160,
                                'wind_dir': 'SSE',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 61,
                                'visibility': 6,
                                'pressure': 1019,
                                'cloudcover': 20,
                                'heatindex': 66,
                                'dewpoint': 50,
                                'windchill': 64,
                                'windgust': 12,
                                'feelslike': 64,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 6
                            }
                        ]
                    },
                    '2019-03-23': {
                        'date': '2019-03-23',
                        'date_epoch': 1553299200,
                        'astro': {
                            'sunrise': '07:32 AM',
                            'sunset': '07:44 PM',
                            'moonrise': '10:50 PM',
                            'moonset': '09:32 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 81
                        },
                        'mintemp': 59,
                        'maxtemp': 72,
                        'avgtemp': 64,
                        'totalsnow': 0,
                        'sunhour': 6.1,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 72,
                                'wind_speed': 9,
                                'wind_degree': 172,
                                'wind_dir': 'S',
                                'weather_code': 356,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0010_heavy_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Moderate or heavy rain shower'
                                ],
                                'precip': 0.3,
                                'humidity': 81,
                                'visibility': 6,
                                'pressure': 1017,
                                'cloudcover': 80,
                                'heatindex': 64,
                                'dewpoint': 57,
                                'windchill': 63,
                                'windgust': 14,
                                'feelslike': 63,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2019-03-24': {
                        'date': '2019-03-24',
                        'date_epoch': 1553385600,
                        'astro': {
                            'sunrise': '07:30 AM',
                            'sunset': '07:45 PM',
                            'moonrise': '11:53 PM',
                            'moonset': '10:11 AM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 74
                        },
                        'mintemp': 63,
                        'maxtemp': 77,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 7.5,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 10,
                                'wind_degree': 184,
                                'wind_dir': 'S',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0,
                                'humidity': 85,
                                'visibility': 6,
                                'pressure': 1017,
                                'cloudcover': 71,
                                'heatindex': 70,
                                'dewpoint': 64,
                                'windchill': 68,
                                'windgust': 14,
                                'feelslike': 68,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2019-03-25': {
                        'date': '2019-03-25',
                        'date_epoch': 1553472000,
                        'astro': {
                            'sunrise': '07:29 AM',
                            'sunset': '07:46 PM',
                            'moonrise': 'No moonrise',
                            'moonset': '10:53 AM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 66
                        },
                        'mintemp': 63,
                        'maxtemp': 77,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 7.5,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 8,
                                'wind_degree': 139,
                                'wind_dir': 'SE',
                                'weather_code': 266,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0017_cloudy_with_light_rain.png'
                                ],
                                'weather_descriptions': [
                                    'Light drizzle'
                                ],
                                'precip': 0,
                                'humidity': 79,
                                'visibility': 4,
                                'pressure': 1019,
                                'cloudcover': 60,
                                'heatindex': 70,
                                'dewpoint': 61,
                                'windchill': 68,
                                'windgust': 12,
                                'feelslike': 70,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2019-03-26': {
                        'date': '2019-03-26',
                        'date_epoch': 1553558400,
                        'astro': {
                            'sunrise': '07:28 AM',
                            'sunset': '07:46 PM',
                            'moonrise': '12:53 AM',
                            'moonset': '11:38 AM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 59
                        },
                        'mintemp': 54,
                        'maxtemp': 75,
                        'avgtemp': 66,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 75,
                                'wind_speed': 9,
                                'wind_degree': 58,
                                'wind_dir': 'ENE',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 66,
                                'visibility': 6,
                                'pressure': 1025,
                                'cloudcover': 8,
                                'heatindex': 64,
                                'dewpoint': 52,
                                'windchill': 63,
                                'windgust': 13,
                                'feelslike': 63,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2019-03-27': {
                        'date': '2019-03-27',
                        'date_epoch': 1553644800,
                        'astro': {
                            'sunrise': '07:27 AM',
                            'sunset': '07:47 PM',
                            'moonrise': '01:50 AM',
                            'moonset': '12:25 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 52
                        },
                        'mintemp': 54,
                        'maxtemp': 75,
                        'avgtemp': 66,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 75,
                                'wind_speed': 9,
                                'wind_degree': 133,
                                'wind_dir': 'SE',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 72,
                                'visibility': 6,
                                'pressure': 1024,
                                'cloudcover': 12,
                                'heatindex': 64,
                                'dewpoint': 54,
                                'windchill': 63,
                                'windgust': 12,
                                'feelslike': 63,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2019-03-28': {
                        'date': '2019-03-28',
                        'date_epoch': 1553731200,
                        'astro': {
                            'sunrise': '07:26 AM',
                            'sunset': '07:48 PM',
                            'moonrise': '02:43 AM',
                            'moonset': '01:15 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 45
                        },
                        'mintemp': 54,
                        'maxtemp': 77,
                        'avgtemp': 68,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 12,
                                'wind_degree': 168,
                                'wind_dir': 'SSE',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 74,
                                'visibility': 6,
                                'pressure': 1020,
                                'cloudcover': 19,
                                'heatindex': 66,
                                'dewpoint': 55,
                                'windchill': 64,
                                'windgust': 17,
                                'feelslike': 64,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2019-03-29': {
                        'date': '2019-03-29',
                        'date_epoch': 1553817600,
                        'astro': {
                            'sunrise': '07:24 AM',
                            'sunset': '07:48 PM',
                            'moonrise': '03:32 AM',
                            'moonset': '02:06 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 37
                        },
                        'mintemp': 59,
                        'maxtemp': 72,
                        'avgtemp': 68,
                        'totalsnow': 0,
                        'sunhour': 6.1,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 72,
                                'wind_speed': 13,
                                'wind_degree': 174,
                                'wind_dir': 'S',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.1,
                                'humidity': 84,
                                'visibility': 6,
                                'pressure': 1014,
                                'cloudcover': 72,
                                'heatindex': 68,
                                'dewpoint': 61,
                                'windchill': 66,
                                'windgust': 17,
                                'feelslike': 66,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2019-03-30': {
                        'date': '2019-03-30',
                        'date_epoch': 1553904000,
                        'astro': {
                            'sunrise': '07:23 AM',
                            'sunset': '07:49 PM',
                            'moonrise': '04:16 AM',
                            'moonset': '02:58 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 30
                        },
                        'mintemp': 52,
                        'maxtemp': 68,
                        'avgtemp': 63,
                        'totalsnow': 0,
                        'sunhour': 8.9,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 68,
                                'wind_speed': 12,
                                'wind_degree': 136,
                                'wind_dir': 'SE',
                                'weather_code': 263,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Patchy light drizzle'
                                ],
                                'precip': 0,
                                'humidity': 75,
                                'visibility': 6,
                                'pressure': 1016,
                                'cloudcover': 52,
                                'heatindex': 61,
                                'dewpoint': 52,
                                'windchill': 59,
                                'windgust': 18,
                                'feelslike': 59,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2019-03-31': {
                        'date': '2019-03-31',
                        'date_epoch': 1553990400,
                        'astro': {
                            'sunrise': '07:22 AM',
                            'sunset': '07:49 PM',
                            'moonrise': '04:57 AM',
                            'moonset': '03:52 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 26
                        },
                        'mintemp': 43,
                        'maxtemp': 55,
                        'avgtemp': 50,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 55,
                                'wind_speed': 14,
                                'wind_degree': 24,
                                'wind_dir': 'NNE',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 51,
                                'visibility': 6,
                                'pressure': 1026,
                                'cloudcover': 23,
                                'heatindex': 50,
                                'dewpoint': 32,
                                'windchill': 45,
                                'windgust': 19,
                                'feelslike': 45,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    }
                }
            }
            break;
        case 2020:
            object = {
                'request': {
                    'type': 'City',
                    'query': 'Austin, United States of America',
                    'language': 'en',
                    'unit': 'f'
                },
                'location': {
                    'name': 'Austin',
                    'country': 'United States of America',
                    'region': 'Texas',
                    'lat': '30.267',
                    'lon': '-97.743',
                    'timezone_id': 'America/Chicago',
                    'localtime': '2021-05-21 16:53',
                    'localtime_epoch': 1621615980,
                    'utc_offset': '-5.0'
                },
                'current': {
                    'observation_time': '09:53 PM',
                    'temperature': 86,
                    'weather_code': 116,
                    'weather_icons': [
                        'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                    ],
                    'weather_descriptions': [
                        'Partly cloudy'
                    ],
                    'wind_speed': 9,
                    'wind_degree': 140,
                    'wind_dir': 'SE',
                    'pressure': 1018,
                    'precip': 0,
                    'humidity': 52,
                    'cloudcover': 50,
                    'feelslike': 90,
                    'uv_index': 7,
                    'visibility': 10,
                    'is_day': 'yes'
                },
                'historical': {
                    '2020-03-01': {
                        'date': '2020-03-01',
                        'date_epoch': 1583020800,
                        'astro': {
                            'sunrise': '07:57 AM',
                            'sunset': '07:31 PM',
                            'moonrise': '12:00 PM',
                            'moonset': '12:56 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 44
                        },
                        'mintemp': 59,
                        'maxtemp': 73,
                        'avgtemp': 66,
                        'totalsnow': 0,
                        'sunhour': 8.7,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 73,
                                'wind_speed': 15,
                                'wind_degree': 189,
                                'wind_dir': 'S',
                                'weather_code': 122,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Overcast'
                                ],
                                'precip': 0,
                                'humidity': 74,
                                'visibility': 6,
                                'pressure': 1014,
                                'cloudcover': 49,
                                'heatindex': 66,
                                'dewpoint': 55,
                                'windchill': 64,
                                'windgust': 21,
                                'feelslike': 64,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2020-03-02': {
                        'date': '2020-03-02',
                        'date_epoch': 1583107200,
                        'astro': {
                            'sunrise': '07:55 AM',
                            'sunset': '07:31 PM',
                            'moonrise': '12:39 PM',
                            'moonset': '01:52 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 51
                        },
                        'mintemp': 63,
                        'maxtemp': 72,
                        'avgtemp': 68,
                        'totalsnow': 0,
                        'sunhour': 5.9,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 72,
                                'wind_speed': 7,
                                'wind_degree': 170,
                                'wind_dir': 'S',
                                'weather_code': 176,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Patchy rain possible'
                                ],
                                'precip': 0,
                                'humidity': 88,
                                'visibility': 5,
                                'pressure': 1009,
                                'cloudcover': 88,
                                'heatindex': 68,
                                'dewpoint': 63,
                                'windchill': 66,
                                'windgust': 10,
                                'feelslike': 66,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2020-03-03': {
                        'date': '2020-03-03',
                        'date_epoch': 1583193600,
                        'astro': {
                            'sunrise': '07:54 AM',
                            'sunset': '07:32 PM',
                            'moonrise': '01:25 PM',
                            'moonset': '02:49 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 58
                        },
                        'mintemp': 59,
                        'maxtemp': 72,
                        'avgtemp': 68,
                        'totalsnow': 0,
                        'sunhour': 8.7,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 72,
                                'wind_speed': 7,
                                'wind_degree': 154,
                                'wind_dir': 'SSE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.2,
                                'humidity': 85,
                                'visibility': 6,
                                'pressure': 1008,
                                'cloudcover': 60,
                                'heatindex': 68,
                                'dewpoint': 63,
                                'windchill': 66,
                                'windgust': 11,
                                'feelslike': 66,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2020-03-04': {
                        'date': '2020-03-04',
                        'date_epoch': 1583280000,
                        'astro': {
                            'sunrise': '07:53 AM',
                            'sunset': '07:33 PM',
                            'moonrise': '02:16 PM',
                            'moonset': '03:48 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 65
                        },
                        'mintemp': 61,
                        'maxtemp': 72,
                        'avgtemp': 68,
                        'totalsnow': 0,
                        'sunhour': 5.9,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 72,
                                'wind_speed': 9,
                                'wind_degree': 183,
                                'wind_dir': 'S',
                                'weather_code': 356,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0010_heavy_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Moderate or heavy rain shower'
                                ],
                                'precip': 0.6,
                                'humidity': 80,
                                'visibility': 6,
                                'pressure': 1008,
                                'cloudcover': 90,
                                'heatindex': 68,
                                'dewpoint': 59,
                                'windchill': 66,
                                'windgust': 14,
                                'feelslike': 66,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2020-03-05': {
                        'date': '2020-03-05',
                        'date_epoch': 1583366400,
                        'astro': {
                            'sunrise': '07:52 AM',
                            'sunset': '07:33 PM',
                            'moonrise': '03:16 PM',
                            'moonset': '04:45 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 73
                        },
                        'mintemp': 50,
                        'maxtemp': 68,
                        'avgtemp': 61,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 68,
                                'wind_speed': 11,
                                'wind_degree': 155,
                                'wind_dir': 'SSE',
                                'weather_code': 119,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0003_white_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Cloudy'
                                ],
                                'precip': 0,
                                'humidity': 58,
                                'visibility': 6,
                                'pressure': 1022,
                                'cloudcover': 38,
                                'heatindex': 59,
                                'dewpoint': 43,
                                'windchill': 55,
                                'windgust': 14,
                                'feelslike': 55,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2020-03-06': {
                        'date': '2020-03-06',
                        'date_epoch': 1583452800,
                        'astro': {
                            'sunrise': '07:51 AM',
                            'sunset': '07:34 PM',
                            'moonrise': '04:20 PM',
                            'moonset': '05:41 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 80
                        },
                        'mintemp': 54,
                        'maxtemp': 68,
                        'avgtemp': 61,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 68,
                                'wind_speed': 6,
                                'wind_degree': 47,
                                'wind_dir': 'NE',
                                'weather_code': 122,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Overcast'
                                ],
                                'precip': 0,
                                'humidity': 46,
                                'visibility': 6,
                                'pressure': 1030,
                                'cloudcover': 32,
                                'heatindex': 61,
                                'dewpoint': 39,
                                'windchill': 59,
                                'windgust': 9,
                                'feelslike': 59,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2020-03-07': {
                        'date': '2020-03-07',
                        'date_epoch': 1583539200,
                        'astro': {
                            'sunrise': '07:50 AM',
                            'sunset': '07:35 PM',
                            'moonrise': '05:29 PM',
                            'moonset': '06:31 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 87
                        },
                        'mintemp': 50,
                        'maxtemp': 59,
                        'avgtemp': 55,
                        'totalsnow': 0,
                        'sunhour': 10.2,
                        'uv_index': 3,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 59,
                                'wind_speed': 7,
                                'wind_degree': 121,
                                'wind_dir': 'ESE',
                                'weather_code': 119,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0003_white_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Cloudy'
                                ],
                                'precip': 0,
                                'humidity': 53,
                                'visibility': 6,
                                'pressure': 1029,
                                'cloudcover': 38,
                                'heatindex': 55,
                                'dewpoint': 37,
                                'windchill': 54,
                                'windgust': 11,
                                'feelslike': 54,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 3
                            }
                        ]
                    },
                    '2020-03-08': {
                        'date': '2020-03-08',
                        'date_epoch': 1583625600,
                        'astro': {
                            'sunrise': '07:49 AM',
                            'sunset': '07:35 PM',
                            'moonrise': '06:39 PM',
                            'moonset': '07:18 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 95
                        },
                        'mintemp': 50,
                        'maxtemp': 64,
                        'avgtemp': 57,
                        'totalsnow': 0,
                        'sunhour': 5.9,
                        'uv_index': 3,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 64,
                                'wind_speed': 10,
                                'wind_degree': 150,
                                'wind_dir': 'SSE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0,
                                'humidity': 81,
                                'visibility': 6,
                                'pressure': 1024,
                                'cloudcover': 94,
                                'heatindex': 57,
                                'dewpoint': 52,
                                'windchill': 55,
                                'windgust': 14,
                                'feelslike': 55,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 3
                            }
                        ]
                    },
                    '2020-03-09': {
                        'date': '2020-03-09',
                        'date_epoch': 1583712000,
                        'astro': {
                            'sunrise': '07:48 AM',
                            'sunset': '07:36 PM',
                            'moonrise': '07:49 PM',
                            'moonset': '08:01 AM',
                            'moon_phase': 'Full Moon',
                            'moon_illumination': 100
                        },
                        'mintemp': 59,
                        'maxtemp': 70,
                        'avgtemp': 64,
                        'totalsnow': 0,
                        'sunhour': 5.9,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 70,
                                'wind_speed': 10,
                                'wind_degree': 176,
                                'wind_dir': 'S',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0,
                                'humidity': 84,
                                'visibility': 6,
                                'pressure': 1022,
                                'cloudcover': 82,
                                'heatindex': 64,
                                'dewpoint': 59,
                                'windchill': 64,
                                'windgust': 14,
                                'feelslike': 64,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2020-03-10': {
                        'date': '2020-03-10',
                        'date_epoch': 1583798400,
                        'astro': {
                            'sunrise': '07:46 AM',
                            'sunset': '07:37 PM',
                            'moonrise': '08:59 PM',
                            'moonset': '08:40 AM',
                            'moon_phase': 'Full Moon',
                            'moon_illumination': 100
                        },
                        'mintemp': 61,
                        'maxtemp': 77,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 10.2,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 8,
                                'wind_degree': 182,
                                'wind_dir': 'S',
                                'weather_code': 119,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0003_white_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Cloudy'
                                ],
                                'precip': 0,
                                'humidity': 80,
                                'visibility': 6,
                                'pressure': 1022,
                                'cloudcover': 42,
                                'heatindex': 70,
                                'dewpoint': 63,
                                'windchill': 68,
                                'windgust': 11,
                                'feelslike': 68,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2020-03-11': {
                        'date': '2020-03-11',
                        'date_epoch': 1583884800,
                        'astro': {
                            'sunrise': '07:45 AM',
                            'sunset': '07:37 PM',
                            'moonrise': '10:07 PM',
                            'moonset': '09:20 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 84
                        },
                        'mintemp': 64,
                        'maxtemp': 82,
                        'avgtemp': 73,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 82,
                                'wind_speed': 10,
                                'wind_degree': 191,
                                'wind_dir': 'SSW',
                                'weather_code': 176,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Patchy rain possible'
                                ],
                                'precip': 0.1,
                                'humidity': 76,
                                'visibility': 6,
                                'pressure': 1017,
                                'cloudcover': 57,
                                'heatindex': 73,
                                'dewpoint': 63,
                                'windchill': 72,
                                'windgust': 14,
                                'feelslike': 73,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2020-03-12': {
                        'date': '2020-03-12',
                        'date_epoch': 1583971200,
                        'astro': {
                            'sunrise': '07:44 AM',
                            'sunset': '07:38 PM',
                            'moonrise': '11:15 PM',
                            'moonset': '09:58 AM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 76
                        },
                        'mintemp': 63,
                        'maxtemp': 81,
                        'avgtemp': 73,
                        'totalsnow': 0,
                        'sunhour': 8.8,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 81,
                                'wind_speed': 11,
                                'wind_degree': 192,
                                'wind_dir': 'SSW',
                                'weather_code': 122,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Overcast'
                                ],
                                'precip': 0,
                                'humidity': 76,
                                'visibility': 6,
                                'pressure': 1012,
                                'cloudcover': 61,
                                'heatindex': 73,
                                'dewpoint': 63,
                                'windchill': 72,
                                'windgust': 14,
                                'feelslike': 73,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2020-03-13': {
                        'date': '2020-03-13',
                        'date_epoch': 1584057600,
                        'astro': {
                            'sunrise': '07:43 AM',
                            'sunset': '07:39 PM',
                            'moonrise': 'No moonrise',
                            'moonset': '10:38 AM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 69
                        },
                        'mintemp': 66,
                        'maxtemp': 73,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 73,
                                'wind_speed': 9,
                                'wind_degree': 159,
                                'wind_dir': 'SSE',
                                'weather_code': 176,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Patchy rain possible'
                                ],
                                'precip': 0,
                                'humidity': 82,
                                'visibility': 6,
                                'pressure': 1014,
                                'cloudcover': 85,
                                'heatindex': 72,
                                'dewpoint': 64,
                                'windchill': 70,
                                'windgust': 12,
                                'feelslike': 70,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2020-03-14': {
                        'date': '2020-03-14',
                        'date_epoch': 1584144000,
                        'astro': {
                            'sunrise': '07:42 AM',
                            'sunset': '07:39 PM',
                            'moonrise': '12:22 AM',
                            'moonset': '11:21 AM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 62
                        },
                        'mintemp': 68,
                        'maxtemp': 75,
                        'avgtemp': 73,
                        'totalsnow': 0,
                        'sunhour': 6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 75,
                                'wind_speed': 9,
                                'wind_degree': 165,
                                'wind_dir': 'SSE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.1,
                                'humidity': 84,
                                'visibility': 6,
                                'pressure': 1018,
                                'cloudcover': 80,
                                'heatindex': 73,
                                'dewpoint': 66,
                                'windchill': 72,
                                'windgust': 12,
                                'feelslike': 73,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2020-03-15': {
                        'date': '2020-03-15',
                        'date_epoch': 1584230400,
                        'astro': {
                            'sunrise': '07:40 AM',
                            'sunset': '07:40 PM',
                            'moonrise': '01:27 AM',
                            'moonset': '12:07 PM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 55
                        },
                        'mintemp': 68,
                        'maxtemp': 75,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 75,
                                'wind_speed': 7,
                                'wind_degree': 157,
                                'wind_dir': 'SSE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.1,
                                'humidity': 84,
                                'visibility': 6,
                                'pressure': 1021,
                                'cloudcover': 90,
                                'heatindex': 73,
                                'dewpoint': 66,
                                'windchill': 70,
                                'windgust': 11,
                                'feelslike': 73,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2020-03-16': {
                        'date': '2020-03-16',
                        'date_epoch': 1584316800,
                        'astro': {
                            'sunrise': '07:39 AM',
                            'sunset': '07:41 PM',
                            'moonrise': '02:29 AM',
                            'moonset': '12:57 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 47
                        },
                        'mintemp': 66,
                        'maxtemp': 77,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 9,
                                'wind_degree': 156,
                                'wind_dir': 'SSE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0,
                                'humidity': 80,
                                'visibility': 6,
                                'pressure': 1019,
                                'cloudcover': 85,
                                'heatindex': 73,
                                'dewpoint': 64,
                                'windchill': 72,
                                'windgust': 12,
                                'feelslike': 73,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2020-03-17': {
                        'date': '2020-03-17',
                        'date_epoch': 1584403200,
                        'astro': {
                            'sunrise': '07:38 AM',
                            'sunset': '07:41 PM',
                            'moonrise': '03:27 AM',
                            'moonset': '01:50 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 40
                        },
                        'mintemp': 66,
                        'maxtemp': 79,
                        'avgtemp': 73,
                        'totalsnow': 0,
                        'sunhour': 8.8,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 79,
                                'wind_speed': 10,
                                'wind_degree': 157,
                                'wind_dir': 'SSE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.1,
                                'humidity': 82,
                                'visibility': 6,
                                'pressure': 1017,
                                'cloudcover': 79,
                                'heatindex': 73,
                                'dewpoint': 64,
                                'windchill': 72,
                                'windgust': 13,
                                'feelslike': 73,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2020-03-18': {
                        'date': '2020-03-18',
                        'date_epoch': 1584489600,
                        'astro': {
                            'sunrise': '07:37 AM',
                            'sunset': '07:42 PM',
                            'moonrise': '04:19 AM',
                            'moonset': '02:45 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 33
                        },
                        'mintemp': 68,
                        'maxtemp': 81,
                        'avgtemp': 75,
                        'totalsnow': 0,
                        'sunhour': 6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 81,
                                'wind_speed': 13,
                                'wind_degree': 170,
                                'wind_dir': 'S',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0,
                                'humidity': 79,
                                'visibility': 6,
                                'pressure': 1015,
                                'cloudcover': 90,
                                'heatindex': 75,
                                'dewpoint': 66,
                                'windchill': 73,
                                'windgust': 16,
                                'feelslike': 75,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2020-03-19': {
                        'date': '2020-03-19',
                        'date_epoch': 1584576000,
                        'astro': {
                            'sunrise': '07:36 AM',
                            'sunset': '07:42 PM',
                            'moonrise': '05:05 AM',
                            'moonset': '03:41 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 25
                        },
                        'mintemp': 70,
                        'maxtemp': 75,
                        'avgtemp': 73,
                        'totalsnow': 0,
                        'sunhour': 6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 75,
                                'wind_speed': 11,
                                'wind_degree': 178,
                                'wind_dir': 'S',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.1,
                                'humidity': 80,
                                'visibility': 6,
                                'pressure': 1014,
                                'cloudcover': 79,
                                'heatindex': 75,
                                'dewpoint': 66,
                                'windchill': 73,
                                'windgust': 16,
                                'feelslike': 75,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2020-03-20': {
                        'date': '2020-03-20',
                        'date_epoch': 1584662400,
                        'astro': {
                            'sunrise': '07:34 AM',
                            'sunset': '07:43 PM',
                            'moonrise': '05:47 AM',
                            'moonset': '04:36 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 18
                        },
                        'mintemp': 57,
                        'maxtemp': 68,
                        'avgtemp': 63,
                        'totalsnow': 0,
                        'sunhour': 6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 68,
                                'wind_speed': 11,
                                'wind_degree': 142,
                                'wind_dir': 'SE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.2,
                                'humidity': 78,
                                'visibility': 6,
                                'pressure': 1021,
                                'cloudcover': 90,
                                'heatindex': 64,
                                'dewpoint': 57,
                                'windchill': 63,
                                'windgust': 14,
                                'feelslike': 63,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2020-03-21': {
                        'date': '2020-03-21',
                        'date_epoch': 1584748800,
                        'astro': {
                            'sunrise': '07:33 AM',
                            'sunset': '07:44 PM',
                            'moonrise': '06:23 AM',
                            'moonset': '05:32 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 11
                        },
                        'mintemp': 45,
                        'maxtemp': 57,
                        'avgtemp': 55,
                        'totalsnow': 0,
                        'sunhour': 6.1,
                        'uv_index': 3,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 57,
                                'wind_speed': 10,
                                'wind_degree': 27,
                                'wind_dir': 'NNE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.3,
                                'humidity': 83,
                                'visibility': 6,
                                'pressure': 1024,
                                'cloudcover': 97,
                                'heatindex': 57,
                                'dewpoint': 54,
                                'windchill': 54,
                                'windgust': 12,
                                'feelslike': 54,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 3
                            }
                        ]
                    },
                    '2020-03-22': {
                        'date': '2020-03-22',
                        'date_epoch': 1584835200,
                        'astro': {
                            'sunrise': '07:32 AM',
                            'sunset': '07:44 PM',
                            'moonrise': '06:56 AM',
                            'moonset': '06:25 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 4
                        },
                        'mintemp': 52,
                        'maxtemp': 75,
                        'avgtemp': 68,
                        'totalsnow': 0,
                        'sunhour': 6.1,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 75,
                                'wind_speed': 3,
                                'wind_degree': 163,
                                'wind_dir': 'SSE',
                                'weather_code': 296,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0017_cloudy_with_light_rain.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain'
                                ],
                                'precip': 0.2,
                                'humidity': 91,
                                'visibility': 4,
                                'pressure': 1018,
                                'cloudcover': 96,
                                'heatindex': 68,
                                'dewpoint': 64,
                                'windchill': 66,
                                'windgust': 5,
                                'feelslike': 66,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2020-03-23': {
                        'date': '2020-03-23',
                        'date_epoch': 1584921600,
                        'astro': {
                            'sunrise': '07:31 AM',
                            'sunset': '07:45 PM',
                            'moonrise': '07:27 AM',
                            'moonset': '07:18 PM',
                            'moon_phase': 'New Moon',
                            'moon_illumination': 0
                        },
                        'mintemp': 68,
                        'maxtemp': 79,
                        'avgtemp': 73,
                        'totalsnow': 0,
                        'sunhour': 7.5,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 79,
                                'wind_speed': 9,
                                'wind_degree': 177,
                                'wind_dir': 'S',
                                'weather_code': 176,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Patchy rain possible'
                                ],
                                'precip': 0,
                                'humidity': 85,
                                'visibility': 4,
                                'pressure': 1016,
                                'cloudcover': 83,
                                'heatindex': 73,
                                'dewpoint': 66,
                                'windchill': 72,
                                'windgust': 12,
                                'feelslike': 73,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2020-03-24': {
                        'date': '2020-03-24',
                        'date_epoch': 1585008000,
                        'astro': {
                            'sunrise': '07:29 AM',
                            'sunset': '07:46 PM',
                            'moonrise': '07:57 AM',
                            'moonset': '08:10 PM',
                            'moon_phase': 'New Moon',
                            'moon_illumination': 0
                        },
                        'mintemp': 66,
                        'maxtemp': 86,
                        'avgtemp': 77,
                        'totalsnow': 0,
                        'sunhour': 10.2,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 86,
                                'wind_speed': 9,
                                'wind_degree': 239,
                                'wind_dir': 'WSW',
                                'weather_code': 122,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Overcast'
                                ],
                                'precip': 0,
                                'humidity': 62,
                                'visibility': 6,
                                'pressure': 1012,
                                'cloudcover': 46,
                                'heatindex': 75,
                                'dewpoint': 57,
                                'windchill': 73,
                                'windgust': 12,
                                'feelslike': 75,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2020-03-25': {
                        'date': '2020-03-25',
                        'date_epoch': 1585094400,
                        'astro': {
                            'sunrise': '07:28 AM',
                            'sunset': '07:46 PM',
                            'moonrise': '08:25 AM',
                            'moonset': '09:03 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 3
                        },
                        'mintemp': 68,
                        'maxtemp': 88,
                        'avgtemp': 81,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 7,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 88,
                                'wind_speed': 6,
                                'wind_degree': 210,
                                'wind_dir': 'SSW',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 34,
                                'visibility': 6,
                                'pressure': 1012,
                                'cloudcover': 16,
                                'heatindex': 77,
                                'dewpoint': 46,
                                'windchill': 77,
                                'windgust': 9,
                                'feelslike': 77,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 7
                            }
                        ]
                    },
                    '2020-03-26': {
                        'date': '2020-03-26',
                        'date_epoch': 1585180800,
                        'astro': {
                            'sunrise': '07:27 AM',
                            'sunset': '07:47 PM',
                            'moonrise': '08:55 AM',
                            'moonset': '09:56 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 11
                        },
                        'mintemp': 66,
                        'maxtemp': 86,
                        'avgtemp': 77,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 6,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 86,
                                'wind_speed': 12,
                                'wind_degree': 181,
                                'wind_dir': 'S',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 73,
                                'visibility': 6,
                                'pressure': 1010,
                                'cloudcover': 18,
                                'heatindex': 77,
                                'dewpoint': 64,
                                'windchill': 75,
                                'windgust': 16,
                                'feelslike': 77,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 6
                            }
                        ]
                    },
                    '2020-03-27': {
                        'date': '2020-03-27',
                        'date_epoch': 1585267200,
                        'astro': {
                            'sunrise': '07:26 AM',
                            'sunset': '07:47 PM',
                            'moonrise': '09:26 AM',
                            'moonset': '10:50 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 18
                        },
                        'mintemp': 68,
                        'maxtemp': 82,
                        'avgtemp': 77,
                        'totalsnow': 0,
                        'sunhour': 6.1,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 82,
                                'wind_speed': 12,
                                'wind_degree': 176,
                                'wind_dir': 'S',
                                'weather_code': 176,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Patchy rain possible'
                                ],
                                'precip': 0,
                                'humidity': 77,
                                'visibility': 6,
                                'pressure': 1008,
                                'cloudcover': 75,
                                'heatindex': 77,
                                'dewpoint': 66,
                                'windchill': 75,
                                'windgust': 16,
                                'feelslike': 77,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2020-03-28': {
                        'date': '2020-03-28',
                        'date_epoch': 1585353600,
                        'astro': {
                            'sunrise': '07:25 AM',
                            'sunset': '07:48 PM',
                            'moonrise': '10:00 AM',
                            'moonset': '11:46 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 25
                        },
                        'mintemp': 70,
                        'maxtemp': 77,
                        'avgtemp': 73,
                        'totalsnow': 0,
                        'sunhour': 8.9,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 11,
                                'wind_degree': 273,
                                'wind_dir': 'W',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0,
                                'humidity': 51,
                                'visibility': 6,
                                'pressure': 1011,
                                'cloudcover': 59,
                                'heatindex': 75,
                                'dewpoint': 48,
                                'windchill': 73,
                                'windgust': 14,
                                'feelslike': 75,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2020-03-29': {
                        'date': '2020-03-29',
                        'date_epoch': 1585440000,
                        'astro': {
                            'sunrise': '07:23 AM',
                            'sunset': '07:49 PM',
                            'moonrise': '10:37 AM',
                            'moonset': 'No moonset',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 32
                        },
                        'mintemp': 64,
                        'maxtemp': 73,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 10.2,
                        'uv_index': 6,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 73,
                                'wind_speed': 5,
                                'wind_degree': 151,
                                'wind_dir': 'SSE',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 27,
                                'visibility': 6,
                                'pressure': 1017,
                                'cloudcover': 26,
                                'heatindex': 70,
                                'dewpoint': 32,
                                'windchill': 68,
                                'windgust': 7,
                                'feelslike': 68,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 6
                            }
                        ]
                    },
                    '2020-03-30': {
                        'date': '2020-03-30',
                        'date_epoch': 1585526400,
                        'astro': {
                            'sunrise': '07:22 AM',
                            'sunset': '07:49 PM',
                            'moonrise': '11:19 AM',
                            'moonset': '12:42 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 40
                        },
                        'mintemp': 61,
                        'maxtemp': 73,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 6.1,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 73,
                                'wind_speed': 6,
                                'wind_degree': 155,
                                'wind_dir': 'SSE',
                                'weather_code': 356,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0010_heavy_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Moderate or heavy rain shower'
                                ],
                                'precip': 0.3,
                                'humidity': 70,
                                'visibility': 6,
                                'pressure': 1013,
                                'cloudcover': 79,
                                'heatindex': 70,
                                'dewpoint': 59,
                                'windchill': 68,
                                'windgust': 9,
                                'feelslike': 68,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2020-03-31': {
                        'date': '2020-03-31',
                        'date_epoch': 1585612800,
                        'astro': {
                            'sunrise': '07:21 AM',
                            'sunset': '07:50 PM',
                            'moonrise': '12:07 PM',
                            'moonset': '01:39 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 44
                        },
                        'mintemp': 64,
                        'maxtemp': 77,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 6,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 11,
                                'wind_degree': 209,
                                'wind_dir': 'SSW',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0.2,
                                'humidity': 52,
                                'visibility': 6,
                                'pressure': 1013,
                                'cloudcover': 28,
                                'heatindex': 72,
                                'dewpoint': 50,
                                'windchill': 70,
                                'windgust': 18,
                                'feelslike': 70,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 6
                            }
                        ]
                    }
                }
            };
            break;
        default:
            object = {
                'request': {
                    'type': 'City',
                    'query': 'Austin, United States of America',
                    'language': 'en',
                    'unit': 'f'
                },
                'location': {
                    'name': 'Austin',
                    'country': 'United States of America',
                    'region': 'Texas',
                    'lat': '30.267',
                    'lon': '-97.743',
                    'timezone_id': 'America/Chicago',
                    'localtime': '2021-05-21 16:37',
                    'localtime_epoch': 1621615020,
                    'utc_offset': '-5.0'
                },
                'current': {
                    'observation_time': '09:37 PM',
                    'temperature': 86,
                    'weather_code': 116,
                    'weather_icons': [
                        'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                    ],
                    'weather_descriptions': [
                        'Partly cloudy'
                    ],
                    'wind_speed': 9,
                    'wind_degree': 140,
                    'wind_dir': 'SE',
                    'pressure': 1018,
                    'precip': 0,
                    'humidity': 52,
                    'cloudcover': 50,
                    'feelslike': 90,
                    'uv_index': 7,
                    'visibility': 10,
                    'is_day': 'yes'
                },
                'historical': {
                    '2021-03-01': {
                        'date': '2021-03-01',
                        'date_epoch': 1614556800,
                        'astro': {
                            'sunrise': '07:57 AM',
                            'sunset': '07:30 PM',
                            'moonrise': '10:18 PM',
                            'moonset': '09:41 AM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 79
                        },
                        'mintemp': 50,
                        'maxtemp': 55,
                        'avgtemp': 54,
                        'totalsnow': 0,
                        'sunhour': 7.3,
                        'uv_index': 3,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 55,
                                'wind_speed': 15,
                                'wind_degree': 181,
                                'wind_dir': 'S',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.1,
                                'humidity': 63,
                                'visibility': 6,
                                'pressure': 1019,
                                'cloudcover': 76,
                                'heatindex': 55,
                                'dewpoint': 43,
                                'windchill': 52,
                                'windgust': 18,
                                'feelslike': 52,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 3
                            }
                        ]
                    },
                    '2021-03-02': {
                        'date': '2021-03-02',
                        'date_epoch': 1614643200,
                        'astro': {
                            'sunrise': '07:56 AM',
                            'sunset': '07:31 PM',
                            'moonrise': '11:25 PM',
                            'moonset': '10:16 AM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 72
                        },
                        'mintemp': 46,
                        'maxtemp': 61,
                        'avgtemp': 54,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 61,
                                'wind_speed': 12,
                                'wind_degree': 244,
                                'wind_dir': 'WSW',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 59,
                                'visibility': 6,
                                'pressure': 1023,
                                'cloudcover': 19,
                                'heatindex': 52,
                                'dewpoint': 39,
                                'windchill': 48,
                                'windgust': 16,
                                'feelslike': 48,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2021-03-03': {
                        'date': '2021-03-03',
                        'date_epoch': 1614729600,
                        'astro': {
                            'sunrise': '07:55 AM',
                            'sunset': '07:32 PM',
                            'moonrise': 'No moonrise',
                            'moonset': '10:54 AM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 65
                        },
                        'mintemp': 48,
                        'maxtemp': 66,
                        'avgtemp': 57,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 66,
                                'wind_speed': 5,
                                'wind_degree': 152,
                                'wind_dir': 'SSE',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 60,
                                'visibility': 6,
                                'pressure': 1021,
                                'cloudcover': 8,
                                'heatindex': 55,
                                'dewpoint': 41,
                                'windchill': 55,
                                'windgust': 6,
                                'feelslike': 55,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2021-03-04': {
                        'date': '2021-03-04',
                        'date_epoch': 1614816000,
                        'astro': {
                            'sunrise': '07:53 AM',
                            'sunset': '07:33 PM',
                            'moonrise': '12:32 AM',
                            'moonset': '11:35 AM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 57
                        },
                        'mintemp': 50,
                        'maxtemp': 70,
                        'avgtemp': 61,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 70,
                                'wind_speed': 9,
                                'wind_degree': 171,
                                'wind_dir': 'S',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 65,
                                'visibility': 6,
                                'pressure': 1019,
                                'cloudcover': 20,
                                'heatindex': 59,
                                'dewpoint': 46,
                                'windchill': 57,
                                'windgust': 12,
                                'feelslike': 57,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2021-03-05': {
                        'date': '2021-03-05',
                        'date_epoch': 1614902400,
                        'astro': {
                            'sunrise': '07:52 AM',
                            'sunset': '07:33 PM',
                            'moonrise': '01:40 AM',
                            'moonset': '12:19 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 50
                        },
                        'mintemp': 54,
                        'maxtemp': 75,
                        'avgtemp': 66,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 75,
                                'wind_speed': 11,
                                'wind_degree': 258,
                                'wind_dir': 'WSW',
                                'weather_code': 122,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Overcast'
                                ],
                                'precip': 0,
                                'humidity': 62,
                                'visibility': 6,
                                'pressure': 1015,
                                'cloudcover': 31,
                                'heatindex': 63,
                                'dewpoint': 48,
                                'windchill': 63,
                                'windgust': 15,
                                'feelslike': 63,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2021-03-06': {
                        'date': '2021-03-06',
                        'date_epoch': 1614988800,
                        'astro': {
                            'sunrise': '07:51 AM',
                            'sunset': '07:34 PM',
                            'moonrise': '02:46 AM',
                            'moonset': '01:10 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 43
                        },
                        'mintemp': 54,
                        'maxtemp': 61,
                        'avgtemp': 57,
                        'totalsnow': 0,
                        'sunhour': 5.9,
                        'uv_index': 3,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 61,
                                'wind_speed': 12,
                                'wind_degree': 42,
                                'wind_dir': 'NE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0,
                                'humidity': 69,
                                'visibility': 6,
                                'pressure': 1022,
                                'cloudcover': 81,
                                'heatindex': 57,
                                'dewpoint': 46,
                                'windchill': 55,
                                'windgust': 16,
                                'feelslike': 55,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 3
                            }
                        ]
                    },
                    '2021-03-07': {
                        'date': '2021-03-07',
                        'date_epoch': 1615075200,
                        'astro': {
                            'sunrise': '07:50 AM',
                            'sunset': '07:35 PM',
                            'moonrise': '03:50 AM',
                            'moonset': '02:06 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 35
                        },
                        'mintemp': 50,
                        'maxtemp': 66,
                        'avgtemp': 57,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 66,
                                'wind_speed': 6,
                                'wind_degree': 112,
                                'wind_dir': 'ESE',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 59,
                                'visibility': 6,
                                'pressure': 1027,
                                'cloudcover': 25,
                                'heatindex': 55,
                                'dewpoint': 41,
                                'windchill': 55,
                                'windgust': 9,
                                'feelslike': 55,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2021-03-08': {
                        'date': '2021-03-08',
                        'date_epoch': 1615161600,
                        'astro': {
                            'sunrise': '07:49 AM',
                            'sunset': '07:35 PM',
                            'moonrise': '04:48 AM',
                            'moonset': '03:06 PM',
                            'moon_phase': 'Last Quarter',
                            'moon_illumination': 28
                        },
                        'mintemp': 48,
                        'maxtemp': 66,
                        'avgtemp': 59,
                        'totalsnow': 0,
                        'sunhour': 8.8,
                        'uv_index': 3,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 66,
                                'wind_speed': 7,
                                'wind_degree': 153,
                                'wind_dir': 'SSE',
                                'weather_code': 122,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Overcast'
                                ],
                                'precip': 0,
                                'humidity': 69,
                                'visibility': 6,
                                'pressure': 1029,
                                'cloudcover': 46,
                                'heatindex': 57,
                                'dewpoint': 46,
                                'windchill': 55,
                                'windgust': 11,
                                'feelslike': 55,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 3
                            }
                        ]
                    },
                    '2021-03-09': {
                        'date': '2021-03-09',
                        'date_epoch': 1615248000,
                        'astro': {
                            'sunrise': '07:48 AM',
                            'sunset': '07:36 PM',
                            'moonrise': '05:40 AM',
                            'moonset': '04:07 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 21
                        },
                        'mintemp': 52,
                        'maxtemp': 70,
                        'avgtemp': 63,
                        'totalsnow': 0,
                        'sunhour': 5.9,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 70,
                                'wind_speed': 12,
                                'wind_degree': 168,
                                'wind_dir': 'SSE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0,
                                'humidity': 81,
                                'visibility': 6,
                                'pressure': 1024,
                                'cloudcover': 69,
                                'heatindex': 63,
                                'dewpoint': 55,
                                'windchill': 61,
                                'windgust': 17,
                                'feelslike': 61,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2021-03-10': {
                        'date': '2021-03-10',
                        'date_epoch': 1615334400,
                        'astro': {
                            'sunrise': '07:47 AM',
                            'sunset': '07:37 PM',
                            'moonrise': '06:24 AM',
                            'moonset': '05:09 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 14
                        },
                        'mintemp': 61,
                        'maxtemp': 72,
                        'avgtemp': 66,
                        'totalsnow': 0,
                        'sunhour': 6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 72,
                                'wind_speed': 15,
                                'wind_degree': 176,
                                'wind_dir': 'S',
                                'weather_code': 176,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Patchy rain possible'
                                ],
                                'precip': 0,
                                'humidity': 80,
                                'visibility': 6,
                                'pressure': 1018,
                                'cloudcover': 92,
                                'heatindex': 66,
                                'dewpoint': 59,
                                'windchill': 66,
                                'windgust': 21,
                                'feelslike': 66,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2021-03-11': {
                        'date': '2021-03-11',
                        'date_epoch': 1615420800,
                        'astro': {
                            'sunrise': '07:45 AM',
                            'sunset': '07:37 PM',
                            'moonrise': '07:04 AM',
                            'moonset': '06:09 PM',
                            'moon_phase': 'Waning Crescent',
                            'moon_illumination': 6
                        },
                        'mintemp': 66,
                        'maxtemp': 72,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 72,
                                'wind_speed': 15,
                                'wind_degree': 170,
                                'wind_dir': 'S',
                                'weather_code': 176,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Patchy rain possible'
                                ],
                                'precip': 0,
                                'humidity': 79,
                                'visibility': 6,
                                'pressure': 1017,
                                'cloudcover': 87,
                                'heatindex': 72,
                                'dewpoint': 63,
                                'windchill': 70,
                                'windgust': 21,
                                'feelslike': 70,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2021-03-12': {
                        'date': '2021-03-12',
                        'date_epoch': 1615507200,
                        'astro': {
                            'sunrise': '07:44 AM',
                            'sunset': '07:38 PM',
                            'moonrise': '07:38 AM',
                            'moonset': '07:07 PM',
                            'moon_phase': 'New Moon',
                            'moon_illumination': 0
                        },
                        'mintemp': 68,
                        'maxtemp': 77,
                        'avgtemp': 73,
                        'totalsnow': 0,
                        'sunhour': 6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 13,
                                'wind_degree': 160,
                                'wind_dir': 'SSE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.1,
                                'humidity': 81,
                                'visibility': 6,
                                'pressure': 1019,
                                'cloudcover': 86,
                                'heatindex': 72,
                                'dewpoint': 64,
                                'windchill': 72,
                                'windgust': 18,
                                'feelslike': 72,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2021-03-13': {
                        'date': '2021-03-13',
                        'date_epoch': 1615593600,
                        'astro': {
                            'sunrise': '07:43 AM',
                            'sunset': '07:39 PM',
                            'moonrise': '08:09 AM',
                            'moonset': '08:03 PM',
                            'moon_phase': 'New Moon',
                            'moon_illumination': 0
                        },
                        'mintemp': 66,
                        'maxtemp': 75,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 75,
                                'wind_speed': 15,
                                'wind_degree': 155,
                                'wind_dir': 'SSE',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0.1,
                                'humidity': 81,
                                'visibility': 6,
                                'pressure': 1016,
                                'cloudcover': 93,
                                'heatindex': 72,
                                'dewpoint': 64,
                                'windchill': 70,
                                'windgust': 20,
                                'feelslike': 72,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2021-03-14': {
                        'date': '2021-03-14',
                        'date_epoch': 1615680000,
                        'astro': {
                            'sunrise': '07:42 AM',
                            'sunset': '07:39 PM',
                            'moonrise': '08:39 AM',
                            'moonset': '08:58 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 1
                        },
                        'mintemp': 57,
                        'maxtemp': 73,
                        'avgtemp': 66,
                        'totalsnow': 0,
                        'sunhour': 10.2,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 73,
                                'wind_speed': 9,
                                'wind_degree': 282,
                                'wind_dir': 'WNW',
                                'weather_code': 296,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0017_cloudy_with_light_rain.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain'
                                ],
                                'precip': 0.1,
                                'humidity': 47,
                                'visibility': 6,
                                'pressure': 1014,
                                'cloudcover': 54,
                                'heatindex': 66,
                                'dewpoint': 41,
                                'windchill': 64,
                                'windgust': 12,
                                'feelslike': 64,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2021-03-15': {
                        'date': '2021-03-15',
                        'date_epoch': 1615766400,
                        'astro': {
                            'sunrise': '07:41 AM',
                            'sunset': '07:40 PM',
                            'moonrise': '09:07 AM',
                            'moonset': '09:52 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 8
                        },
                        'mintemp': 54,
                        'maxtemp': 81,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 6,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 81,
                                'wind_speed': 9,
                                'wind_degree': 203,
                                'wind_dir': 'SSW',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 40,
                                'visibility': 6,
                                'pressure': 1012,
                                'cloudcover': 1,
                                'heatindex': 66,
                                'dewpoint': 39,
                                'windchill': 64,
                                'windgust': 14,
                                'feelslike': 64,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 6
                            }
                        ]
                    },
                    '2021-03-16': {
                        'date': '2021-03-16',
                        'date_epoch': 1615852800,
                        'astro': {
                            'sunrise': '07:40 AM',
                            'sunset': '07:40 PM',
                            'moonrise': '09:36 AM',
                            'moonset': '10:45 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 15
                        },
                        'mintemp': 61,
                        'maxtemp': 79,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 7.4,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 79,
                                'wind_speed': 9,
                                'wind_degree': 179,
                                'wind_dir': 'S',
                                'weather_code': 200,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0016_thundery_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Thundery outbreaks possible'
                                ],
                                'precip': 0,
                                'humidity': 67,
                                'visibility': 6,
                                'pressure': 1009,
                                'cloudcover': 43,
                                'heatindex': 70,
                                'dewpoint': 57,
                                'windchill': 70,
                                'windgust': 12,
                                'feelslike': 70,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2021-03-17': {
                        'date': '2021-03-17',
                        'date_epoch': 1615939200,
                        'astro': {
                            'sunrise': '07:38 AM',
                            'sunset': '07:41 PM',
                            'moonrise': '10:06 AM',
                            'moonset': '11:40 PM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 23
                        },
                        'mintemp': 66,
                        'maxtemp': 77,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 12,
                                'wind_degree': 272,
                                'wind_dir': 'W',
                                'weather_code': 356,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0010_heavy_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Moderate or heavy rain shower'
                                ],
                                'precip': 0.4,
                                'humidity': 48,
                                'visibility': 6,
                                'pressure': 1009,
                                'cloudcover': 37,
                                'heatindex': 70,
                                'dewpoint': 45,
                                'windchill': 70,
                                'windgust': 18,
                                'feelslike': 70,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2021-03-18': {
                        'date': '2021-03-18',
                        'date_epoch': 1616025600,
                        'astro': {
                            'sunrise': '07:37 AM',
                            'sunset': '07:42 PM',
                            'moonrise': '10:39 AM',
                            'moonset': 'No moonset',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 30
                        },
                        'mintemp': 52,
                        'maxtemp': 68,
                        'avgtemp': 61,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 68,
                                'wind_speed': 15,
                                'wind_degree': 315,
                                'wind_dir': 'NW',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 37,
                                'visibility': 6,
                                'pressure': 1020,
                                'cloudcover': 0,
                                'heatindex': 61,
                                'dewpoint': 34,
                                'windchill': 57,
                                'windgust': 21,
                                'feelslike': 57,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2021-03-19': {
                        'date': '2021-03-19',
                        'date_epoch': 1616112000,
                        'astro': {
                            'sunrise': '07:36 AM',
                            'sunset': '07:42 PM',
                            'moonrise': '11:15 AM',
                            'moonset': '12:35 AM',
                            'moon_phase': 'Waxing Crescent',
                            'moon_illumination': 37
                        },
                        'mintemp': 50,
                        'maxtemp': 64,
                        'avgtemp': 57,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 64,
                                'wind_speed': 10,
                                'wind_degree': 59,
                                'wind_dir': 'ENE',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 46,
                                'visibility': 6,
                                'pressure': 1026,
                                'cloudcover': 4,
                                'heatindex': 57,
                                'dewpoint': 36,
                                'windchill': 55,
                                'windgust': 14,
                                'feelslike': 55,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2021-03-20': {
                        'date': '2021-03-20',
                        'date_epoch': 1616198400,
                        'astro': {
                            'sunrise': '07:35 AM',
                            'sunset': '07:43 PM',
                            'moonrise': '11:56 AM',
                            'moonset': '01:30 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 44
                        },
                        'mintemp': 52,
                        'maxtemp': 70,
                        'avgtemp': 63,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 70,
                                'wind_speed': 6,
                                'wind_degree': 78,
                                'wind_dir': 'ENE',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 56,
                                'visibility': 6,
                                'pressure': 1026,
                                'cloudcover': 0,
                                'heatindex': 59,
                                'dewpoint': 43,
                                'windchill': 59,
                                'windgust': 7,
                                'feelslike': 59,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2021-03-21': {
                        'date': '2021-03-21',
                        'date_epoch': 1616284800,
                        'astro': {
                            'sunrise': '07:33 AM',
                            'sunset': '07:44 PM',
                            'moonrise': '12:42 PM',
                            'moonset': '02:25 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 52
                        },
                        'mintemp': 46,
                        'maxtemp': 70,
                        'avgtemp': 59,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 70,
                                'wind_speed': 9,
                                'wind_degree': 155,
                                'wind_dir': 'SSE',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 64,
                                'visibility': 6,
                                'pressure': 1021,
                                'cloudcover': 9,
                                'heatindex': 59,
                                'dewpoint': 45,
                                'windchill': 57,
                                'windgust': 12,
                                'feelslike': 57,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2021-03-22': {
                        'date': '2021-03-22',
                        'date_epoch': 1616371200,
                        'astro': {
                            'sunrise': '07:32 AM',
                            'sunset': '07:44 PM',
                            'moonrise': '01:35 PM',
                            'moonset': '03:19 AM',
                            'moon_phase': 'First Quarter',
                            'moon_illumination': 59
                        },
                        'mintemp': 52,
                        'maxtemp': 63,
                        'avgtemp': 59,
                        'totalsnow': 0,
                        'sunhour': 6.1,
                        'uv_index': 3,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 63,
                                'wind_speed': 9,
                                'wind_degree': 171,
                                'wind_dir': 'S',
                                'weather_code': 266,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0017_cloudy_with_light_rain.png'
                                ],
                                'weather_descriptions': [
                                    'Light drizzle'
                                ],
                                'precip': 0.1,
                                'humidity': 85,
                                'visibility': 5,
                                'pressure': 1012,
                                'cloudcover': 85,
                                'heatindex': 57,
                                'dewpoint': 54,
                                'windchill': 55,
                                'windgust': 13,
                                'feelslike': 55,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 3
                            }
                        ]
                    },
                    '2021-03-23': {
                        'date': '2021-03-23',
                        'date_epoch': 1616457600,
                        'astro': {
                            'sunrise': '07:31 AM',
                            'sunset': '07:45 PM',
                            'moonrise': '02:32 PM',
                            'moonset': '04:10 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 66
                        },
                        'mintemp': 57,
                        'maxtemp': 79,
                        'avgtemp': 70,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 79,
                                'wind_speed': 7,
                                'wind_degree': 224,
                                'wind_dir': 'SW',
                                'weather_code': 176,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Patchy rain possible'
                                ],
                                'precip': 0,
                                'humidity': 56,
                                'visibility': 6,
                                'pressure': 1008,
                                'cloudcover': 27,
                                'heatindex': 68,
                                'dewpoint': 46,
                                'windchill': 68,
                                'windgust': 12,
                                'feelslike': 68,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2021-03-24': {
                        'date': '2021-03-24',
                        'date_epoch': 1616544000,
                        'astro': {
                            'sunrise': '07:30 AM',
                            'sunset': '07:45 PM',
                            'moonrise': '03:34 PM',
                            'moonset': '04:58 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 73
                        },
                        'mintemp': 54,
                        'maxtemp': 68,
                        'avgtemp': 63,
                        'totalsnow': 0,
                        'sunhour': 7.5,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 68,
                                'wind_speed': 4,
                                'wind_degree': 205,
                                'wind_dir': 'SSW',
                                'weather_code': 353,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Light rain shower'
                                ],
                                'precip': 0,
                                'humidity': 62,
                                'visibility': 6,
                                'pressure': 1005,
                                'cloudcover': 45,
                                'heatindex': 63,
                                'dewpoint': 52,
                                'windchill': 63,
                                'windgust': 7,
                                'feelslike': 63,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2021-03-25': {
                        'date': '2021-03-25',
                        'date_epoch': 1616630400,
                        'astro': {
                            'sunrise': '07:29 AM',
                            'sunset': '07:46 PM',
                            'moonrise': '04:38 PM',
                            'moonset': '05:42 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 81
                        },
                        'mintemp': 57,
                        'maxtemp': 73,
                        'avgtemp': 66,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 73,
                                'wind_speed': 9,
                                'wind_degree': 299,
                                'wind_dir': 'WNW',
                                'weather_code': 176,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png'
                                ],
                                'weather_descriptions': [
                                    'Patchy rain possible'
                                ],
                                'precip': 0,
                                'humidity': 47,
                                'visibility': 6,
                                'pressure': 1010,
                                'cloudcover': 19,
                                'heatindex': 64,
                                'dewpoint': 43,
                                'windchill': 64,
                                'windgust': 12,
                                'feelslike': 64,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    },
                    '2021-03-26': {
                        'date': '2021-03-26',
                        'date_epoch': 1616716800,
                        'astro': {
                            'sunrise': '07:27 AM',
                            'sunset': '07:47 PM',
                            'moonrise': '05:44 PM',
                            'moonset': '06:22 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 88
                        },
                        'mintemp': 55,
                        'maxtemp': 77,
                        'avgtemp': 68,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 77,
                                'wind_speed': 7,
                                'wind_degree': 135,
                                'wind_dir': 'SE',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 48,
                                'visibility': 6,
                                'pressure': 1014,
                                'cloudcover': 0,
                                'heatindex': 66,
                                'dewpoint': 45,
                                'windchill': 64,
                                'windgust': 10,
                                'feelslike': 64,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2021-03-27': {
                        'date': '2021-03-27',
                        'date_epoch': 1616803200,
                        'astro': {
                            'sunrise': '07:26 AM',
                            'sunset': '07:47 PM',
                            'moonrise': '06:51 PM',
                            'moonset': '06:59 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 95
                        },
                        'mintemp': 61,
                        'maxtemp': 84,
                        'avgtemp': 75,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 6,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 84,
                                'wind_speed': 6,
                                'wind_degree': 210,
                                'wind_dir': 'SSW',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 61,
                                'visibility': 6,
                                'pressure': 1013,
                                'cloudcover': 1,
                                'heatindex': 73,
                                'dewpoint': 55,
                                'windchill': 72,
                                'windgust': 7,
                                'feelslike': 73,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 6
                            }
                        ]
                    },
                    '2021-03-28': {
                        'date': '2021-03-28',
                        'date_epoch': 1616889600,
                        'astro': {
                            'sunrise': '07:25 AM',
                            'sunset': '07:48 PM',
                            'moonrise': '07:58 PM',
                            'moonset': '07:36 AM',
                            'moon_phase': 'Full Moon',
                            'moon_illumination': 100
                        },
                        'mintemp': 63,
                        'maxtemp': 79,
                        'avgtemp': 73,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 6,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 79,
                                'wind_speed': 11,
                                'wind_degree': 141,
                                'wind_dir': 'SE',
                                'weather_code': 113,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png'
                                ],
                                'weather_descriptions': [
                                    'Sunny'
                                ],
                                'precip': 0,
                                'humidity': 58,
                                'visibility': 6,
                                'pressure': 1016,
                                'cloudcover': 0,
                                'heatindex': 72,
                                'dewpoint': 54,
                                'windchill': 72,
                                'windgust': 16,
                                'feelslike': 72,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 6
                            }
                        ]
                    },
                    '2021-03-29': {
                        'date': '2021-03-29',
                        'date_epoch': 1616976000,
                        'astro': {
                            'sunrise': '07:24 AM',
                            'sunset': '07:48 PM',
                            'moonrise': '09:07 PM',
                            'moonset': '08:11 AM',
                            'moon_phase': 'Full Moon',
                            'moon_illumination': 100
                        },
                        'mintemp': 54,
                        'maxtemp': 73,
                        'avgtemp': 64,
                        'totalsnow': 0,
                        'sunhour': 11.6,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 73,
                                'wind_speed': 7,
                                'wind_degree': 112,
                                'wind_dir': 'ESE',
                                'weather_code': 116,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
                                ],
                                'weather_descriptions': [
                                    'Partly cloudy'
                                ],
                                'precip': 0,
                                'humidity': 49,
                                'visibility': 6,
                                'pressure': 1022,
                                'cloudcover': 4,
                                'heatindex': 63,
                                'dewpoint': 41,
                                'windchill': 63,
                                'windgust': 9,
                                'feelslike': 63,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2021-03-30': {
                        'date': '2021-03-30',
                        'date_epoch': 1617062400,
                        'astro': {
                            'sunrise': '07:22 AM',
                            'sunset': '07:49 PM',
                            'moonrise': '10:16 PM',
                            'moonset': '08:49 AM',
                            'moon_phase': 'Waxing Gibbous',
                            'moon_illumination': 83
                        },
                        'mintemp': 57,
                        'maxtemp': 81,
                        'avgtemp': 72,
                        'totalsnow': 0,
                        'sunhour': 7.5,
                        'uv_index': 5,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 81,
                                'wind_speed': 11,
                                'wind_degree': 176,
                                'wind_dir': 'S',
                                'weather_code': 122,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png'
                                ],
                                'weather_descriptions': [
                                    'Overcast'
                                ],
                                'precip': 0,
                                'humidity': 76,
                                'visibility': 6,
                                'pressure': 1013,
                                'cloudcover': 65,
                                'heatindex': 70,
                                'dewpoint': 61,
                                'windchill': 68,
                                'windgust': 14,
                                'feelslike': 70,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 5
                            }
                        ]
                    },
                    '2021-03-31': {
                        'date': '2021-03-31',
                        'date_epoch': 1617148800,
                        'astro': {
                            'sunrise': '07:21 AM',
                            'sunset': '07:50 PM',
                            'moonrise': '11:27 PM',
                            'moonset': '09:29 AM',
                            'moon_phase': 'Waning Gibbous',
                            'moon_illumination': 79
                        },
                        'mintemp': 57,
                        'maxtemp': 66,
                        'avgtemp': 63,
                        'totalsnow': 0,
                        'sunhour': 8.9,
                        'uv_index': 4,
                        'hourly': [
                            {
                                'time': 0,
                                'temperature': 66,
                                'wind_speed': 13,
                                'wind_degree': 153,
                                'wind_dir': 'SSE',
                                'weather_code': 248,
                                'weather_icons': [
                                    'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0007_fog.png'
                                ],
                                'weather_descriptions': [
                                    'Fog'
                                ],
                                'precip': 0,
                                'humidity': 74,
                                'visibility': 4,
                                'pressure': 1020,
                                'cloudcover': 52,
                                'heatindex': 63,
                                'dewpoint': 54,
                                'windchill': 63,
                                'windgust': 17,
                                'feelslike': 63,
                                'chanceofrain': 0,
                                'chanceofremdry': 0,
                                'chanceofwindy': 0,
                                'chanceofovercast': 0,
                                'chanceofsunshine': 0,
                                'chanceoffrost': 0,
                                'chanceofhightemp': 0,
                                'chanceoffog': 0,
                                'chanceofsnow': 0,
                                'chanceofthunder': 0,
                                'uv_index': 4
                            }
                        ]
                    }
                }
            }

    }
    //console.log(object);

    //find start day of month
    const startDay = firstDayOfMonth (monthIndex, year);

    //pull key values for each day of month
    const datesObject = object.historical;
    //console.log(datesObject)

    //push each date into the right array
    for(const date in datesObject) {
        const data = datesObject[date];
    
        let dateArray = data.date.split('-');
        let dateDay = parseInt(dateArray[2]);

        let dateMonth = parseInt(dateArray[1]) - 1;
        let dateDayOfWeek = dayOfWeek(dateMonth, dateArray[0], dateArray[2]);
        let dateWeekOfMonth = weekOfMonth(dateDay, startDay);

        window[`week${dateWeekOfMonth}Day${dateDayOfWeek}`].push(data);
    }

}


//find days in the month
function daysInMonth (month, year) {
    let numDays = new Date(year, month + 1, 0).getDate();
    return numDays;
}

//find first day of month
function firstDayOfMonth (month, year) {
    let firstDate = new Date(year, month, 1).getDay();
    return firstDate;
}

//day of week
function dayOfWeek (month, year, day) {
    let dayOfWeek = new Date(year, month, day).getDay();
    return dayOfWeek;
}

// week of month
function weekOfMonth (day, start) {
    return Math.ceil((day + start) / 7);
}
