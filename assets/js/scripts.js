// ~~~ Map Start ~~~ //

var formBtn = document.getElementById('formBtn');

// Creates the map function, fragile do not touch //
function initMap() {
  var myLatLng = {lat: 40.116386, lng: -101.299591}
  var mapOptions = {
    center: myLatLng,
    zoom: 4,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);

  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // Updates the mode of transport //
  document.getElementById("mode").addEventListener("change", () => {
    calcRoute(directionsService, directionsRenderer);
  });

  // Button to update locations //
  document.getElementById("formBtn").addEventListener("click", function(event){
    event.preventDefault();
    calcRoute(directionsService, directionsRenderer);
  });

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
      } else {
        directionsRenderer.setDirections({routes: []});
        map.setCenter(center);
        output.innerHTML = "<p>Can't drive there mate.</p>"
      }
    });
  }
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


// ~~~ Map End ~~~ Recommended Start ~~~ Experimental //

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
//   console.log(place)
//   var table = document.getElementById("places");
//   var row = table.insertRow();
//   var cell1 = row.insertCell(0);
//   cell1.innerHTML = place.name;
//   if (place.photos) {
//     let photoUrl = place.photos[0].getUrl();
//     let cell2 = row.insertCell(1)
//     cell2.innerHTML = `<img width="300" height="300" src="${photoUrl}"/>`
//   } else {
//     let photoUrl = "https://via.placeholder.com/150"
//     let cell2 = row.insertCell(1)
//     cell2.innerHTML = `<img width="300" height="300" src="${photoUrl}"/>`
//   }
// }

//Starts it all//
initMap()