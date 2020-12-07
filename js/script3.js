/*import  {currentWeatherByGeolocationRequest}  from './apiweather.js';
import  {forecast5ByCityNameRequest}  from './apiweather.js';*/

//https://developer.mozilla.org/es/docs/Web/API/URL/URL
//https://openweathermap.org/forecast5#name5
//https://openweathermap.org/current#severalid
//https://stackoverflow.com/questions/55192579/chartjs-displays-numbers-not-time

/*let myGeoLatitude = localStorage.getItem('geoLatitude');
let myGeoLongitude = localStorage.getItem('geoLongitude');

console.log(myGeoLatitude,myGeoLongitude);*/

let mypathname = window.location.pathname;
let pathnameDirectory = mypathname.substr(0, mypathname.lastIndexOf('/'));
let mybasePath = window.location.origin;
let hourlyChart;
let myBar;
let timeFormat = 'MM/DD/YYYY HH:mm';
//alert(basePath);


const getIndexNextDay = (oldIndex) => {
    let registerByDay = 8;
    if (oldIndex === -1){
        return 0
    } else {
        return oldIndex + registerByDay;
    }
};

const getForescatsBy5Day = (jsonData) => {
    let totalDays = 5;
    let forecastArray = [];
    let currentIndex = -1;

    try{
        for (let i = 0 ; i < totalDays; i++)
        {
            currentIndex = getIndexNextDay(currentIndex);
            forecastArray[i] = jsonData.list[currentIndex];
        }
        console.log(forecastArray);
    } catch (e) {
        console.error(e);
    } finally {
        return forecastArray;
    }
};

const getDayName = (date) => {
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
};

const getDayDataSet = (daysArray) => {
    let dataSetArray = [];

    try{
        let label = new Array();
        let tempData = []

        daysArray.forEach((item,index) => {
            const dateTime = new Date(item.dt * 1000);
            const dayName = getDayName(dateTime);
            const dayNumber = dateTime.getDate(); //number
            let minValueFloating = item.main.temp_min;
            let maxValueFloating = item.main.temp_max;

            //label[index] = [item.dt,"max: "+item.main.temp_max+"°C","min: "+item.main.temp_min+"°C",item.weather[0].main];
            label[index] = [dayName +" " + dayNumber,"max: "+item.main.temp_max+"°C","min: "+item.main.temp_min+"°C",item.weather[0].main];

            if (minValueFloating < maxValueFloating) {
                tempData[index] = [minValueFloating,item.main.temp_max];
            }else {
                tempData.push(item.main.temp);
            }

            //tempData.push(item.main.temp);
            //tempData[index] = [minValueFloating,item.main.temp_max];
        });

        dataSetArray.push(label);
        dataSetArray.push(tempData);
        console.log(dataSetArray);
    } catch (e) {
        console.error(e);
    } finally {
        return dataSetArray;
    }
};

const getDailyDataSet = (dailyArray) => {
    let dataSetArray = [];

    try{
        let label = new Array();
        let tempData = []
        let cont = 1;

            dailyArray.forEach((item, index) => {
                if (index < 5) {
                    const dateTime = new Date(item.dt * 1000);
                    const dayName = getDayName(dateTime);
                    const dayNumber = dateTime.getDate(); //number
                    let minValueFloating = item.temp.min;
                    let maxValueFloating = item.temp.max;

                    //label[index] = [item.dt,"max: "+item.main.temp_max+"°C","min: "+item.main.temp_min+"°C",item.weather[0].main];
                    label[index] = [dayName + " " + dayNumber, "max: " + maxValueFloating + "°C", "min: " + minValueFloating + "°C", item.weather[0].main];

                    if (minValueFloating < maxValueFloating) {
                        tempData[index] = [minValueFloating, maxValueFloating];
                    } else {
                        tempData.push(item.temp.day);
                    }
                }

            });


        dataSetArray.push(label);
        dataSetArray.push(tempData);
        console.log(dataSetArray);
    } catch (e) {
        console.error(e);
    } finally {
        return dataSetArray;
    }
};


function newDate(days) {
    return moment().add(days, 'd').toDate();
}

function newDateString(days) {
    return moment().add(days, 'd').format(timeFormat);
}

