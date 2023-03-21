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
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  globalMap = map

  directionsRenderer.setMap(map);
  
  // Button to update locations //
  document.getElementById("formBtn").addEventListener("click", function(event){
    event.preventDefault();
    calcRoute(directionsService, directionsRenderer);
  });
  
}


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
      
      var destinationListItem = $(
        '<li class="flex-row justify-space-between locationList align-center p-2 bg-light text-dark">'
        );
        var from = document.getElementById('from').value
        var to = document.getElementById('to').value
        var duration = result.routes[0].legs[0].duration.text;
        var distance = result.routes[0].legs[0].distance.text;
        var satrtTime = dayjs().format('h:mm A');
        if(duration.length > 8){
          var timeArray = duration.split(" ")
          console.log(timeArray); 
          var hours = parseInt(timeArray[0]);
          var minutes = parseInt(timeArray[2]);
          var hourMinutes = hours*60
          minutes=hourMinutes+minutes
          var minutesAdded = dayjs().add(minutes, "minute").format("h:mm A")
          var hoursAdded = dayjs().add(hours, "hour").format("h:mm A")
          console.log(minutesAdded);
          var arrivalTime = minutesAdded;
        } else{
          var travelTime = parseInt(duration)
          var arrivalTime = dayjs().add(travelTime, "minute").format("h:mm A");

        }
        console.log(travelTime);
        // var arrivalTime = durationcurrentTime.add(result.routes[0].legs[0].duration.val());
console.log(result);
// Format the list item text using HTML tags
      const formattedText = `
      <p>From: ${from}<br />To: ${to}<br />Duration: ${duration}<br />Distance: ${distance}<br />Current Time: ${startTime}<br />Arrival Time: ${arrivalTime}</p>`;

// Set the formatted text as the destination list item's HTML content
      destinationListItem.html(formattedText);

        // add delete button to remove destination from list
        destinationListItem.append(
          '<button class="btn btn-danger btn-small delete-item-btn">Remove</button>'
          );
          destinationUnorderedList.append(destinationListItem);
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
        
        //This function serves to remove a list item from the unordered list
        function handleRemoveItem(event) {
          // convert button we pressed (`event.target`) to a jQuery DOM object
          var removeBtnClicked = $(event.target);
          // get the parent `<li>` element from the button we pressed and remove it
          removeBtnClicked.parent('li').remove();
        }
        // use event delegation on the `destinationListEL` to listen for click on any element with a class of `delete-item-btn`
        destinationUnorderedList.on('click', '.delete-item-btn', handleRemoveItem);
        
        
        
        // ~~~ Map End ~~~ Recommended Start ~~~ Experimental //
        
      
         
              
              // addTripLength();
        // autocomplete2.addListener('place_changed', searchNearbyPlaces);
        
        // document.getElementById('recommendOptions').onchange = searchNearbyPlaces
        
        // function searchNearbyPlaces() {
          //   document.getElementById('places').innerHTML = ''
          //   // Get the place details from the autocomplete object.
          //   var place = autocomplete2.getPlace();
          //   console.log(place)
          
      //   // Create a map centered at the location entered in the autocomplete field.
      //   map = new google.maps.Map(document.getElementById('googleMap'), {
        //     center: place.geometry.location,
//     zoom: 15
//   });
  
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
// Import the dayjs library
// import dayjs from 'dayjs';

// // Define the trip information as an array of objects
// 

// // Get the unordered list element where the travel itinerary will be displayed
// const itineraryList = document.querySelector('ul');

// // Loop through each leg of the trip and create a new HTML element to display the trip information
// tripInformation.forEach((leg, index) => {
//   const destinationListItem = document.createElement('li');

//   // Set the start time for the current leg of the trip
//   if (index === 0) {
//     // If this is the first leg of the trip, use the start time from the trip information object
//     leg.startTime = leg.startTime;
//   } else {
//     // Otherwise, use the end time of the previous leg of the trip
//     leg.startTime = tripInformation[index - 1].endTime;
//   }

//   // Calculate the end time for the current leg of the trip
//   leg.endTime = leg.startTime.add(leg.duration, 'hour');

//   destinationListItem.textContent = `${leg.from} to ${leg.to}, ${leg.duration}, ${leg.distance}, starting at ${leg.startTime.format('h:mm A')} and ending at ${leg.endTime.format('h:mm A')}`;

//   itineraryList.appendChild(destinationListItem);
// });
//Starts it all//
window.onload = initMap();