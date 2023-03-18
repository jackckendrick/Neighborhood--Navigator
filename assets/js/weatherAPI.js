// API KEY 5c244caed3676cc031bf4ddf617d7c3d

// API Call 
// https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

// Direct GeoCoding
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

var formBtn = document.getElementById('formBtn');
var inputValue = document.getElementById('to');
var temp = document.getElementById('temp');

document.addEventListener('DOMContentLoaded', function(){

    function getWeather() {
        // 'inputValue.value' refers to the users destination input. Need to replace this and generate a Geo coordinate function.
        var weatherApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q='+inputValue.value+'&appid=5c244caed3676cc031bf4ddf617d7c3d';
    
        // calls weather API
        fetch (weatherApiUrl)
    
        // Then this instructs to give response in JSON format
        .then (function (response) {
            return response.json();
        })
        
        // This grabs the specific data we went to display
        // console.log states that 'temp' cannot 
        .then (function (data) {
               var tempValue = data['main']['temp'];
               var descrValue = data['weather'][0]['description'];
               temp.innerHTML = tempValue; 
               temp.innerHTML = descrValue;
           })
    
        // then this loops over the data and generates a table and rows. 
        .then(function (data){
            console.log(data)
            for (var i = 0; i <data.length; i++) {
        // these vars are established to be used to create the table row 'tr', table data 'td', and type of data which will be displayed 
        // in the form of text via 'createTextNode'.
                var createTableRow = document.getElementById('tr');
                var tableData = document.getElementById('td');
                var text = document.createTextNode(data[i].name);
    
                tableData.appendChild(text);
                createTableRow.appendChild(tableData);
                temp.appendChild(createTableRow);
            }
    
        })
    }
    
    // this activates the function when the button is clicked. 
    //'formBtn' is the var which refers to the 'formBtn' HTML id.
    // 'addEventListener' is the method used on the 'formBtn'
    // 'click' is the user action
    // 'getWeather' is function activated
    
    formBtn.addEventListener('click', getWeather);
})
// Alternative method \\
//button.addEventListener('click', function(){

    //fetch('https://api.openweathermap.org/data/2.5/forecast?q='+inputValue.value+'&appid=5c244caed3676cc031bf4ddf617d7c3d')
    //.then(function (response){
        //return response.json();
    //})
    //.then(function(console.log(data));
   // })