const getHourlyDataSet = (hourlyArray) => {
    let dataSetArray = [];

    try{
        let label = new Array();
        let tempData = []

        hourlyArray.forEach((item,index) => {
            let hourValue = {};
            const dateTime = new Date(item.dt * 1000);
            const dayNumber = dateTime.getDate(); //number
            let hour = dateTime.getHours().toString();
            hour = String(hour).padStart(2, '0') +":00";

           // {x: newDateString(dayNumber),y: item.temp}//I replace newDateString with  hour: 'hA'
            tempData.push( {x: dateTime,y: item.temp});
        });
        dataSetArray.push(label);
        dataSetArray.push(tempData);
        console.log(dataSetArray);
    } catch (e) {
        console.error(e);
    } finally {
        return dataSetArray;
    }
};

/*const displayHourlyWeather = (dataSet) => {
    return new Promise(resolve => {
        try {
            console.log();
            var ctx = document.getElementById('canvas3').getContext('2d');
            Chart.defaults.global.defaultFontColor = 'white';
            myBar = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dataSet[0],
                    datasets: [{
                        label: 'Date',
                        backgroundColor: [
                            window.chartColors.red,
                            window.chartColors.orange,
                            window.chartColors.yellow,
                            window.chartColors.green,
                            window.chartColors.blue,
                            window.chartColors.purple,
                            window.chartColors.red
                        ],
                        yAxisID: 'y-axis-1',
                        data: dataSet[1]
                        // data: [[5,6], [-3,-6]],
                    },/!*{
                 label: 'City2',
                 backgroundColor: window.chartColors.grey,
                 yAxisID: 'y-axis-2',
                 data: dataSet[1]
             }*!/]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Chart',
                        fontColor: 'rgb(255, 255, 255)'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false
                    },
                    responsive: true,
                    scales: {
                        yAxes: [{
                            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                            display: true,
                            position: 'left',
                            id: 'y-axis-1'
                        }, {
                            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                            display: true,
                            position: 'right',
                            id: 'y-axis-2',
                            gridLines: {
                                drawOnChartArea: false
                            }
                        }],
                    },
                    legend: {
                        display: true,
                        labels: {
                            fontColor: 'rgb(255, 99, 132)'
                        }
                    }
                }
            });

        }catch(e) {
            console.error(e);
        }
    });
};*/

const displayHourlyWeather = (dataSet) => {
    return new Promise(resolve => {
        try {
            console.log();
            var color = Chart.helpers.color;
            var config = {
                type: 'line',
                data: {
                    labels: dataSet[0],
                    datasets: [ {
                        label: 'Date',
                        backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
                        borderColor: window.chartColors.green,
                        fill: false,
                        data:dataSet[1] ,
                    }]
                },
                options: {
                    title: {
                        text: ' Time Scale'
                    },
                    scales: {
                        xAxes: [{
                            type: 'time',
                            time: {
                               /* parser: timeFormat,
                                // round: 'day'
                                tooltipFormat: 'll HH:mm'*/
                                displayFormats: {
                                    hour: 'hA'  //Format
                                }
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Date'
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Temperature °C'
                            }
                        }]
                    },
                    elements: {
                        line: {
                            tension: 0.000001  //linea templada
                        }
                    },
                }
            }

            var ctx = document.getElementById('canvas1').getContext('2d');
            Chart.defaults.global.defaultFontColor = 'white';
            hourlyChart = new Chart(ctx, config);
        }catch(e) {
            console.error(e);
        }
    });
};

