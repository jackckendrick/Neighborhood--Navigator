// API KEY 5c244caed3676cc031bf4ddf617d7c3d

// API Call 
// https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

// Direct GeoCoding
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

//Instead of referencing travelformbox, try 'formBtn'
var submitBtn = document.querySelector('.travelFormBox');

// try targeting destination list- See line 156
var inputValue = document.getElementById('to');
var currentTemp = document.getElementById('temp');
var weatherDescription = document.getElementById('description')

document.addEventListener('DOMContentLoaded', function(){
//  Gets Geocode information //
function getWeather(event) {
  event.preventDefault()

  // for inputValue, try being able to pass city and state text. If not, try creating another element
  // or try using a different API such as
  // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
  var geoCode = 'https://api.openweathermap.org/geo/1.0/direct?q='+inputValue.value+'&limit=1&appid=5c244caed3676cc031bf4ddf617d7c3d';
  fetch (geoCode)
  .then (function(response) {
      return response.json();
      
  })
// put lat and lon in HTML, and then pull the value as
  .then(function(data) {
      var lat = data[0]['lat'];
      var lon = data[0]['lon'];

      // or use
//.then(funciton(data)){
// var name= data[0]['name'];
// var state= data[0][state];

      // fetches weather API using geodata
      console.log(data)
      var weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid=5c244caed3676cc031bf4ddf617d7c3d&units=imperial';
  
  return fetch (weatherApiUrl); 
          
  })

  // Then this instructs to give response in JSON format
  .then (function (response) {
      return response.json();
      
  })

  .then (function (data) {
    console.log(data)
       var tempValue = data['main']['temp'];
       var descrValue = data['weather'][0]['description'];
       currentTemp.innerHTML = 'Temperature:' +tempValue; 
       weatherDescription.innerHTML = 'Description:' +descrValue;
    
       return data;
   })

}

submitBtn.addEventListener('submit', getWeather);

})

// Alternative method \\
//button.addEventListener('click', function(){

    //fetch('https://api.openweathermap.org/data/2.5/forecast?q='+inputValue.value+'&appid=5c244caed3676cc031bf4ddf617d7c3d')
    //.then(function (response){
        //return response.json();
    //})
    //.then(function(console.log(data));
   // })

