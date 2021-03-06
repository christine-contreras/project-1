const apiKey = config.SECRET_API_KEY;
const form = document.getElementById('form');
const resultsContainer = document.getElementById('calendar-results');
const topNav = document.getElementById('nav-links');
const newCalendar = document.createElement('div');
newCalendar.setAttribute('id', `js-calendar`);
newCalendar.setAttribute('class', 'calendar');
const ulDates = document.createElement('ul');
ulDates.setAttribute('class', 'date-grid');
const modal = document.getElementById('details-modal');
const modalDatesContainer = document.createElement('div');
modalDatesContainer.classList.add('modal-dates', 'text-center');
const goBackLink = document.createElement('a');
goBackLink.setAttribute('id', 'cd project-1return-link');
goBackLink.classList.add('pure-menu-link');
const htmlTag = document.querySelector('html');
const btnSaveDate = document.createElement('button');
const btnContainer = document.createElement('div');
btnContainer.setAttribute('id', 'modalbtn-container');
const seeSavedDatesLink = document.createElement('a');
seeSavedDatesLink.setAttribute('id', 'modal-seedates');
const heroContainer = document.getElementById('hero');
const SavedDatesModal = document.getElementById('saveddates-modal');

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
let year1, year2, year3, year4, year5;

//create arrays to push API data. array push corresponds with week and day of week the object falls on
var [week1Day0,week1Day1,week1Day2,week1Day3,week1Day4,week1Day5,week1Day6,week2Day0,week2Day1,week2Day2,week2Day3,week2Day4,week2Day5,week2Day6,week3Day0,week3Day1,week3Day2,week3Day3,week3Day4,week3Day5,week3Day6,week4Day0,week4Day1,week4Day2,week4Day3,week4Day4,week4Day5,week4Day6,week5Day0,week5Day1,week5Day2,week5Day3,week5Day4,week5Day5,week5Day6,week6Day0,week6Day1,week6Day2,week6Day3,week6Day4,week6Day5,week6Day6] = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

//clear data when submission is pushed
function initForm() {
    resultsContainer.innerHTML = '';
    newCalendar.innerHTML = '';
    ulDates.innerHTML = '';

    [week1Day0,week1Day1,week1Day2,week1Day3,week1Day4,week1Day5,week1Day6,week2Day0,week2Day1,week2Day2,week2Day3,week2Day4,week2Day5,week2Day6,week3Day0,week3Day1,week3Day2,week3Day3,week3Day4,week3Day5,week3Day6,week4Day0,week4Day1,week4Day2,week4Day3,week4Day4,week4Day5,week4Day6,week5Day0,week5Day1,week5Day2,week5Day3,week5Day4,week5Day5,week5Day6,week6Day0,week6Day1,week6Day2,week6Day3,week6Day4,week6Day5,week6Day6] = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

    dateArrayObject = [];
    dayAverageArrays = [];
}


