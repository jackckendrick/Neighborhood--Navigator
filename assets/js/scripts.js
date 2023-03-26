let tripDuration // Trip duration global var
let lastAddress // Trip last address
let lastCoordinates // Trip last coordinates
let globalMap
let markers = [];
const now = dayjs();



// ~~~ Map Start ~~~ //

var destinationUnorderedList = $('#timeSpentUl')
var formBtn = document.getElementById('formBtn');
const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();
const output = document.querySelector('#output')
// Creates the map function, fragile do not touch //
function initMap() {
  const map = new google.maps.Map(document.getElementById("googleMap"), {
    zoom: 4,
    center: {lat: 40.116386, lng: -101.299591},
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: false,
    mapTypeControl: false,
    fullScreenControl: false
  });
  globalMap = map
  
  directionsRenderer.setMap(map);
  
  // Button to update locations //
  document.getElementById("formBtn").addEventListener("click", function(event){
    event.preventDefault();
    calcRoute(directionsService, directionsRenderer);
  });
  
}

// Cannot be moved
var arrivalTimes = [];
var durations = [];
// Calculates and display travel distance and time to the output container and the timeSpentUl, fragile do not touch//
async function calcRoute(directionsService, directionsRenderer) {
  let selectedMode = document.getElementById("mode").value;
  let request = {
    origin: document.getElementById('from').value,
    destination: document.getElementById('to').value,
    travelMode: google.maps.TravelMode[selectedMode],
    unitSystem: google.maps.UnitSystem.IMPERIAL
  }
  directionsService.route(request, async (result, status) => {
    if (status == google.maps.DirectionsStatus.OK) {
      const output = document.querySelector('#output')
      output.innerHTML = "<div> From: " + document.getElementById('from').value + ".<br /> To: " + document.getElementById('to').value + ". <br /> Distance " + result.routes[0].legs[0].distance.text + ". || Duration " + result.routes[0].legs[0].duration.text + ". </div>";
      
      directionsRenderer.setDirections(result);
      
      tripDuration = result.routes[0].legs[0].duration.text;
      endAddress = result.routes[0].legs[0].end_address;
      lastAddress = endAddress;
      try {
        await geocode();
        await getWeather(); 
        await storeLocation();
        await time();
        swapForm();
      } catch (error) {
        alert(error);
      }

    } else {
      directionsRenderer.setDirections({routes: []});
      map.setCenter(center);
      output.innerHTML = "<p>Can't drive there mate.</p>"
    }


    var nextArrivalTime;
    function time() {
      var destinationListArray = [];
      var destinationListItem = $('<li class="destinationLi transition-fade">');
      var from = document.getElementById('from').value;
      var to = document.getElementById('to').value;
      var duration = result.routes[0].legs[0].duration.text;
      var distance = result.routes[0].legs[0].distance.text;
      var startTime;
      var arrivalTime;
      var currentTime = dayjs().format('h:mm A');
      
      var timeArray = duration.split(" ");
      var hours = parseInt(timeArray[0]);
      var minutes = parseInt(timeArray[2]);
      var hourMinutes = hours * 60;
        minutes = hourMinutes + minutes;
        
        if (destinationListArray.length === 0) {
            // Set the start time of the first list item as the current time
            startTime = currentTime;
        } else {
          for (var i=0; i<destinationListArray.length; i++) {
            
            }
            
        }
        if (duration.length > 8) {
          console.log(timeArray);
          arrivalTime = dayjs().add(minutes, "minute").format("h:mm A");
        } else {
          var travelTime = parseInt(duration);
          arrivalTime = dayjs().add(travelTime, "minute").format("h:mm A");
        }
        arrivalTimes.push(arrivalTime)
        durations.push(parseInt(duration));
        console.log(durations);

        // Set the current arrival time as the last arrival time for the next card
        lastArrivalTime = arrivalTime;
        console.log(arrivalTime);
        if(arrivalTimes.length > 1){
          startTime = arrivalTimes[arrivalTimes.length -2];
          minutesAdded = dayjs([arrivalTimes.length -2].value).add(minutes, "minute").format("h:mm A")
          console.log(minutesAdded);
        }
        let total = 0
        let totalSubtract = 0
        for (let i = 0; i < durations.length; i++) {
          total += durations[i];
        }

        for (let i = 0; i < durations.length - 1; i++) {
          totalSubtract += durations[i];
        }

        if(durations.length>1){
          arrivalTime = dayjs().add(total, "minute").format("h:mm A")
          startTime = dayjs().add(totalSubtract, "minute").format("h:mm A")
        }
        console.log(total);
        console.log(totalSubtract)

        const formattedText = `
        <p>From: ${from}<br />To: ${to}<br />Duration: ${duration} || Distance: ${distance}<br />Start: ${startTime} || Arrival: ${arrivalTime}<br />Weather<br />${weatherTemp}F || ${weatherDescr}</p>
        `;
        // destinationList.push(destinationUnorderedList);
        destinationListItem.html(formattedText);
        destinationListArray.push(destinationListItem);
        destinationListItem.append('<button class="btn delete-item-btn blue hoverIntBtn">Remove</button>');
        destinationUnorderedList.append(destinationListItem);
        setTimeout(() => {
          destinationListItem.addClass('visible mdOpacity');
        }, 50);
    }
    
  });
}

        //  Gets Geocode information //