const displayDailyWeather = (dataSet) => {
    return new Promise(resolve => {
        try {
            console.log();
            var ctx = document.getElementById('canvas3').getContext('2d');
            Chart.defaults.global.defaultFontColor = 'white';
            myBar = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dataSet[0],
                    datasets: [{
                        label: 'Date',
                        backgroundColor: [
                            window.chartColors.red,
                            window.chartColors.orange,
                            window.chartColors.yellow,
                            window.chartColors.green,
                            window.chartColors.blue,
                            window.chartColors.purple,
                            window.chartColors.red
                        ],
                        yAxisID: 'y-axis-1',
                        data: dataSet[1]
                        // data: [[5,6], [-3,-6]],
                    },/*{
                 label: 'City2',
                 backgroundColor: window.chartColors.grey,
                 yAxisID: 'y-axis-2',
                 data: dataSet[1]
             }*/]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Chart',
                        fontColor: 'rgb(255, 255, 255)'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false
                    },
                    responsive: true,
                    scales: {
                        yAxes: [{
                            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                            display: true,
                            position: 'left',
                            id: 'y-axis-1'
                        }, {
                            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                            display: true,
                            position: 'right',
                            id: 'y-axis-2',
                            gridLines: {
                                drawOnChartArea: false
                            }
                        }],
                    },
                    legend: {
                        display: true,
                        labels: {
                            fontColor: 'rgb(255, 99, 132)'
                        }
                    }
                }
            });
        }catch(e) {
            console.error(e);
        }
    });
};


 const  fillDataSet = (dataSet) => {
     console.log();
    var ctx = document.getElementById('canvas2').getContext('2d');
     Chart.defaults.global.defaultFontColor = 'white';
     myBar = new Chart(ctx, {
         type: 'bar',
         data: {
             labels: dataSet[0],
             datasets: [{
                 label: 'Date',
                 backgroundColor: [
                     window.chartColors.red,
                     window.chartColors.orange,
                     window.chartColors.yellow,
                     window.chartColors.green,
                     window.chartColors.blue,
                     window.chartColors.purple,
                     window.chartColors.red
                 ],
                 yAxisID: 'y-axis-1',
                 data: dataSet[1]
                // data: [[5,6], [-3,-6]],
             },/*{
                 label: 'City2',
                 backgroundColor: window.chartColors.grey,
                 yAxisID: 'y-axis-2',
                 data: dataSet[1]
             }*/]
         },
         options: {
              title: {
                 display: true,
                 text: 'Chart',
                  fontColor: 'rgb(255, 255, 255)'
             },
             tooltips: {
                 mode: 'index',
                 intersect: false
             },
             responsive: true,
             scales: {
                 yAxes: [{
                     type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                     display: true,
                     position: 'left',
                     id: 'y-axis-1'
                 }, {
                     type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                     display: true,
                     position: 'right',
                     id: 'y-axis-2',
                     gridLines: {
                         drawOnChartArea: false
                     }
                 }],
             },
             legend: {
                 display: true,
                 labels: {
                     fontColor: 'rgb(255, 99, 132)'
                 }
             }
         }
     });
 };




document.getElementById('randomizeData').addEventListener('click', function() {
    barChartData.datasets.forEach(function(dataset) {
        dataset.data = dataset.data.map(function() {
            return randomScalingFactor();
        });
    });
    myBar.update();
});




/************************ SHOW DATA *******************************************/
/**
 * Display data in code element with JSON.stringify
 */
/*
const displayJSONCode = (jsonData) =>{
    let stringData =  JSON.stringify(jsonData,undefined, 2);
    let node = document.createElement("code");
    let textNode = document.createTextNode("");
    node.setAttribute("id","codeTarget"); // with value "" is null

    node.appendChild(textNode);
    document.querySelector("#target2").appendChild(node);
    document.querySelector("#target2").style.textAlign = "left";
    document.querySelector("#codeTarget").innerHTML = "<pre>"+stringData+"</pre>";
}
*/

/**
 * Display data in elements html
 */
/*const displayData = (jsonData) =>{
    let templateElement = document.querySelector("#tpl-hero");
    let targetElement = document.querySelector("#target");

    jsonData.forEach(item => {
        let cloneNode = templateElement.content.cloneNode(true);
        cloneNode.querySelector(".name").innerHTML = item.name;
        cloneNode.querySelector(".alter-ego").innerHTML = item.alterEgo;
        cloneNode.querySelector(".powers").innerHTML = item.abilities.toString();
        document.querySelector("#target").appendChild(cloneNode);
    });
}*/

