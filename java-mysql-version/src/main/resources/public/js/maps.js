var map,latLng,marker,infoWindow,address;
var geocoder = new google.maps.Geocoder();

function showAddress(val) {
    geocoder.geocode({'address':decodeURI(val)}, function(results,status) {
        if(status == google.maps.GeocoderStatus.OK) {
            marker.setPosition(results[0].geometry.location);
            geocode(results[0].geometry.location);
        }
        else alert("N�o foi poss�vel encontrar um local aproximado com estes termos.");
    });
}

function geocode(position,pan) {
    if(pan == undefined) pan = true;

    geocoder.geocode({latLng:position},function(responses) {
        var html = '';

        window.location.hash = '#' + marker.getPosition().lat() + "," + marker.getPosition().lng();

        if(responses && responses.length > 0) {
            address = responses[0].formatted_address;
            html +=  responses[0].formatted_address;
            html += '<br /><small>Latitude: '+ marker.getPosition().lat() +'<br />Longitude: '+ marker.getPosition().lng() +'</small><br/>';
            html += '<div class="text-center"><a class="btn pos-report" target="_blank" href="javascript:void(0);">Reportar problema</a></div>';
        }
        else html += 'N�o foi poss�vel determinar um endere�o v�lido para essa localiza��o';
        
        if(pan) map.panTo(marker.getPosition());

        marker.info.setContent("<div id='iw' style='max-width:250px;color:#000'>"+ html +"</div>");
        marker.info.open(map,marker);
    });
}

function initialize() {
    var myOptions = { zoom:12, fullscreenControl:false, panControl:false,
        zoomControl:false, zoomControlOptions:{position:google.maps.ControlPosition.LEFT_CENTER},
        scaleControl:false, scaleControlOptions:{position:google.maps.ControlPosition.BOTTOM_RIGHT},
        streetViewControl:false, streetViewControlOptions:{position:google.maps.ControlPosition.RIGHT_TOP},
        mapTypeId:google.maps.MapTypeId.ROADMAP, mapTypeControl:true
    };

    map = new google.maps.Map(document.getElementById('googlemaps'),myOptions);

    var coordinates = window.location.hash;

    if(coordinates !== "") {
        defaultLocation();
        showAddress(coordinates.substr(1));
    }
    else if(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(locationFound, defaultLocation);
    else
        defaultLocation();

    placeMarkers();
}

function locationFound(position) {
    showMap(position.coords.latitude,position.coords.longitude);
}

function defaultLocation() {
    showMap(-19.922822,-43.945162); // praça raul soares
}

function showMap(lat,lng,hideinfo) {
    latLng = new google.maps.LatLng(lat,lng);
    map.setCenter(latLng);
    marker = new google.maps.Marker({position:latLng, map:map, draggable:true, animation:google.maps.Animation.DROP});
    marker.info = new google.maps.InfoWindow({content:
        '<div id="iw" style="max-width:240px">Clique no local que deseja relatar um problema ou localize um local aproximado.</div>'
    });

    if(hideinfo) geocode(latLng);
    else marker.info.open(map, marker);

    google.maps.event.addListener(map,'click',function(event) {
        var point = marker.getPosition();

        geocode(point,false);
        marker.setPosition(event.latLng);
    });

    google.maps.event.addListener(marker,'click',function(e) {
        var self = this;
        var map = this.getMap();

        this.info.open(map,self);
    });

    google.maps.event.addListener(marker,'dragstart',function(e) {
        marker.info.close();
    });

    google.maps.event.addListener(marker, 'dragend', function(e) {
        var point = marker.getPosition();

        map.panTo(point);
        geocode(point);
    });
}

initialize();

function placeMarkers() {
    $.ajax({url:'pesquisar', dataType:'json', traditional:true, data:{
            //id:3, endereco:'ICEX', classificacao:'Falta de Energia', descricao:'Corte',
            //coordenadas:['-19.869502517006683 -43.955810715747134','-19.859412056405496 -43.9595872660401','-19.864941708330374 -43.97610967357184']
        },
        success:function(data,textStatus,jqXHR) {
            for(i in data) {
                var latLng = new google.maps.LatLng(data[i].latitude,data[i].longitude);
                var m = new google.maps.Marker({map:map, position:latLng, clickable:true});

                m.info = new google.maps.InfoWindow({content:data[i].descricao});
                m.setIcon('img/marker.png');

                google.maps.event.addListener(m,'click',function() {
                    var self = this;
                    var map = this.getMap();

                    this.info.open(map,self);
                });
            }
        }
    });
}

$(document).on('click','a.pos-report',function(e) {
    e.preventDefault();
    $('#modal-report input[name="latitude"]').val(marker.position.lat());
    $('#modal-report input[name="longitude"]').val(marker.position.lng());
    $('#modal-report input[name="endereco"]').val(address);
    $('#modal-report').modal();
});

$("#modal-report form").on('submit',function(e) {
    e.preventDefault();
    
    var data = $(this).serialize() || {};

    $.ajax({url:'salvar', dataType:'json', data:data,
        success:function(data,textStatus,jqXHR) {
            alert('Problema reportado com sucesso. Protocolo: '+ data.id);
        }
    });
});
