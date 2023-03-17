let tripDuration // Trip duration global var
let lastAddress // Trip last address
let lastCoordinates // Trip last coordinates
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

  directionsRenderer.setMap(map);
  
  // Button to update locations //
  document.getElementById("formBtn").addEventListener("click", function(event){
    event.preventDefault();
    calcRoute(directionsService, directionsRenderer);
    handleFormSubmit();
    geocode();
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
    } else {
      directionsRenderer.setDirections({routes: []});
      map.setCenter(center);
      output.innerHTML = "<p>Can't drive there mate.</p>"
    }
  });
}

//  Gets Geocode information //
function geocode(){
  axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params:{
      address: lastAddress,
      key:'AIzaSyD7LSZB-NbGaXCie1yVVi5ptF0Mta50NvA'
    }
  })
  .then(function(response){
    console.log(response);
    endAddress = response.data.results[0].geometry.location;
    lastCoordinates = endAddress.lat + "," + endAddress.lng;
  })
  .catch(function(error){
    console.log(error);
  })
}

nearbyBtn = document.getElementById('nearbyBtn');
nearbyBtn.addEventListener('click', nearbySearch);

// Broken Search Nearby //
function nearbySearch(){
  axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
    params:{
      location: lastCoordinates,
      radius: 500,
      key:'AIzaSyD7LSZB-NbGaXCie1yVVi5ptF0Mta50NvA'
    }
  })
  .then(function(response){
    console.log(response);
  })
  .catch(function(error){
    console.log(error);
  })
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
console.log(timeList.value);
timeList.addEventListener('changed', console.log(timeList.value))



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