const displayItemCurrentData = (itemData) =>{
    return new Promise(resolve => {
        try {
            console.log(itemData);
            let src = "http://openweathermap.org/img/wn/";
            let srcExt = "@4x.png";
            let targetElement = document.querySelector("#one-current-weather");
           // let iconNode = document.createElement("img");
          //  let icon = itemData.daily[0].weather[0].icon;
         //   let imgUrl = "./img/" +icon+ ".jpg";

          //  document.body.setAttribute("style","background-image: url(" +imgUrl +");background-repeat: no-repeat;background-size: contain");

            targetElement.querySelector(".cu_1").innerHTML = itemData.current.temp;
            targetElement.querySelector(".unit-temperature").innerHTML = "°C";
             if (itemData.current.rain !== undefined){
                 targetElement.querySelector(".cu_2").innerHTML = itemData.current.rain[0].toString();
             }
             else {
                 targetElement.querySelector(".cu_2").innerHTML = "0";
             }
            targetElement.querySelector(".unit-rain").innerHTML =  "mm";
            targetElement.querySelector(".cu_3").innerHTML = itemData.current.clouds;
            targetElement.querySelector(".unit-percent").innerHTML = "%";
            targetElement.querySelector(".cu_4").innerHTML = itemData.current.humidity;
            targetElement.querySelector(".unit-percent").innerHTML =  "%";
            targetElement.querySelector(".cu_5").innerHTML = itemData.current.dew_point;
            targetElement.querySelector(".unit-temperature").innerHTML =  "°C";
            targetElement.querySelector(".cu_6").innerHTML = itemData.current.pressure;
            targetElement.querySelector(".unit-pressure").innerHTML = "hPa";
            targetElement.querySelector(".cu_7").innerHTML = itemData.current.wind_speed;
            targetElement.querySelector(".unit-speed").innerHTML = "m/s";
            targetElement.querySelector(".cu_8").innerHTML = itemData.current.uvi;
            targetElement.querySelector(".unit-uvindex").innerHTML = "/10";
            targetElement.querySelector(".cu_9").innerHTML = itemData.current.visibility;
            targetElement.querySelector(".unit-visibility").innerHTML = "m";

            //    targetElement.querySelector("#large-title").innerHTML = itemData.name + " weather";

/*            iconNode.setAttribute("src",`${src}${icon}${srcExt}`);
            targetElement.querySelector(".focusWeatherId").appendChild(iconNode);*/
        }
        catch(e) {
            console.error(e);
        }
    });
};

const displayItemDataWeather = (itemData) =>{
    return new Promise(resolve => {
        try {
            console.log(itemData);
            let src = "http://openweathermap.org/img/wn/";
            let srcExt = "@4x.png";
            let targetElement = document.querySelector("#current-weather");
            let iconNode = document.createElement("img");
            let icon = itemData.daily[0].weather[0].icon;
            let imgUrl = "./img/" +icon+ ".jpg";

            document.body.setAttribute("style","background-image: url(" +imgUrl +");background-repeat: no-repeat;background-size: contain");

            targetElement.querySelector(".max").innerHTML = itemData.daily[0].temp.max + "°";
            targetElement.querySelector(".min").innerHTML = itemData.daily[0].temp.min+ "°";
            targetElement.querySelector(".des").innerHTML = itemData.daily[0].weather[0].description;
        //    targetElement.querySelector("#large-title").innerHTML = itemData.name + " weather";

            iconNode.setAttribute("src",`${src}${icon}${srcExt}`);
            targetElement.querySelector(".focusWeatherId").appendChild(iconNode);
        }
         catch(e) {
            console.error(e);
        }
    });
};

/**
 * Display data in elements html
 */
const displayItemDataHero = (itemData) =>{
    return new Promise(resolve => {
        console.log(itemData);
        let src = "http://openweathermap.org/img/wn/";
        let srcExt = "@4x.png";
        let targetElement = document.querySelector("#hero-weather");
        let iconNode = document.createElement("img");
        let icon = itemData.current.weather[0].icon;
        let imgUrl = "./img/" +icon+ ".jpg";
        //let myurl = new URL(pathnameDirectory +"/img/10n.jpg", mybasePath);
        let myurl = new URL(pathnameDirectory +"/img/"+icon+".jpg", mybasePath);

        document.body.setAttribute("style","background-image: url(" +imgUrl +");background-repeat: no-repeat;background-size: contain");

        targetElement.querySelector(".parallax-temp").innerHTML = itemData.current.temp;
        targetElement.querySelector(".parallax-temp-unit").innerHTML = "°C";
        targetElement.querySelector(".parallax-overview").innerHTML = itemData.current.weather[0].description;
       //AQUI FALTA
      //  targetElement.querySelector("#large-title").innerHTML = itemData.name + " weather";

        iconNode.setAttribute("src",`${src}${icon}${srcExt}`);
        targetElement.querySelector(".parallax-weatherId").appendChild(iconNode);
    });
}



/*******************************CALL API *********************************************************/
/**
 * This async function use fetch to make request API forecast 5 days By City Name
 * @param All parameters are requerided
 */
const forecast5ByCityNameRequest = async (cityName) => {
    const basePathAPI = "http://api.openweathermap.org";
    const keyAPI = "fecb38509801841509434bd9c74070e8";
    let units = "metric";
    let path = `${basePathAPI}/data/2.5/forecast?q=${cityName}&units=${units}&appid=${keyAPI}`;
    console.log("FORECAST PATH");
    console.log(path);
    return await fetch(path,{});
}

