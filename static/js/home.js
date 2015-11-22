var geocoder;
var map;
var heatmap;
var gangLayer;
var markers = [];

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
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function toggleKMLmap() {
  gangLayer.setMap(gangLayer.getMap() ? null : map);
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
