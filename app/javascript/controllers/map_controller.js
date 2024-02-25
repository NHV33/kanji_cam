import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="map"
export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array
   }


  connect() {

    mapboxgl.accessToken = this.apiKeyValue

    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/mapbox/streets-v10"
    })

  navigator.geolocation.getCurrentPosition(position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude, longitude, "user's position");

    const userMarker = new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(this.map);

    // adjust map showing range to user's location
    this.map.flyTo({
        center: [longitude, latitude], // set user's location to the center
        zoom: 12,
        essential: true
    });
}, error => {
    console.error("Error occurred while getting geolocation:", error);
});

    this.#addMarkersToMap()
    this.#fitMapToMarkers()

    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserLocation: true
  }));

  this.map.on('geolocate', function (e) {
    marker.setLngLat([e.coords.longitude, e.coords.latitude]);
  });
  }

  #fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds()
    this.markersValue.forEach((marker) => {
      bounds.extend([marker.lng, marker.lat])
    })
    this.map.fitBounds(bounds, {padding: 50, duration: 10})
  }

  #addMarkersToMap() {
    this.markersValue.forEach((marker) => {
      console.log("kanji marker's");
      const markerContainer = document.createElement('div');
      markerContainer.className = 'marker-container';

      const element = document.createElement('div');
      element.className = 'marker';
      markerContainer.appendChild(element);

      const text = document.createElement('div');
      text.textContent = marker.kanji;
      text.className = 'marker-text';
      element.appendChild(text);

      element.addEventListener('click', () => {
        // When marker is clicked, zoom in as needed
        this.map.flyTo({
            center: [marker.lng, marker.lat], // set marker in the center
            zoom: 14, // zoom level
            essential: true // animation: true
        });
    });
  }
)}
}
