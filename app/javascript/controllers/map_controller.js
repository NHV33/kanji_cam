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

    this.#addMarkersToMap()
    this.#fitMapToMarkers()
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
      const markerPinPoint = document.createElement('div');
      markerPinPoint.className = 'marker-pin-point';

      const markerIcon = document.createElement('div');
      markerIcon.className = 'marker-icon';
      markerPinPoint.appendChild(markerIcon);

      const markerText = document.createElement('div');
      markerText.textContent = marker.kanji;
      markerText.className = 'marker-text';
      markerIcon.appendChild(markerText);

      markerIcon.addEventListener('click', () => {
        // When marker is clicked, zoom in as needed
        this.map.flyTo({
          center: [marker.lng, marker.lat], // set marker in the center
          zoom: 14, // zoom level
          essential: true // animation: true
        });
      });

      /*ANIMATION FIX*/
      // Instead of triggering the animation with CSS, use Javascript
      markerIcon.addEventListener('mouseenter', () => {

        // When the user hovers ('mouseenter' event), add the CSS class with animation
        markerIcon.classList.add("animate-icon");

        // Use setTimeout() to remove the animate-icon class after 1000ms (1 second)
        setTimeout(() => {
          markerIcon.classList.remove("animate-icon");
        }, 1000);
        // After one second, the animation can trigger again, because the class was removed.
      });

      // new mapboxgl.Marker(el)
      //   .setLngLat([marker.lng, marker.lat])
      //   .addTo(this.map);

        new mapboxgl.Marker(markerPinPoint)
        .setLngLat([marker.lng, marker.lat])
        .addTo(this.map);
    });
  }
}
