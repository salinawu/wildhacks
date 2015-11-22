var geocoder;
var map;
var heatmap;
var gangLayer;
var markers = [];
var grocery = [];
var ff = [];
var address;

function geocode() {
  address = document.getElementById("address").value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
      map.setZoom(14)
      markers.push(marker)
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function initMap() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(41.8369, -87.6847);
  var mapOptions = {
    zoom: 13,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    map: map
  });

  gangLayer = new google.maps.KmlLayer({
    url: 'https://raw.githubusercontent.com/salinawu/wildhacks/master/chicago_gang_map.kml',
    map: map
  });

  // var groc_image = {% static "../images/groc_store.png" %};
  var len = stores.length;
  for (var i = 0; i<len; i++) {

    var groc = new google.maps.Marker({
       position: {lat: stores[i][2], lng:stores[i][3] },
       map: map,
      //  icon: groc_image
    });
    grocery.push(groc);
  }

  var service = new google.maps.DistanceMatrixService;
  service.getDistanceMatrix({
   origins: address,
   destinations: "5717 South Kimbark Ave",
   travelMode: google.maps.TravelMode.WALKING,
   unitSystem: google.maps.UnitSystem.METRIC,
   avoidHighways: false,
   avoidTolls: false
 },function(response, status) {
    if (status !== google.maps.DistanceMatrixStatus.OK) {
      alert('Error was: ' + status);
    } else {
      var originList = response.originAddresses;
      var destinationList = response.destinationAddresses;

      var showGeocodedAddressOnMap = function(asDestination) {
        var icon = asDestination ? destinationIcon : originIcon;
        return function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            map.fitBounds(bounds.extend(results[0].geometry.location));
            markersArray.push(new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              icon: icon
            }));
          } else {
            alert('Geocode was not successful due to: ' + status);
          }
        };
      };

      for (var j = 0; j < results.length; j++) {
        geocoder.geocode({'address': destinationList[j]},
            showGeocodedAddressOnMap(true));
        outputDiv.innerHTML += originList + ' to ' + destinationList[j] +
            ': ' + results[j].distance.text + ' in ' +
            results[j].duration.text + '<br>';
      }
    }
  });
}


  // len = fast_food.length;
  // for (var i = 0; i<len; i++) {
  //   console.log(len)
  //   var fast = new google.maps.Marker({
  //      position: {lat: fast_food[i][1], lng:fast_food[i][2] },
  //      map: map,
  //     //  icon: groc_image
  //   });
  //   ff.push(fast);
  // }


function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function toggleKMLmap() {
  console.log(current);
  gangLayer.setMap(gangLayer.getMap() ? null : map);
}

function toggleGrocerymap(){
  if (grocery.length>0) {
    for (var i = 0; i < grocery.length; i++) {
      grocery[i].setMap(null);
    }
    grocery = [];
  } else {
    var len = stores.length;
    for (var i = 0; i<len; i++) {

      var groc = new google.maps.Marker({
         position: {lat: stores[i][2], lng:stores[i][3] },
         map: map,
        //  icon: groc_image
      });
      grocery.push(groc);
    }
  }
}

// fixme this should be areas of highest risk
function getPoints() {
return [
  new google.maps.LatLng(41.8369, -87.6847),
  new google.maps.LatLng(41.8269, -87.6847),
  new google.maps.LatLng(41.8169, -87.6847),
  new google.maps.LatLng(41.8069, -87.6847),
  new google.maps.LatLng(41.7969, -87.6847)]
}
