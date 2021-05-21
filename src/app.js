const apiKey = 'fba8c59e3a5f9d7d2ed8d4014b3ddc97';
const form = document.getElementById('form')
const today = new Date()
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
let year1;
let year2;
let year3;
let year4;
let year5;

console.log(`current date: ${currentMonth} ${currentYear}`)


function fetchSubmit(location, month , year, endDate) {
    fetch(`http://api.weatherstack.com/historical?access_key=${apiKey}&query=${location}&historical_date_start=${year}-${month}-01&historical_date_end=${year}-${month}-${endDate}&hourly=1&interval=12&units=f`)
    .then(response => response.json())
    .then(object => console.log(object));

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
    //.log('the month starts on: ' + firstDayOfWeek)

    //changing month into correct format for URL
    if (monthInput < 10) {
    monthInput = `0${monthInput + 1}`
    } 
    //console.log(`month to pass into URL: ${monthInput}`)

    //fetchSubmit(locationInput, monthInput, year1, numDays)
    

    console.log(timeframeInput)
    
    switch(timeframeInput) {
        case 4:
            //console.log('run fetch five times ' + year5);
            fetchSubmit(locationInput, monthInput, year5, '02');
        case 3:
            //console.log('run fetch four times ' + year4);
            fetchSubmit(locationInput, monthInput, year4, '02');
        case 2:
            //console.log('run fetch three times ' + year3);
            fetchSubmit(locationInput, monthInput, year4, '02');
        case 1:
            //console.log('run fetch twice ' + year2);
            fetchSubmit(locationInput, monthInput, year4, '02');
        case 0:
            //console.log('run fetch once ' + year1);
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







