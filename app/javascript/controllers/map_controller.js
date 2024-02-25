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

  //   this.map.addControl(
  //     new mapboxgl.GeolocateControl({
  //       positionOptions: {
  //         enableHighAccuracy: true
  //     },
  //     trackUserLocation: true,
  //     showUserLocation: true
  // }));

//   this.mapboxgl-user-location-dot {
//     background-color: blue;
//     border-radius: 50%;
//     width: 10px;
//     height: 10px;
// }

  navigator.geolocation.getCurrentPosition(position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude, longitude, "user's position");

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
    this.#addUserMarkertoMap()
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

      el.addEventListener('click', () => {
        // When marker is clicked, zoom in as needed
        this.map.flyTo({
            center: [marker.lng, marker.lat], // set marker in the center
            zoom: 14, // zoom level
            essential: true // animation: true
        });
    });
  }
)}

    #addUserMarkertoMap() {
      const userMarker = new.Map

      this.map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserLocation: true
    }));
    }

      // new mapboxgl.Marker(el)
      //   .setLngLat([marker.lng, marker.lat])
      //   .addTo(this.map);

        new mapboxgl.Marker(markerContainer)
        .setLngLat([marker.lng, marker.lat])
        .addTo(this.map);
    });
  }
}
