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
      map.setZoom(14);
      markers.push(marker);
      console.log(document.getElementById('address').value);
      var service = new google.maps.DistanceMatrixService;
      service.getDistanceMatrix({
        origins: [document.getElementById('address').value],
        destinations: [("27.111","45.222")],
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, function(response, status) {
        if (status !== google.maps.DistanceMatrixStatus.OK) {
          alert('Error was: ' + status);
        } else {
          console.log(response);
          var results = response.rows[0].elements[0];
          console.log(results);
          var distance = results.distance.text;
          console.log(response)
          console.log(distance);
        }
      });
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
    url: 'https://raw.githubusercontent.com/salinawu/wildhacks/master/chicago_gang_map.kml',
    map: map
  });

  var groc_image = {
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

  var gradient = [
    'rgb(251, 209, 65)',

  	'rgba(0, 255, 255, 0)'
    // 'rgba(0, 255, 255, 1)',
   //  'rgba(0, 191, 255, 1)',
   //  'rgba(0, 127, 255, 1)',
   //  'rgba(0, 63, 255, 1)',
   //  'rgba(0, 0, 255, 1)',
   //  'rgba(0, 0, 223, 1)',
   //  'rgba(0, 0, 191, 1)',
   //  'rgba(0, 0, 159, 1)',
   //  'rgba(0, 0, 127, 1)',
   //  'rgba(63, 0, 91, 1)',
   //  'rgba(127, 0, 63, 1)',
   //  'rgba(191, 0, 31, 1)',
   //  'rgba(255, 0, 0, 1)']
		// 'rgb(255, 225, 101)',

		// 'rgb(248, 193, 94)'
		// 'rgb(241, 161, 87)',
		// 'rgb(238, 145, 83)',
		// 'rgb(235, 129, 80)',
		// 'rgb(231, 113, 76)',
		// 'rgb(228, 97, 73)',
		// 'rgb(225, 81, 61)',
		// 'rgb(222, 66, 66)'
	]
	heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
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




// COLOR GRADIENTS: BOURBON 1. #EC6F66, #F3A183
//#d53369,  #cbad6d
//yellow -> red
// #c21500,  #ffc500
