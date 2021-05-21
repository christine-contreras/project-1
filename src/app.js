const apiKey = 'fba8c59e3a5f9d7d2ed8d4014b3ddc97';
const form = document.getElementById('form');
const resultsContainer = document.getElementById('calendar-results');
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
let year1;
let year2;
let year3;
let year4;
let year5;

console.log(`current date: ${currentMonth} ${currentYear}`)


function fetchSubmit(location, month , year, endDate) {
    const object = {
        "request": {
            "type": "City",
            "query": "Austin, United States of America",
            "language": "en",
            "unit": "f"
        },
        "location": {
            "name": "Austin",
            "country": "United States of America",
            "region": "Texas",
            "lat": "30.267",
            "lon": "-97.743",
            "timezone_id": "America/Chicago",
            "localtime": "2021-05-21 15:32",
            "localtime_epoch": 1621611120,
            "utc_offset": "-5.0"
        },
        "current": {
            "observation_time": "08:32 PM",
            "temperature": 88,
            "weather_code": 116,
            "weather_icons": [
                "https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png"
            ],
            "weather_descriptions": [
                "Partly cloudy"
            ],
            "wind_speed": 6,
            "wind_degree": 120,
            "wind_dir": "ESE",
            "pressure": 1018,
            "precip": 0,
            "humidity": 46,
            "cloudcover": 50,
            "feelslike": 95,
            "uv_index": 6,
            "visibility": 10,
            "is_day": "yes"
        },
        "historical": {
            "2021-02-01": {
                "date": "2021-02-01",
                "date_epoch": 1612137600,
                "astro": {
                    "sunrise": "08:21 AM",
                    "sunset": "07:08 PM",
                    "moonrise": "11:25 PM",
                    "moonset": "11:08 AM",
                    "moon_phase": "Waning Gibbous",
                    "moon_illumination": 63
                },
                "mintemp": 48,
                "maxtemp": 61,
                "avgtemp": 55,
                "totalsnow": 0,
                "sunhour": 10.9,
                "uv_index": 4,
                "hourly": [
                    {
                        "time": 0,
                        "temperature": 61,
                        "wind_speed": 8,
                        "wind_degree": 163,
                        "wind_dir": "SSE",
                        "weather_code": 116,
                        "weather_icons": [
                            "https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png"
                        ],
                        "weather_descriptions": [
                            "Partly cloudy"
                        ],
                        "precip": 0,
                        "humidity": 40,
                        "visibility": 6,
                        "pressure": 1028,
                        "cloudcover": 7,
                        "heatindex": 54,
                        "dewpoint": 28,
                        "windchill": 52,
                        "windgust": 12,
                        "feelslike": 52,
                        "chanceofrain": 0,
                        "chanceofremdry": 0,
                        "chanceofwindy": 0,
                        "chanceofovercast": 0,
                        "chanceofsunshine": 0,
                        "chanceoffrost": 0,
                        "chanceofhightemp": 0,
                        "chanceoffog": 0,
                        "chanceofsnow": 0,
                        "chanceofthunder": 0,
                        "uv_index": 4
                    }
                ]
            },
            "2021-02-02": {
                "date": "2021-02-02",
                "date_epoch": 1612224000,
                "astro": {
                    "sunrise": "08:21 AM",
                    "sunset": "07:09 PM",
                    "moonrise": "No moonrise",
                    "moonset": "11:43 AM",
                    "moon_phase": "Waning Gibbous",
                    "moon_illumination": 55
                },
                "mintemp": 45,
                "maxtemp": 61,
                "avgtemp": 54,
                "totalsnow": 0,
                "sunhour": 10.9,
                "uv_index": 4,
                "hourly": [
                    {
                        "time": 0,
                        "temperature": 61,
                        "wind_speed": 6,
                        "wind_degree": 144,
                        "wind_dir": "SE",
                        "weather_code": 116,
                        "weather_icons": [
                            "https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png"
                        ],
                        "weather_descriptions": [
                            "Partly cloudy"
                        ],
                        "precip": 0,
                        "humidity": 42,
                        "visibility": 6,
                        "pressure": 1024,
                        "cloudcover": 10,
                        "heatindex": 52,
                        "dewpoint": 30,
                        "windchill": 52,
                        "windgust": 8,
                        "feelslike": 52,
                        "chanceofrain": 0,
                        "chanceofremdry": 0,
                        "chanceofwindy": 0,
                        "chanceofovercast": 0,
                        "chanceofsunshine": 0,
                        "chanceoffrost": 0,
                        "chanceofhightemp": 0,
                        "chanceoffog": 0,
                        "chanceofsnow": 0,
                        "chanceofthunder": 0,
                        "uv_index": 4
                    }
                ]
            }
        }
    }

    let currentUl = document.getElementById(`${year}`);

    
    const historical = object.historical
    console.log(historical)

    for(const date in historical) {
        const data = historical[date];
        createLi(data, currentUl);

        
    }
    
    // fetch(`http://api.weatherstack.com/historical?access_key=${apiKey}&query=${location}&historical_date_start=${year}-${month}-01&historical_date_end=${year}-${month}-${endDate}&hourly=1&interval=24&units=f`)
    // .then(response => response.json())
    // .then(object => {
    //     console.log(object)
    //     const datesObject = object.historical

    //     let currentUl = document.getElementById(`${year}`);
    //     object.historical.forEach(createLi)


        

    // });



}