//form submit actions
form.addEventListener('submit', (event) => {
    event.preventDefault();

    initForm();
    
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

    year2 = year1 - 1;
    year3 = year1 - 2;
    year4 = year1 - 3;
    year5 = year1 - 4;


    let numDays = daysInMonth(monthIndex, year1)
    
    //changing month into correct format for URL
    if (monthIndex < 10) {
        monthNum = `0${monthIndex + 1}`;
    } 

    const calendarTitle = document.createElement('h2');
    calendarTitle.setAttribute('class', 'h1')
    calendarTitle.innerHTML = `${locationInput}`;
    const calendarYears = document.createElement('h3');
    calendarYears.setAttribute('class', 'calendar-years');
    const calendarDetails = document.createElement('p');
    calendarDetails.innerText = 'The calendar below shows the average weather data for each day of the week. Click on each date to see the weather breakdown by year.';

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

    resultsContainer.append(calendarTitle,calendarYears, calendarDetails);
    createCalendar(monthName);
    newCalendar.appendChild(ulDates);
    ulDates.setAttribute('data-location', `${locationInput}`);
    ulDates.setAttribute('data-month', `${monthName}`);

    //how many times to fetch API data (fetch for each year of data). wait for fetches to be done before calculating averages
    if(timeframeIndex === 0){
        async function getData(){
            await fetchSubmit(locationInput, monthNum, monthIndex, year1, numDays);
            await createDatesInCalendar();
        }
        getData();

    } else if(timeframeIndex === 1){
        async function getData(){
            await fetchSubmit(locationInput, monthNum, monthIndex, year1, numDays);
            await fetchSubmit(locationInput, monthNum, monthIndex, year2, numDays);
            await createDatesInCalendar();
        }

        getData();

    } else if(timeframeIndex === 2) {
        async function getData(){
            await fetchSubmit(locationInput, monthNum, monthIndex, year1, numDays);
            await fetchSubmit(locationInput, monthNum, monthIndex, year2, numDays);
            await fetchSubmit(locationInput, monthNum, monthIndex, year3, numDays);
            await createDatesInCalendar();
        }

        getData();

    } else if(timeframeIndex === 3){
        async function getData(){
            await fetchSubmit(locationInput, monthNum, monthIndex, year1, numDays);
            await fetchSubmit(locationInput, monthNum, monthIndex, year2, numDays);
            await fetchSubmit(locationInput, monthNum, monthIndex, year3, numDays);
            await fetchSubmit(locationInput, monthNum, monthIndex, year4, numDays);
            await createDatesInCalendar();
        }

        getData();

    } else {
        async function getData(){
            await fetchSubmit(locationInput, monthNum, monthIndex, year1, numDays);
            await fetchSubmit(locationInput, monthNum, monthIndex, year2, numDays);
            await fetchSubmit(locationInput, monthNum, monthIndex, year3, numDays);
            await fetchSubmit(locationInput, monthNum, monthIndex, year4, numDays);
            await fetchSubmit(locationInput, monthNum, monthIndex, year5, numDays);
            await createDatesInCalendar();
        }

        getData();
    }

});

//fetch data from form submission. 
function fetchSubmit(location, monthNum, monthIndex, year, endDate) {

    return new Promise(resolve => { 
        const startDay = firstDayOfMonth (monthIndex, year);

        fetch(`http://api.weatherstack.com/historical?access_key=${apiKey}&query=${location}&historical_date_start=${year}-${monthNum}-01&historical_date_end=${year}-${monthNum}-${endDate}&hourly=1&interval=6&units=f`)
        .then(response => response.json())
        .then(object => {
            //pull key values for each day of month
            const datesObject = object.historical;
    
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

            resolve(`${year} done fetching`);

        });



    });
}

//grab pushed objects from API, for each array create ID and list item. Save push data into new array with values
function createDatesInCalendar() {
    return new Promise(resolve => { 
        var dayOfMonthArrays = [week1Day0,week1Day1,week1Day2,week1Day3,week1Day4,week1Day5,week1Day6,week2Day0,week2Day1,week2Day2,week2Day3,week2Day4,week2Day5,week2Day6,week3Day0,week3Day1,week3Day2,week3Day3,week3Day4,week3Day5,week3Day6,week4Day0,week4Day1,week4Day2,week4Day3,week4Day4,week4Day5,week4Day6,week5Day0,week5Day1,week5Day2,week5Day3,week5Day4,week5Day5,week5Day6,week6Day0,week6Day1,week6Day2,week6Day3,week6Day4,week6Day5,week6Day6]
    
        dayOfMonthArrays.forEach(day => {
            let id;
    
            //if array is empty create empty list item else create list item with array info
            if (day.length === 0){
                id = dayOfMonthArrays.indexOf(day);
                emptyLi(id);
            } else {
                let newObject = {};
                id = dayOfMonthArrays.indexOf(day);
                createAverageObjects(day, newObject, id);
            }
    
            //save arrays with API objects into new array so we can access data later
            return dateArrayObject.push(day);
        });
    
        resolve('day averages function finished');

    });

}


let dateArrayObject = [];

