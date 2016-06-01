var map, latLng, marker, infoWindow, ad;
var geocoder = new google.maps.Geocoder();

function showAddress(val) {
    //infoWindow.close();
    geocoder.geocode({
        'address': decodeURI(val)
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            marker.setPosition(results[0].geometry.location);
            geocode(results[0].geometry.location);
        } else {
            defaultLocation();
            //alert("Sorry but Google Maps could not find this location.");
        }
    });
}

function geocode(position, pan) {

    if (pan == undefined) 
        pan = true;

    geocoder.geocode({
        latLng: position
    }, function(responses) {
        var html = '';
        window.location.hash = '#' + marker.getPosition().lat() + "," + marker.getPosition().lng();
        if (responses && responses.length > 0) {
            html +=  responses[0].formatted_address;
            html += '<br /><small>' + 'Latitude: ' + marker.getPosition().lat() + '<br />Longitude: ' + marker.getPosition().lng() + '</small><br/>';
            html += '<span style="float:right"><a target="_blank" href="#">Reportar problema</a></span>';
        } else {
            html += 'Sorry but Google Maps could not determine the approximate postal address of this location.';
        }
        if (pan)
            map.panTo(marker.getPosition());
        infoWindow.setContent("<div id='iw' style='max-width:250px;color:#000'>" + html + "</div>");
        infoWindow.open(map, marker);
    });
}

function initialize() {

    var myOptions = {
        zoom: 12,
        fullscreenControl: false,
        panControl: false,
        zoomControl: false,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: false,
        scaleControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_RIGHT
        },
        streetViewControl: false,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true
    };

    map = new google.maps.Map(document.getElementById('googlemaps'), myOptions);
    //var ad = '<ins class="adsbygoogle" style="display:inline-block;width:320px;height:100px" data-ad-client="ca-pub-3152670624293746" data-ad-slot="1136209176"></ins>';
    //var adNode = document.createElement('div');
    //adNode.innerHTML = ad;
    //map.controls[google.maps.ControlPosition.TOP_CENTER].push(adNode);
    google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
        (adsbygoogle = window.adsbygoogle || []).push({});
    });

    

    var coordinates = window.location.hash;
    /*
    if (coordinates !== "") {
        var hashlocation = coordinates.split(",");
        if (hashlocation.length == 2) {
            showMap(hashlocation[0].substr(1), hashlocation[1], true);
            return;
        }
    }
    */

    if (coordinates !== "") {
        defaultLocation();
        showAddress(coordinates.substr(1));
    } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locationFound, defaultLocation);
    } else {
        defaultLocation();
    }

}

function locationFound(position) {
    showMap(position.coords.latitude, position.coords.longitude);
}

function defaultLocation() {
    showMap(38.8977, -77.0366);
}

function showMap(lat, lng, hideinfo) {

    latLng = new google.maps.LatLng(lat, lng);

    map.setCenter(latLng);

    marker = new google.maps.Marker({
        position: latLng,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP
    });

    infoWindow = new google.maps.InfoWindow({
        content: '<div id="iw" style="max-width:240px">Please drag this red marker anywhere on the map to know the approximate postal address of that location.<br>For help, please <a href="https://twitter.com/labnol" target="_blank">tweet</a> or <a href="mailto:amit@labnol.org?Subject=MapsAddress" taret="_blank">email us</a>.</div>'
    });

    if (hideinfo) {
        geocode(latLng);
    } else {
        infoWindow.open(map, marker);
    }

    google.maps.event.addListener(map, 'click', function(event) {
        var point = marker.getPosition();
        geocode(point, false);
        marker.setPosition( event.latLng );
    });

    google.maps.event.addListener(marker, 'dragstart', function(e) {
        infoWindow.close();
    });

    google.maps.event.addListener(marker, 'dragend', function(e) {
        var point = marker.getPosition();
        map.panTo(point);
        geocode(point);
    });
}

// google.maps.event.addDomListener(window, 'load', initialize);

initialize();
