var geocoder;
var map;
var heatmap;
var gangLayer;
var markers = [];
var grocery = [];

function geocode() {
  var address = document.getElementById("address").value;
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

  // var groc_image = {% static "../images/groc_store.png" %};
  var len = stores.length;
  console.log(len)
  for (var i = 0; i<len; i++) {

    var groc = new google.maps.Marker({
       position: {lat: stores[i][2], lng:stores[i][3] },
       map: map,
      //  icon: groc_image
    });
    grocery.push(groc);
  }
  var gradient = [
  	'rgba(0, 255, 255, 0)',
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
		
		'rgb(251, 209, 65)',
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
        //  icon: groc_image
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
console.log(heat)
return heat
}




// COLOR GRADIENTS: BOURBON 1. #EC6F66, #F3A183
//#d53369,  #cbad6d 
//yellow -> red
// #c21500,  #ffc500