//  Gets Geocode information, called in directionsService //

function geocode() {
  geocoder = new google.maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode({ 'address': lastAddress }, function (results, status) {
      if (status == 'OK') {
        let lng = results[0].geometry.location.lng();
        let lat = results[0].geometry.location.lat();
        lastCoordinates = {
          lat: lat,
          lng: lng
        };
        resolve(lastCoordinates);
      } else {
        reject('Geocode was not successful for the following reason: ' + status);
      }
    });
  });
}

// Swaps the location input forms on submit, called in directionsService //
function swapForm() {
  const lastAddress = localStorage.getItem('lastAddress'); // retrieve lastAddress from local storage
  document.getElementById('from').value = lastAddress; // update the input fields with the new values
  document.getElementById('to').value = '';
}


// Search Nearby //
nearbyBtn = document.getElementById('nearbyBtn');
nearbyBtn.addEventListener('click', nearbySearch);


function nearbySearch(){
  var prevLocation = new google.maps.LatLng(lastCoordinates.lat, lastCoordinates.lng)
  let typeSelection = document.getElementById('recommendOptions').selectedOptions[0].value;

  var request = {
    location: prevLocation,
    radius: '1500',
    type: [typeSelection]
  };

  service = new google.maps.places.PlacesService(globalMap);
  service.nearbySearch(request, callback);
  searchNearbyPlaces();

}

function searchNearbyPlaces() {
    // document.getElementById('places').innerHTML = ''
    // Get the place details from the autocomplete object.
  var place = autocomplete2.getPlace();
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

// Nearby Search Function RESULTS
function nearbyResults(place) {
  const table = document.getElementById("places");
  const tbody = table.getElementsByTagName('tbody')[0];
  const tr = table.getElementsByTagName('tr');
  const row = table.insertRow();
  // Starting here
  const [cell1, cell2, cell3] = [row.insertCell(0), row.insertCell(1), row.insertCell(2)];
  const { name, formatted_phone_number, rating, opening_hours, photos, formatted_address} = place;
  const photoUrl = photos ? photos[0].getUrl() : '';
  // Ending here, I have no clue what I'm looking at
  // Edit, I figured it out <3

  // In cell1 adds information of a nearby place
  cell1.innerHTML = `
    <h3>${name}</h3><br>
    Phone: ${formatted_phone_number || 'Not available'}<br>
    Rating: ${rating || 'Not available'}<br>
    Status: ${getPlaceStatus(opening_hours)}<br>
    Address: ${formatted_address}
  `;

  // In cell2 adds weekly schedule
  cell2.innerHTML = `
  <h3>Schedule</h3>
    ${opening_hours && opening_hours.weekday_text.length ? opening_hours.weekday_text.join('<br>') : 'Schedule Not available'}
  `;

  // In cell3 adds an available photo
  cell3.innerHTML = photos ? `<img width="300" height="300" src="${photoUrl}"/>` : '';

  row.addEventListener("click", function () {
    setDestination(place.formatted_address);
    document.getElementById("pageTop").scrollIntoView({ behavior: "smooth" });
  });

  $(tbody).addClass('scrollableTable');
  $(tr).addClass('tableRow');
}

// When row is clicked a new address is added to Destination
function setDestination(address) {
  const destinationInput = document.getElementById("to");
  destinationInput.value = address;
  calcRoute(directionsService, directionsRenderer);
}

function createMarker(place) {
  var table = document.getElementById("places");
  var row = table.insertRow();
  var cell1 = row.insertCell(0);
  cell1.innerHTML = place.name;
  if (!place.photos) {
    return;
  }
  let photoUrl = place.photos[0].getUrl();
  let cell2 = row.insertCell(1);
  cell2.innerHTML = `<img width="300" height="300" src="${photoUrl}"/>;`;
}

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems);
});



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

