let tripDuration // Trip duration global var
let lastAddress // Trip last address
let lastCoordinates // Trip last coordinates
let globalMap
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


var arrivalTimes = [];
// Calculates and display travel distance and time to the output container and the timeSpentUl, fragile do not touch//
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
      time();
      tripDuration = result.routes[0].legs[0].duration.text;
      endAddress = result.routes[0].legs[0].end_address;
      lastAddress = endAddress;
      geocode();
      swapForm();
      
    } else {
      directionsRenderer.setDirections({routes: []});
      map.setCenter(center);
      output.innerHTML = "<p>Can't drive there mate.</p>"
    }
    var nextArrivalTime;
    function time() {
      var destinationListArray = [];
      var destinationListItem = $('<li class="flex-row justify-space-between locationList align-center p-2 bg-light text-dark">');
        var from = document.getElementById('from').value;
        var to = document.getElementById('to').value;
        var duration = result.routes[0].legs[0].duration.text;
        var distance = result.routes[0].legs[0].distance.text;
        var startTime;
        var arrivalTime; // Initialize a variable to store the calculated arrival time
        var currentTime = dayjs().format('h:mm A');
        if (destinationListArray.length === 0) {
            // Set the start time of the first list item as the current time
            startTime = currentTime;
        } else {
          for (var i=0; i<destinationListArray.length; i++) {

            var previous=destinationListArray[i-1];
            var current=destinationListArray[i];
            var next=destinationListArray[i+1];
            
            }
            // Set the start time of the following list items as the arrival time of the last list item
            
        }
        if (duration.length > 8) {
          var timeArray = duration.split(" ");
          console.log(timeArray);
          var hours = parseInt(timeArray[0]);
          var minutes = parseInt(timeArray[2]);
          var hourMinutes = hours * 60;
          minutes = hourMinutes + minutes;
          var minutesAdded = dayjs().add(minutes, "minute").format("h:mm A");
          var hoursAdded = dayjs().add(hours, "hour").format("h:mm A");
          console.log(minutesAdded);
          arrivalTime = minutesAdded;
        } else {
          var travelTime = parseInt(duration);
          arrivalTime = dayjs().add(travelTime, "minute").format("h:mm A");
        }
        arrivalTimes.push(arrivalTime)
        
        // Set the current arrival time as the last arrival time for the next card
        lastArrivalTime = arrivalTime;
        console.log(lastArrivalTime);
        if(arrivalTimes.length > 1){
          startTime = arrivalTimes[arrivalTimes.length -2];
        }
        const formattedText = `
        <p>From: ${from}<br />To: ${to}<br />Duration: ${duration}<br />Distance: ${distance}<br />Start Time: ${startTime}<br />Arrival Time: ${arrivalTime}</p>
        `;
        // destinationList.push(destinationUnorderedList);
        destinationListItem.html(formattedText);
        destinationListArray.push(destinationListItem);
        console.log(destinationListArray)
        destinationListItem.append('<button class="btn btn-danger btn-small delete-item-btn">Remove</button>');
        destinationUnorderedList.append(destinationListItem);
        console.log(arrivalTimes);
    }
    
  });
}

        //  Gets Geocode information //



//  Gets Geocode information, called in directionsService //

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

// Swaps the location input forms on submit, called in directionsService //
function swapForm() {
  let origin = document.getElementById('from').value;
  let destination = document.getElementById('to').value;
  let temp = origin; // store the value of origin in a temporary variable
  origin = destination; // overwrite the value of origin with the value of destination
  destination = temp; // set the value of destination to the value of the temporary variable
  document.getElementById('from').value = origin; // update the input fields with the new values
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
          // get the parent `<li>` element from the button we pressed and remove it
          removeBtnClicked.parent('li').remove();
        }
        // use event delegation on the `destinationListEL` to listen for click on any element with a class of `delete-item-btn`
        destinationUnorderedList.on('click', '.delete-item-btn', handleRemoveItem);

        // $(".containerMd").addClass('hoverable');
        $(".containerLg").addClass('#82b1ff blue accent-1');
        $(".containerLg").addClass('z-depth-5 hoverable');
        $(".input-field").addClass('blue lighten-1 pulse');

        const options = document.querySelectorAll('#recommendOptions option');

        options.forEach((option) => {
          option.textContent = option.textContent.toUpperCase();
        });

        // document.querySelectorAll('#departureCard').addClass('orange z-depth-6');

        // + option.textContent.slice(1)
        // .charAt(0)
        // ~~~ Map End ~~~ Recommended Start ~~~ Experimental //


//Starts it all//
window.onload = initMap();