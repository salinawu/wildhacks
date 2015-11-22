var geocoder;
var map;
var heatmap;
var gangLayer;
var markers = [];
var grocery = [];
var ff = [];
var address;
var final_dest;
var min;
var init = 0;
var groc_image;

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

      map.setZoom(16);
      markers.push(marker);
      // console.log(results[0].geometry.location;
      var length = stores.length;

      var cur_lat = results[0].geometry.location.lat();
      var cur_lon = results[0].geometry.location.lng();

      var lowest = []
      for (var k = 0; k < length; k++){
        var temp_lat = stores[k][2];
        var temp_lon = stores[k][3];
        var diff = Math.sqrt( (temp_lat-cur_lat)*(temp_lat-cur_lat) + (temp_lon-cur_lon)*(temp_lon-cur_lon) )
        // var diff = Math.abs(temp_lat + temp_lon - cur_lat-cur_lon);
        if(k ==0 || diff<= lowest[0]){
          lowest = [diff,temp_lat,temp_lon];
        }
        console.log(lowest);
      }

      final_dest = {lat:lowest[1],lng:lowest[2]};
      console.log(lowest);
      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;
      directionsDisplay.setMap(map);
      calculateAndDisplayRoute(directionsService, directionsDisplay);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function initMap() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(41.8369, -87.6847);
  var mapOptions = {
    zoom: 10,
    center: latlng,
    styles: styleArray
  }
  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    map: map,
    gradient: gradient
  });

  gangLayer = new google.maps.KmlLayer({
    url: 'https://raw.githubusercontent.com/salinawu/wildhacks/master/new_chicago_gang_map.kml',
    map: map
  });

  groc_image = {
    url: 'static/images/groc_store_final.png',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(35, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32)
  }

  var len = stores.length;
  for (var i = 0; i<len; i++) {

    var groc = new google.maps.Marker({
       position: {lat: stores[i][2], lng:stores[i][3] },
       map: map,
       icon: groc_image
    });
    grocery.push(groc);
  }

  var gradient = [
    'rgb(251, 209, 65)',
  	'rgba(0, 255, 255, 0)'
	]
	heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);

}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  alert("hi");
  directionsService.route({
    origin: document.getElementById('address').value,
    destination: final_dest,
    travelMode: google.maps.TravelMode.WALKING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

var styleArray = [
  {
    featureType: "all",
    stylers: [
      { hue: "#84243b"},
      { saturation: -85 },
      {invert_lightness:true}
    ]
  },{
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      { hue: "#00ffee" },
      { saturation: 20 }
    ]
  },{
    featureType: "poi.business",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  }
];

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function toggleKMLmap() {
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
         icon: groc_image
      });
      grocery.push(groc);
    }
  }
}

// fixme this should be areas of highest risk
function getPoints() {
var heat = []

for (var i = 0; i< stores.length; i ++){
	heat.push( new google.maps.LatLng(stores[i][2],stores[i][3]))
}
return heat
}
