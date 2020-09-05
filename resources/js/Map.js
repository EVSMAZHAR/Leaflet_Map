/**
 * This file is licensed under Creative Commons Zero (CC0)
 * http://creativecommons.org/publicdomain/zero/1.0/
 *
 * Author: http://www.openstreetmap.org/user/Zartbitter
 */

var map;
var memberLayer;
var permalink;

/**
 * Update the link-textarea in the info window with an link HTML code so others
 * can copy and paste the code to bring a link to this map to their websites.
 */
function setLinkContent() {
	//var elem = document.getElementById('idLinkArea');
	//elem.innerHTML = '&lt;a href="' + permalink._href + '" target="_blank"&gt;Mein Bienenstandort&lt;/a&gt;';
}

/**
 * Update the iframe-textarea in the info window with an iframe HTML code so others
 * can copy and paste the code to bring this map to their websites.
 */
function setIframeContent() {
	//var elem = document.getElementById('idIframeArea');
	//elem.innerHTML = '&lt;iframe width="800" height="600" src="' + permalink._href + '" name="Mein Bienenstandort"&gt;&lt;/iframe&gt;';
}

/**
 * Get all parameters out of the URL.
 * @return Array List of URL parameters key-value indexed
 */
function getUrlParameters() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i=0; i<hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

/**
 * Hides the information div regardless of its previous state.
 */
function hideInfo() {
	//document.getElementById("infodiv").style.display = "none";
}

/**
 * Show some information what this map does and what it doesn't.
 */
function toggleInfo() {
	// var infodiv = document.getElementById("infodiv");
	// if (infodiv.style.display == "block") {
		// infodiv.style.display = "none";
	// } else {
		// setIframeContent();
		// setLinkContent();
		// infodiv.style.display = "block";
	// }
}

/**
 * Add the standorte marker after geolocation happened.
 */
function setMarkerAfterGeolocation() {
	
	//map.off('moveend', setMarkerAfterGeolocation);
	//permalink.options.beeControl.initMarker(false);
	permalink.options.standorteControl.initMarker(true);
}

/**
 * Callback for error in geolocation.
 * @var msg errormessage
 */
function geolocationError(msg) {
	alert("Keine Ahnung, wo du steckst.\nDu musst die Biene leider selbst platzieren.");
	setMarkerAfterGeolocation();
}

/**
 * Callback for successful geolocation.
 * @var position Geolocated position
 */
function geolocationFound(position) {
	if (typeof map != "undefined") {
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		map.on('moveend', setMarkerAfterGeolocation);
		map.setView(new L.LatLng(lat, lon), 13);
	}
}

/**
 * Remove the layer containing relation member vectors.
 */
function removeMemberLayer() {
	if (typeof memberLayer != "undefined" && memberLayer != null && map.hasLayer(memberLayer)) {
		map.removeLayer(memberLayer);
		memberLayer.clearLayers();
		memberLayer = null;
	}
}

/**
 * Moving the map just startet.
 * Change the progress message.
 * @var e event (not used)
 */
function onMoveStart(e) {
	hideInfo();
}

/**
 * Geolocation is requested, do it.
 */
function doGeolocate() {
	if (typeof navigator.geolocation != "undefined") {
		navigator.geolocation.getCurrentPosition(geolocationFound, geolocationError);
	}
}

/**
 * Initialize the map.
 */
function initMap() {


	var standard = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors</a>'
		});

	var mapnikde = L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors</a>'
		});

	


	var zoom = 7;
	var lat = 51.58;
	var lon = 10.1;
	var urlParams = getUrlParameters();

	if (typeof urlParams.zoom != "undefined" && typeof urlParams.lat != "undefined" && typeof urlParams.lon != "undefined") {
		zoom = urlParams.zoom;
		lat = urlParams.lat;
		lon = urlParams.lon;
	}

	map = L.map('map', {
		center: new L.LatLng(lat, lon),
		zoom: zoom,
		layers: [mapnikde]
	});
	map.attributionControl.setPrefix("");

	
	var baseMaps = {

		 "OpenStreetMap.de": mapnikde
		, "OpenStreetMap": standard
		
	};

	var standorteControl = L.control.standorteControl().addTo(map);
	var layerControl = L.control.layers(baseMaps,null,{collapsed: false}).addTo(map);
	
	map.on('movestart', onMoveStart);

	if (typeof urlParams.m == "undefined" || typeof urlParams.mlat == "undefined" || typeof urlParams.mlon == "undefined") {
		standorteControl.initMarker(true);
	}
}
