// API KEY 5c244caed3676cc031bf4ddf617d7c3d

// API Call 
// https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

// Direct GeoCoding
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

//Instead of referencing travelformbox, try 'formBtn'
var formBtn = document.getElementById('formbtn');

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



let tripDuration // Trip duration global var
let lastAddress // Trip last address
let lastCoordinates // Trip last coordinates
let globalMap
// ~~~ Map Start ~~~ //

var destinationListEl = $('#timeSpentUl')
var formBtn = document.getElementById('formBtn');
const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();

// Creates the map function, fragile do not touch //
function initMap() {
  const map = new google.maps.Map(document.getElementById("googleMap"), {
    zoom: 4,
    center: {lat: 40.116386, lng: -101.299591},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  globalMap = map

  directionsRenderer.setMap(map);
  
  // Button to update locations //
  document.getElementById("formBtn").addEventListener("click", function(event){
    event.preventDefault();
    calcRoute(directionsService, directionsRenderer);
    handleFormSubmit();
  });
  
}
// Calculates and display travel distance and time, fragile do not touch//
function calcRoute(directionsService, directionsRenderer) {
  let selectedMode = document.getElementById("mode").value;
  let request = {
    origin: document.getElementById('from').value,
    destination: document.getElementById('to').value,
    travelMode: google.maps.TravelMode[selectedMode],
    unitSystem: google.maps.UnitSystem.IMPERIAL
  }
  directionsService.route(request, (result, status) => {
    if (status == google.maps.DirectionsStatus.OK) {
      const output = document.querySelector('#output')
      output.innerHTML = "<div> From: " + document.getElementById('from').value + ".<br /> To: " + document.getElementById('to').value + ". <br /> Driving Distance " + result.routes[0].legs[0].distance.text + ".<br /> Duration " + result.routes[0].legs[0].duration.text + ". </div>";
      directionsRenderer.setDirections(result);
      tripDuration = result.routes[0].legs[0].duration.text;
      endAddress = result.routes[0].legs[0].end_address;
      lastAddress = endAddress;
      geocode();
    } else {
      directionsRenderer.setDirections({routes: []});
      map.setCenter(center);
      output.innerHTML = "<p>Can't drive there mate.</p>"
    }
  });
}

//  Gets Geocode information //
function geocode() {
  geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': lastAddress}, function(results, status) {
    if (status == 'OK') {

      let lng = results[0].geometry.location.lng();
      let lat = results[0].geometry.location.lat();
      lastCoordinates = {
        lat: lat,
        lng: lng
      }
      
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

nearbyBtn = document.getElementById('nearbyBtn');
nearbyBtn.addEventListener('click', nearbySearch);

// Broken Search Nearby //
function nearbySearch(){
  var prevLocation = new google.maps.LatLng(lastCoordinates.lat, lastCoordinates.lng);

let typeSelection = document.getElementById('recommendOptions').selectedOptions[0].value;

  var request = {
    location: prevLocation,
    radius: '1500',
    type: [typeSelection]
  };

  service = new google.maps.places.PlacesService(globalMap);
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  console.log(results);
  console.log(status);
}


// Auto Fill //
const input1 = document.getElementById('from');
const input2 = document.getElementById('to');
const autocompleteOptions = {
  fields: ["formatted_address", "geometry", "name"],
  strictBounds: false,
  types: ["geocode", "establishment" ]
}


const autocomplete1 = new google.maps.places.Autocomplete(input1, autocompleteOptions);
const autocomplete2 = new google.maps.places.Autocomplete(input2, autocompleteOptions);

// Time

let timeList = document.getElementById('timeAssumed');
let combiTime = tripDuration + timeList.value;



// Adds destination address to unordered list
function handleFormSubmit(event) {
  
  var destinationTo = $('input[name="GoingTo"]').val();
  totTime = combiTime;
  
  if (!destinationTo) {
    console.log('No destination specified');
    return;
  }
  
  var destinationListBoxEl = $(
    '<li class="flex-row justify-space-between align-center p-2 bg-light text-dark">'
    );
    destinationListBoxEl.text(destinationTo + totTime);
    
    // add delete button to remove destination from list
    destinationListBoxEl.append(
      '<button class="btn btn-danger btn-small delete-item-btn">Remove</button>'
      );
      // print to the page
      destinationListEl.append(destinationListBoxEl);
      
    }
    
    function handleRemoveItem(event) {
      // convert button we pressed (`event.target`) to a jQuery DOM object
      var removeBtnClicked = $(event.target);
      
      // get the parent `<li>` element from the button we pressed and remove it
      removeBtnClicked.parent('li').remove();
    }
    
    // use event delegation on the `destinationListEL` to listen for click on any element with a class of `delete-item-btn`
    destinationListEl.on('click', '.delete-item-btn', handleRemoveItem);
    
    
    
    // ~~~ Map End ~~~ Recommended Start ~~~ Experimental //
    
//   autocomplete2.addListener('place_changed', searchNearbyPlaces);
  
//   document.getElementById('recommendOptions').onchange = searchNearbyPlaces;
  
//   function searchNearbyPlaces() {
//       // document.getElementById('places').innerHTML = ''
//       // Get the place details from the autocomplete object.
//       var place = autocomplete2.getPlace();
//       console.log(place);
    
//       // Create a map centered at the location entered in the autocomplete field.
//       map = new google.maps.Map(document.getElementById('googleMap'), {
//           center: place.geometry.location,
//   zoom: 15
// });
  
//   // Perform a nearby search for places of type 'store'.
//   service = new google.maps.places.PlacesService(map);
//   service.nearbySearch({
//     location: place.geometry.location,
//     radius: '500',
//     type: [document.getElementById('type').value]
//   }, callback);
// }

// function callback(results, status) {
//   if (status === google.maps.places.PlacesServiceStatus.OK) {
//     console.log(results.length)
//     for (var i = 0; i < results.length; i++) {
//       createMarker(results[i]);
//     }
//   }
// }

// function createMarker(place) {
//   console.log(place);
//   var table = document.getElementById("places");
//   var row = table.insertRow();
//   var cell1 = row.insertCell(0);
//   cell1.innerHTML = place.name;
//   if (place.photos) {
//     let photoUrl = place.photos[0].getUrl();
//     let cell2 = row.insertCell(1);
//     cell2.innerHTML = `<img width="300" height="300" src="${photoUrl}"/>`;
//   } else {
//     let cell2 = row.insertCell(1);
//     cell2.innerHTML = "No photo available";
//   }
// }

//Starts it all//

window.onload = initMap();