//find averages for data & push averages into new array
function createAverageObjects(array, object, id) {
    //add id as key: value
    object.id = id;

    //calculate cloudcover
    const cloudAvg = Math.ceil(averages(array, 'hourly', 'cloudcover'));
    object.cloudcover = cloudAvg;

    //calculate mintemp avg & add to object
    const minTempAvg = Math.ceil(averages(array, 'mintemp'));
    object.mintemp = minTempAvg;

    //calculate maxtemp ave & add to object
    const maxTempAvg = Math.ceil(averages(array, 'maxtemp'));
    object.maxtemp = maxTempAvg;

    //calculate rain ave & add to object
    const rainAvg = averages(array, 'hourly', 'precip');
    object.rain = rainAvg;

    //calculate wind ave & add to object
    const windAvg = Math.ceil(averages(array, 'hourly', 'wind_speed'));
    object.wind = windAvg;

    //calculate humidity ave & add to object
    const humidityAvg = Math.ceil(averages(array, 'hourly', 'humidity'));
    object.humidity = humidityAvg;

    //calculate humidity ave & add to object
    const sunAvg = Math.ceil(averages(array, 'sunhour'));
    object.sun = sunAvg;

    //create new array from weather descriptions at noon
    const descriptionArray = array.map(item => {
        let description = item['hourly'][2]['weather_descriptions'][0];
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


    //create new array from weather icons at noon
    const iconArray = array.map(item => {
        let description = item['hourly'][2]['weather_icons'][0];
        return description;
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

    return dayAverageArrays.push(object);

    
}

//array with new average objects
let dayAverageArrays = [];

//function to calculate average for any numerical key in API
function averages(array, value1, value2) {

    return array.reduce((accum, element) =>{

        if(value1 === 'hourly'){
            let hourlySum = element.hourly.reduce((accum2, element2) =>{
                return accum2 + element2[value2];
            },0) / element.hourly.length;
            
            return accum + hourlySum;

        } else {
        return accum + element[value1];
        }

    },0) / array.length;
    
}

//create calendar 
function createCalendar(month){
    const calendarTitleContainer = document.createElement('div')
    calendarTitleContainer.setAttribute('class', 'calendar-title-container');

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

    calendarTitleContainer.append(calendarTitle, calendarDays);
    newCalendar.appendChild(calendarTitleContainer);
    resultsContainer.appendChild(newCalendar);
}

//create empty date if there is no data for that day
function emptyLi(id){
    const li = document.createElement('li');
    li.setAttribute('data-id', id);
    ulDates.appendChild(li);
}

//create calendar date with info 
function createLi(info){

    //create list item
    const li = document.createElement('li');
    li.setAttribute('class', 'item');
    li.setAttribute('data-id', `${info.id}`);

    //create top portion of date where icon, description and min/max temp will go
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

    //create bottom portion of date item with 2x2 info grid
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

    const overlay = document.createElement('div');
    overlay.setAttribute('class', 'overlay');
    const btn = document.createElement('btn');
    btn.innerText = "See Details"
    btn.setAttribute('id', 'js-details')
    btn.setAttribute('data-button', `${info.id}`);
    btn.classList.add('details-button', 'pure-button');
    overlay.appendChild(btn)

    li.append(quickInfo, infoContainer, overlay);
    ulDates.appendChild(li);
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

//if date in calendar is clicked to see details run this event listener
ulDates.addEventListener('click', (event) =>{

    if(event.target.classList.contains('details-button')){
        const location = event.currentTarget.dataset.location;
        const month = event.currentTarget.dataset.month;
        const id = event.path[2].dataset.id;
        const liArrayDates = dateArrayObject[id];

        createDetailsPage(liArrayDates, location, month, id);
        
    }

});

//create "see details" modal
function createDetailsPage(array, location, month, id){

    //hide calendar results and open modal
    resultsContainer.style.display = 'none';
    modal.classList.add('open');
    
    //create modal nav
    const nav = document.createElement('nav');
    const menu = document.createElement('div');
    menu.classList.add('pure-menu', 'pure-menu-horizontal', 'pure-menu-fixed');
    const menuContainer = document.createElement('div');
    menuContainer.classList.add('menu-container');

    goBackLink.href = '#';
    goBackLink.innerHTML = '<i class="bi-arrow-left-circle-fill" role="img" aria-label="rain"></i> Go Back';

    const modalTitle = document.createElement('div');
    modalTitle.classList.add('modal-title', 'text-center');

    const titleLocation = document.createElement('h2');
    titleLocation.innerText = `${location}`;

    //finding week # and day of week
    const dayArray = array[0].date.split('-');
    const dateDay = parseInt(dayArray[2]);
    const dateMonth = parseInt(dayArray[1]) - 1;
    const dateYear = parseInt(dayArray[0]);
    const firstDay = firstDayOfMonth (dateMonth, dateYear);
    const dateDayOfWeek = dayOfWeek(dateMonth, dateYear, dateDay);
    const dateWeekOfMonth = weekOfMonth(dateDay, firstDay);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = daysOfWeek[dateDayOfWeek];


    const subtitleModal = document.createElement('h3');
    subtitleModal.innerHTML = `<span id="modal-month">${month}</span>  | Week <span class="font-3" id="modal-week">${dateWeekOfMonth}</span>  | <span id="modal-weekday">${weekday}</span>`;

    modalTitle.append(titleLocation, subtitleModal);

    btnSaveDate.setAttribute('type', 'submit');
    btnSaveDate.classList.add('pure-button', 'pure-button-primary', 'block');
    btnSaveDate.setAttribute('id', 'savedate-submit');
    btnSaveDate.setAttribute('data-btn', `${id}`);


    //see if date already exists
    fetch('http://localhost:3000/savedDates') //GET request
    .then(response => response.json())
    .then(json => {

        let find = json.find(object => {
            if(object.location === location && object.month === month && object.week === dateWeekOfMonth.toString() && object.dayOfWeek === weekday){
                return object;
            }
        });

        //add if it doesn't exist; let the button be clickable
        if(find !== undefined) {
            savedDateSubmitAction();
            
        } else {
            btnSaveDate.innerText = 'Save This Day';
        }
    });   

    btnContainer.appendChild(btnSaveDate)

    menuContainer.append(goBackLink,modalTitle,btnContainer);
    menu.appendChild(menuContainer);
    nav.appendChild(menu);
    modal.append(nav, modalDatesContainer);

    //create separate details container for each year
    array.forEach(createModalInfo);

    //fix background issue 
    htmlTag.style.background = 'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)';
    
}

//create individual container for each year in "see details"
function createModalInfo(date){
    //create container
    const yearContainer = document.createElement('div');
    yearContainer.setAttribute('class', 'modal-year-container');
    modalDatesContainer.appendChild(yearContainer);

    //find year and add as title for container
    const dayArray = date.date.split('-');
    const dateYear = parseInt(dayArray[0]);
    const yearTitle = document.createElement('h4');
    yearTitle.classList.add('font-3', 'modal-year');
    yearTitle.innerHTML = `${dateYear}`;

    const modalInfo = document.createElement('div');
    modalInfo.setAttribute('class', 'modal-info');

    yearContainer.append(yearTitle,modalInfo);

    //append day and night containers
    const dayInfo = document.createElement('div');
    dayInfo.setAttribute('class', 'day');
    const nightInfo = document.createElement('div');
    nightInfo.setAttribute('class', 'night');

    modalInfo.append(dayInfo, nightInfo);

    //append quickinfo and modal-info to day container
    const dayQuickInfo = document.createElement('div');
    dayQuickInfo.setAttribute('class', 'date-quickinfo');
    const dayModalSubInfo = document.createElement('div');
    dayModalSubInfo.setAttribute('class', 'modal-subinfo');

    dayInfo.append(dayQuickInfo, dayModalSubInfo);
    
    //quickinfo for day (left side of year container)
    const dayModalIconContainer = document.createElement('div');
    dayModalIconContainer.setAttribute('class', 'modal-icon');
    const dayModalTempContainer = document.createElement('div');
    dayModalTempContainer.setAttribute('class', 'modal-temp');

    dayQuickInfo.append(dayModalIconContainer, dayModalTempContainer);

    const dayModalSubtitle = document.createElement('p');
    dayModalSubtitle.setAttribute('class', 'info-title');
    dayModalSubtitle.innerText = 'Day';
    const dayIcon = document.createElement('img');
    dayIcon.setAttribute('class', 'icon');
    dayIcon.src = date.hourly[2]['weather_icons'][0]; 
    dayModalIconContainer.append(dayModalSubtitle, dayIcon);

    const dayDescription = document.createElement('p');
    dayDescription.setAttribute('class', 'description');
    dayDescription.innerText = date.hourly[2]['weather_descriptions'][0];
    const dayTemperature = document.createElement('p');
    dayTemperature.setAttribute('class', 'temperature');
    dayTemperature.innerHTML = `Feels Like: <br>${date.hourly[2].feelslike}&deg;F`;
    dayModalTempContainer.append(dayDescription, dayTemperature);

    //modal subinfo for day (left side of year container)
    const dayRain = document.createElement('div');
    dayRain.setAttribute('class', 'info-group');
    const dayRainDecimal = (date.hourly[2].precip).toFixed(2);
    dayRain.innerHTML = `<i class="bi-cloud-rain" role="img" aria-label="rain"></i><p class="info-title">Precip:</p><p class="info-data">${dayRainDecimal} mm</p>`;

    const dayHumidity = document.createElement('div');
    dayHumidity.setAttribute('class', 'info-group');
    dayHumidity.innerHTML = `<i class="bi-thermometer-sun" aria-label="humidity"></i><p class="info-title">Humidity:</p><p class="info-data">${date.hourly[2].humidity}&#37;</p>`;

    const dayWind = document.createElement('div');
    dayWind.setAttribute('class', 'info-group');
    const dayWindMph = (date.hourly[2]['wind_speed'] * 0.621371).toFixed(2);
    dayWind.innerHTML = `<i class="bi-wind" role="img" aria-label="wind"></i><p class="info-title">Wind:</p><p class="info-data">${dayWindMph} mph</p>`;

    const dayCloudCover = document.createElement('div');
    dayCloudCover.setAttribute('class', 'info-group');
    dayCloudCover.innerHTML = `<i class="bi-cloud" role="img" aria-label="cloudcover"></i><p class="info-title">Cloudcover:</p><p class="info-data">${date.hourly[2].cloudcover}&#37;</p>`;

    dayModalSubInfo.append(dayRain, dayHumidity, dayWind, dayCloudCover);

    //append quickinfo and modal-info to night container
    const nightQuickInfo = document.createElement('div');
    nightQuickInfo.setAttribute('class', 'date-quickinfo');
    const nightModalSubInfo = document.createElement('div');
    nightModalSubInfo.setAttribute('class', 'modal-subinfo');

    nightInfo.append(nightQuickInfo, nightModalSubInfo);
    
    //quickinfo for night
    const nightModalIconContainer = document.createElement('div');
    nightModalIconContainer.setAttribute('class', 'modal-icon');
    const nightModalTempContainer = document.createElement('div');
    nightModalTempContainer.setAttribute('class', 'modal-temp');

    nightQuickInfo.append(nightModalIconContainer, nightModalTempContainer);

    const nightModalSubtitle = document.createElement('p');
    nightModalSubtitle.setAttribute('class', 'info-title');
    nightModalSubtitle.innerText = 'Night';
    const nightIcon = document.createElement('img');
    nightIcon.setAttribute('class', 'icon');
    nightIcon.src = date.hourly[3]['weather_icons'][0]; 
    nightModalIconContainer.append(nightModalSubtitle, nightIcon);

    const nightDescription = document.createElement('p');
    nightDescription.setAttribute('class', 'description');
    nightDescription.innerText = date.hourly[3]['weather_descriptions'][0];
    const nightTemperature = document.createElement('p');
    nightTemperature.setAttribute('class', 'temperature');
    nightTemperature.innerHTML = `Feels Like: <br>${date.hourly[3].feelslike}&deg;F`;
    nightModalTempContainer.append(nightDescription, nightTemperature);

    //modal subinfo for night
    const nightRain = document.createElement('div');
    nightRain.setAttribute('class', 'info-group');
    const nighRainDecimal = (date.hourly[3].precip).toFixed(2);
    nightRain.innerHTML = `<i class="bi-cloud-rain" role="img" aria-label="rain"></i><p class="info-title">Precip:</p><p class="info-data">${nighRainDecimal} mm</p>`;

    const nightHumidity = document.createElement('div');
    nightHumidity.setAttribute('class', 'info-group');
    nightHumidity.innerHTML = `<i class="bi-thermometer-sun" aria-label="humidity"></i><p class="info-title">Humidity:</p><p class="info-data">${date.hourly[3].humidity}&#37;</p>`;

    const nightWind = document.createElement('div');
    nightWind.setAttribute('class', 'info-group');
    const nightWindMph = (date.hourly[3]['wind_speed'] * 0.621371).toFixed(2);
    nightWind.innerHTML = `<i class="bi-wind" role="img" aria-label="wind"></i><p class="info-title">Wind:</p><p class="info-data">${nightWindMph} mph</p>`;

    const nightCloudCover = document.createElement('div');
    nightCloudCover.setAttribute('class', 'info-group');
    nightCloudCover.innerHTML = `<i class="bi-cloud" role="img" aria-label="cloudcover"></i><p class="info-title">Cloudcover:</p><p class="info-data">${date.hourly[3].cloudcover}&#37;</p>`;

    nightModalSubInfo.append(nightRain, nightHumidity, nightWind, nightCloudCover);
}

//if go back link on "see details" nav is clicks
goBackLink.addEventListener('click', () =>{
    removeModal();
});

//minimize see details modal and reset containers to empty
function removeModal(){
    modal.classList.remove('open');
    btnSaveDate.removeAttribute('data-btn');
    modalDatesContainer.innerHTML = '';
    modal.innerHTML = '';
    btnContainer.innerHTML = '';
    resultsContainer.style.display = 'block';
    btnSaveDate.innerHTML = '';
    btnSaveDate.disabled = false;
    htmlTag.style.background = 'none';
}


//if save this day button is submitted add date to "saved dates"
modal.addEventListener('click', (event) =>{
    //if modal target = save date btn
    if(event.target.id === 'savedate-submit'){
        const modalLocation = event.path[2].children[1].children[0].innerText;
        const modalMonth = document.getElementById('modal-month').innerText;
        const modalWeek = document.getElementById('modal-week').innerText;
        const modalWeekDay = document.getElementById('modal-weekday').innerText;

        const arrayId = event.target.dataset.btn;
        const day = dayAverageArrays[arrayId];
        addToServer(modalLocation, modalMonth, modalWeek, modalWeekDay, day);

    } //if click is on save date btn


});

//add average for date object to server
function addToServer(locationID, monthID, weekID, weekDayID, arrayID) {
    const formData = {
        location: locationID,
        month: monthID,
        week: weekID,
        dayOfWeek: weekDayID,
        years: arrayID
    };

    const configuationObject = {
    method: 'POST',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify(formData)
    };

    fetch('http://localhost:3000/savedDates', configuationObject)
    .then(response => response.json())
    .then(savedDateSubmitAction);
}

//once data is added to server disable "save this day" button and add link to see saved dates
function savedDateSubmitAction() {
    btnSaveDate.disabled = true;
    btnSaveDate.innerHTML = '<i class="bi-bookmark-heart-fill" role="img" aria-label="rain"></i> Date Saved!';
    
    seeSavedDatesLink.innerText = 'See All Saved Dates';
    seeSavedDatesLink.href ='#';
    btnContainer.appendChild(seeSavedDatesLink);

}

//if see saved dates is clicked
seeSavedDatesLink.addEventListener('click', (event) => {

    //if modal is open close it and remove html in modal
    if(modal.classList.contains('open')){
        removeModal();
    }

    createSavedDates();
});

//create modal where you can see all saved dates from server
function createSavedDates() {
    heroContainer.style.display = 'none';
    resultsContainer.style.display = 'none';
    SavedDatesModal.classList.add('open');
    const savedTitle = document.createElement('h1');
    savedTitle.innerText = 'Saved Dates';

    SavedDatesModal.appendChild(savedTitle);

    //fetch local server to populate dates
    fetch('http://localhost:3000/savedDates') //GET request
    .then(response => response.json())
    .then(json => {
        json.forEach(day => {

            let cityContainer;
            //see if city container already exists. if it doesn't create the container
            if(SavedDatesModal.innerHTML.includes(day.location)){
                cityContainer = document.querySelector(`[data-city='${day.location}']`);
            } else {
                cityContainer = document.createElement('div');
                cityContainer.setAttribute('data-city', `${day.location}`)
                cityContainer.setAttribute('class', 'city-container');
                SavedDatesModal.appendChild(cityContainer);

                const cityContainerTitle = document.createElement('h3');
                cityContainerTitle.innerText = day.location;
                cityContainer.appendChild(cityContainerTitle);
            }

            //create container for date and append to city container
            const dateContainer = document.createElement('div');
            dateContainer.setAttribute('class', 'modal-year-container');
            cityContainer.appendChild(dateContainer);

            //add info to the date container
            createModalSavedDate(day, dateContainer);
        });
    });

}

//populate info for saved date container
function createModalSavedDate(date, container){

    //create title for date container (month)
    const monthitle = document.createElement('h4');
    monthitle.classList.add('modal-year');
    monthitle.innerHTML = `${date.month}`;

    const modalInfo = document.createElement('div');
    modalInfo.setAttribute('class', 'modal-info');

    container.append(monthitle,modalInfo);

    //add day subtitle to container
    const modalSubtitle = document.createElement('p');
    modalSubtitle.classList.add('modal-subtitle');
    modalSubtitle.innerHTML = `<span class="bold">Week ${date.week}:</span> ${date.dayOfWeek}`;

    const info = document.createElement('div');
    info.setAttribute('class', 'day');

    modalInfo.append(modalSubtitle, info);

    //append quickinfo and modal-info to day container
    const quickInfo = document.createElement('div');
    quickInfo.setAttribute('class', 'date-quickinfo');
    const subInfo = document.createElement('div');
    subInfo.setAttribute('class', 'modal-subinfo');

    info.append(quickInfo, subInfo);
    
    //quickinfo for date
    const icon = document.createElement('img');
    icon.setAttribute('class', 'icon');
    icon.src = date.years.icon; 
    const description = document.createElement('p');
    description.setAttribute('class', 'description');
    description.innerText = date.years.description;
    const temperature = document.createElement('p');
    temperature.setAttribute('class', 'temperature');
    temperature.innerHTML = `${date.years.mintemp}&deg;F / ${date.years.maxtemp}&deg;F`;

    quickInfo.append(icon, description, temperature);

    //modal subinfo for day
    const rain = document.createElement('div');
    rain.setAttribute('class', 'info-group');
    const rainDecimal = (date.years.rain).toFixed(2);
    rain.innerHTML = `<i class="bi-cloud-rain" role="img" aria-label="rain"></i><p class="info-title">Precip:</p><p class="info-data">${rainDecimal} mm</p>`;

    const humidity = document.createElement('div');
    humidity.setAttribute('class', 'info-group');
    humidity.innerHTML = `<i class="bi-thermometer-sun" aria-label="humidity"></i><p class="info-title">Humidity:</p><p class="info-data">${date.years.humidity}&#37;</p>`;

    const wind = document.createElement('div');
    wind.setAttribute('class', 'info-group');
    const windMph = (date.years.wind * 0.621371).toFixed(2);
    wind.innerHTML = `<i class="bi-wind" role="img" aria-label="wind"></i><p class="info-title">Wind:</p><p class="info-data">${windMph} mph</p>`;

    const cloudCover = document.createElement('div');
    cloudCover.setAttribute('class', 'info-group');
    cloudCover.innerHTML = `<i class="bi-cloud" role="img" aria-label="cloudcover"></i><p class="info-title">Cloudcover:</p><p class="info-data">${date.years.cloudcover}&#37;</p>`;

    const sun = document.createElement('div');
    sun.setAttribute('class', 'info-group');
    sun.innerHTML = `<i class="bi-sunset" role="img" aria-label="sun hours"></i><p class="info-title">Sun:</p><p class="info-data">${date.years.sun} hrs.</p>`;

    subInfo.append(rain, humidity, wind, cloudCover, sun);
}

//navigation event listener
topNav.addEventListener('click', (event) => {
    const homeBtn = event.path[2].children[0].children[0];
    const datesBtn = event.path[2].children[1].children[0];

    //if home button is clicked show form and calendar info
    if(event.target === homeBtn){
        heroContainer.style.display = "flex";
        resultsContainer.style.display = 'block';
        SavedDatesModal.classList.remove('open');
        SavedDatesModal.innerHTML = '';
    }

    //if saved dates is clicked create saved dates modal
    if(event.target === datesBtn){
        if(SavedDatesModal.innerHTML === ''){
            createSavedDates();

            //switch which links look active
            event.path[2].children[0].classList.remove('pure-menu-selected');
            event.path[2].children[1].classList.add('pure-menu-selected');
        }
        
        
    }

    
});