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

  // get user's location and display the pin there
  navigator.geolocation.getCurrentPosition(position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude, longitude, "user's position");

    const userMarker = new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(this.map);

    // adjust map showing range to user's location
    // comment out as this animation can be annoying
    // this.map.flyTo({
    //     center: [longitude, latitude], // set user's location to the center
    //     zoom: 12,
    //     essential: true,
    //     duration: 1000
    // });
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

  // update userMarker when user location changes
  this.map.on('geolocate', function (e) {
    userMarker.setLngLat([e.coords.longitude, e.coords.latitude]);
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
    let popup = null; // set the variable
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

      const newMarker = new mapboxgl.Marker(markerPinPoint)
            .setLngLat([marker.lng, marker.lat])
            .addTo(this.map);

      markerIcon.addEventListener('click', () => {
        const activeMarkers = document.getElementsByClassName("pinpoint-active");
        if (popup) {
          popup.remove();
          for (let i = 0; i < activeMarkers.length; i++) {
            activeMarkers[i].classList.remove("pinpoint-active");
            // console.log(document.getElementsByClassName("pinpoint-active"));
          }
        }
        // markerIcon.classList.add("pinpoint-active");
        markerPinPoint.classList.add("pinpoint-active");
        // markerPinPoint.style.zIndex = 9999;
        const meaningText = `<p class="m-0">Meaning: ${marker.meaning}</p>`;

        // let currentPath = window.location.pathname;

        // if (currentPath === )
        // on my map, use card_id and show collected date
        // const linkText = `<a href="/cards/${marker.card_id}">Check details</a>`;
        // on global map, use kanji_id and doesn't use colected date
        const linkText = `<a href="/kanjis/${marker.kanji_id}">Check details</a>`;

        const onText = `<p class="m-0">on reaning: ${marker.on_reading}</p>`;
        const kunText = `<p class="m-0">kun reaning: ${marker.kun_reading}</p>`;
        const formattedDate = new Date(marker.captured_date).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"})
        const dateText = `<p class="m-0">Added on: ${formattedDate}</p>`;
        console.log(formattedDate, "formatted date");

        popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
          })
        .setLngLat([marker.lng, marker.lat])
        .setHTML(meaningText + onText + kunText + linkText + dateText )
        .setOffset([0, -50])
        .addTo(this.map);
      })

      markerIcon.addEventListener('click', () => {
        // When marker is clicked, zoom in as needed
        console.log("fly to marker");
        this.map.flyTo({
            center: [marker.lng, marker.lat], // set marker in the center
            zoom: 12, // zoom level
            essential: true, // animation: true
            duration: 1000
        });
    });
  }
)}
}