//This function serves to remove a list item from the unordered list
function handleRemoveItem(event) {
  // convert button we pressed (`event.target`) to a jQuery DOM object
  var removeBtnClicked = $(event.target);
  // get the parent `<li>` element from the button we pressed
  var listItem = removeBtnClicked.parent('li');
  
  // remove the 'visible' class from the listItem
  listItem.removeClass('visible');
  
  // wait for the transition to complete, then remove the listItem
  setTimeout(() => {
    listItem.remove();
  }, 250); // match the duration of the transition in CSS
}
// use event delegation on the `destinationListEL` to listen for click on any element with a class of `delete-item-btn`
destinationUnorderedList.on('click', '.delete-item-btn', handleRemoveItem);



// $(".containerMd").addClass('hoverable');
        $(".containerLg").addClass('lwOpacity z-depth-3 hoverable');
        // $(".containerLg").addClass('z-depth-5 hoverable');
        $(".containerMd").addClass('lwOpacity z-depth-3 hoverable');
        $(".btn").addClass('w-50 blue hoverIntBtn');
        $(".form").addClass('formControl .center-align');
        $("#output").addClass('');
        $(".recommendedTable").addClass('lwOpacity');
        const options = document.querySelectorAll('#recommendOptions option');

        // RevL8
        options.forEach((option) => {
          option.textContent = option.textContent.toUpperCase();
        });

        $(document).ready(function(){
          $('select').formSelect();
        });
        
        document.addEventListener('DOMContentLoaded', function() {
          var elems = document.querySelectorAll('.dropdown-trigger');
          var options = {
            hover: true
          }
          var instances = M.Dropdown.init(elems, options);
        });

        






// ~~~ Map End ~~~ Recommended Start ~~~ Experimental //

var inputValue = document.getElementById('to');
var currentTemp = document.getElementById('temp');
var feelsLike = document.getElementById('feelslike')
var weatherDescription = document.getElementById('description')
//  Gets Geocode information //

function getWeather() {
  var lat = lastCoordinates.lat;
  var lng = lastCoordinates.lng;
  var weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&appid=5c244caed3676cc031bf4ddf617d7c3d&units=imperial';

  return new Promise((resolve, reject) => {
    fetch(weatherApiUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        resolve(data); // Call resolve() when the data is fetched successfully
        console.log(data);
        var tempValue = data.main.temp;
        var feelsLikeValue = data.main.feels_like;
        var descrValue = data.weather[0].description;
        weatherTemp = tempValue;
        weatherDescr = descrValue;
        weatherFeel = feelsLikeValue;
      })
      .catch(error => {
        console.error(error);
        reject(error); // Call reject() inside the catch block
      });
  });
}

let weatherTemp;
let weatherDescr;
let weatherFeel;

//Starts it all//
window.onload = initMap();

function storeLocation() {
localStorage.setItem('lastCoordinates', JSON.stringify(lastCoordinates));
localStorage.setItem('lastAddress', lastAddress);
}

const storedCoordinates = localStorage.getItem('lastCoordinates');
const storedAddress = localStorage.getItem('lastAddress');

// If the values exist in localStorage, set them to the variables
usableCoordinates = JSON.parse(storedCoordinates);
usableAddress = storedAddress;