function createLi(date, ul) {
    const li = document.createElement('li');

    const datePTag = document.createElement('p');
    datePTag.innerText = date.date;

    const icon = document.createElement('img');
    icon.src = date.hourly[0].weather_icons[0];

    const description = document.createElement('p');
    description.innerText = date.hourly[0].weather_descriptions[0];

    const tempPTag = document.createElement('p');
    tempPTag.innerHTML = `${date.mintemp}&deg;F / ${date.maxtemp}&deg;F`;

    const rain = document.createElement('p');
    const rainInches = (date.hourly[0].precip * 0.0393701).toFixed(2);
    rain.innerHTML = `Precip: ${rainInches} in.`

    const humidity = document.createElement('p');
    humidity.innerHTML = `Humidity: ${date.hourly[0].humidity}&#37;`

    const wind = document.createElement('p');
    const windMph = (date.hourly[0].wind_speed * 0.621371).toFixed(2);
    wind.innerHTML = `Wind: ${windMph} mph`

    const sun = document.createElement('p');
    sun.innerHTML = `Sun: ${date.sunhour} hrs.`

    li.append(datePTag, icon, description, tempPTag, rain, humidity, wind, sun)

    ul.appendChild(li);

}


form.addEventListener('submit', (event) => {
    event.preventDefault();

    const locationInput = document.getElementById('input-location').value
    let monthInput = (document.getElementById('input-month').selectedIndex)
    let timeframeInput = document.getElementById('input-timeframe').selectedIndex

    //check which year to start search on then the next few years
    if(currentMonth > monthInput) {
        year1 = currentYear;
    } else {
        year1 = currentYear - 1;
    }
    //console.log(`year to start search on: ${year1}`);
    year2 = year1 - 1;
    year3 = year2 - 1;
    year4 = year3 - 1;
    year5 = year4 - 1;


    let numDays = daysInMonth(monthInput, year1)
    let firstDayOfWeek = dayOfWeek(monthInput, year1)

    //console.log('number of days in month: ' + numDays)
    //console.log('the month starts on: ' + firstDayOfWeek)

    //changing month into correct format for URL
    if (monthInput < 10) {
    monthInput = `0${monthInput + 1}`
    } 
    //console.log(`month to pass into URL: ${monthInput}`)


    const calendarTitle = document.createElement('h2');
    calendarTitle.innerHTML = `${locationInput}`;
    const calendarYears = document.createElement('h3');

    //calendar years
    if(timeframeInput === 4) {
        calendarYears.innerHTML = `${year1} - ${year5}`;
    } else if (timeframeInput === 3) {
        calendarYears.innerHTML = `${year1} - ${year4}`;
    } else if (timeframeInput === 2) {
        calendarYears.innerHTML = `${year1} - ${year3}`;
    } else if (timeframeInput === 1) {
        calendarYears.innerHTML = `${year1} - ${year2}`;
    } else {
        calendarYears.innerHTML = `${year1}`;
    }

    resultsContainer.append(calendarTitle,calendarYears)


    //console.log(timeframeInput)
    switch(timeframeInput) {
        case 4:
            //console.log('run fetch five times ' + year5);
            ulYear4 = document.createElement('ul')
            ulYear4.setAttribute('id', `${year4}`);
            resultsContainer.appendChild(ulYear4);
            //fetchSubmit(locationInput, monthInput, year5, '02');
        case 3:
            //console.log('run fetch four times ' + year4);
            ulYear4 = document.createElement('ul')
            ulYear4.setAttribute('id', `${year4}`);
            resultsContainer.appendChild(ulYear4);
            //fetchSubmit(locationInput, monthInput, year4, '02');
        case 2:
            //console.log('run fetch three times ' + year3);
            ulYear3 = document.createElement('ul')
            ulYear3.setAttribute('id', `${year3}`);
            resultsContainer.appendChild(ulYear3);
            //fetchSubmit(locationInput, monthInput, year4, '02');
        case 1:
            //console.log('run fetch twice ' + year2);
            ulYear2 = document.createElement('ul')
            ulYear2.setAttribute('id', `${year2}`);
            resultsContainer.appendChild(ulYear2);
            //fetchSubmit(locationInput, monthInput, year4, '02');
        case 0:
            //console.log('run fetch once ' + year1);
            ulYear1 = document.createElement('ul')
            ulYear1.setAttribute('id', `${year1}`);
            resultsContainer.appendChild(ulYear1);
            fetchSubmit(locationInput, monthInput, year1, '02');

    }


})

//find days in the month
function daysInMonth (month, year) {
    let numDays = new Date(year, month + 1, 0).getDate();
    return numDays;
}

//find first day of week
function dayOfWeek (month, year) {
    const weekday = new Array();
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    let firstDate = new Date(year, month, 1).getDay();
    let firstDayOfWeek = weekday[firstDate];

    return firstDayOfWeek;
}