/**
 * This async function use fetch to make request API current Weather By Geolocation
 * @param All parameters are requerided
 */
const oneCallAPIRequest = async (latitude,longitude) => {
    const basePathAPI = "http://api.openweathermap.org";
    const keyAPI = "fecb38509801841509434bd9c74070e8";
    let units = "metric";
    let path = `${basePathAPI}/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=${units}&exclude=minutely,alerts&appid=${keyAPI}`;
   //  ://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=minutely,alerts&appid=6d8f4ab095107d93c2331b5fb434dcb5
    console.log("ONE CALL PATH");
    console.log(path);
    return await fetch(path,{});
}


/************************** CALL API ***********************************************/
const callAPIByCityName = (city) => {

    try {
        let forecast5Response = forecast5ByCityNameRequest(city);
        console.log(forecast5Response);
        forecast5Response
            .then((response) => {
                console.log(response);
                return (response.json());
            })
            .then((data) => {
                console.log(data);

                getDayDataSet(getForescatsBy5Day(data));
                fillDataSet(getDayDataSet(getForescatsBy5Day(data)));

              //  displayItemData(data);
                //displayJSONCode(data);
            })
            .catch(error => {
                console.error(error.name);
                console.error(error.message);
                console.error(error.stack);
            });
    } catch(error) {
        console.error(error.name);
        console.error(error.message);
        console.error(error.stack);
    }
};

const asyncInPromiseAll = async (fun1, fun2, fun3, fun4, fun5) => {
    const label = 'test async functions with Promise.all';
    try {
        console.time(label);
       // let [value1, value2] = await Promise.all([fun1(), fun2()]);
        await Promise.all([fun1, fun2, fun3, fun4, fun5]);
        console.timeEnd(label);
    } catch (e) {
        console.error('error is', e);
        console.timeEnd(label);
    }
};

const callOpenWeatherAPI = async(latitude,longitude) => {

    try {
        let oneCallResponse = oneCallAPIRequest(latitude,longitude);
        console.log(oneCallResponse);
        oneCallResponse
            .then((response) => {
                console.log(response);
                return (response.json());
            })
            .then((data) => {
                console.log(data);

                asyncInPromiseAll(displayItemDataHero(data),
                    displayItemDataWeather(data),
                    displayItemCurrentData(data),
                    displayHourlyWeather(getHourlyDataSet(data.hourly)),
                    displayDailyWeather(getDailyDataSet(data.daily)));
                //displayJSONCode(data);
            })
            .catch(error => {
                console.error(error.name);
                console.error(error.message);
                console.error(error.stack);
            });
    } catch(error) {
        console.error(error.name);
        console.error(error.message);
        console.error(error.stack);
    }
};

/*************** Geolocation **************************************************/
/* *
 * https://www.tutorialspoint.com/html5/geolocation_getcurrentposition.htm
 * coded by tutorialspoint
 *
 */
function showLocation(position) {
    var geoLatitude = position.coords.latitude;
    var geoLongitude = position.coords.longitude;
    // alert("Latitude : " + geoLatitude + " Longitude: " + geoLongitude);

    /*   localStorage.setItem('geoLatitude', geoLatitude.toString());
       localStorage.setItem('geoLongitude', geoLongitude.toString());*/
    console.log(geoLatitude.toString(),geoLongitude.toString());

    callOpenWeatherAPI(geoLatitude.toString(),geoLongitude.toString());
    callAPIByCityName("Ghent");
}

function errorHandler(err) {
    if(err.code == 1) {
        alert("Error: Access is denied!");
    } else if( err.code == 2) {
        alert("Error: Position is unavailable!");
    }
}

function getLocation() {

    if(navigator.geolocation) {

        // timeout at 60000 milliseconds (60 seconds)
        var options = {timeout:60000};
        navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
       // fillDataSet();
    } else {
        alert("Sorry, browser does not support geolocation!");
    }
}



document.querySelector("#search").addEventListener("click",()=>{

   let cityName =  document.querySelector("#cityName").value;
    fetch('./openweather/city.list.json')
        .then(response => response.json())
        .then(jsonResponse => {
           // console.log(jsonResponse);
           let city =  jsonResponse.filter(data => data.name.toUpperCase() === cityName.toUpperCase());
            if ( city !== undefined && city[0] !== undefined){
                console.log(city);
                 callOpenWeatherAPI(city[0].coord.lat,city[0].coord.lon);
            }       })
        .catch( e => {
            console.error(e);
        });

});





window.onload = getLocation();