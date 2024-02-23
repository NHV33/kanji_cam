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
      const markerContainer = document.createElement('div');
      markerContainer.className = 'marker-container';

      const el = document.createElement('div');
      el.className = 'marker';
      markerContainer.appendChild(el);

      const text = document.createElement('div');
      text.textContent = marker.kanji;
      text.className = 'marker-text';
      el.appendChild(text);

      // new mapboxgl.Marker(el)
      //   .setLngLat([marker.lng, marker.lat])
      //   .addTo(this.map);

        new mapboxgl.Marker(markerContainer)
        .setLngLat([marker.lng, marker.lat])
        .addTo(this.map);
    });
  }
}
