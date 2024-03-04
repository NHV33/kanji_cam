import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="map"
export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array,
  };

  connect() {
    mapboxgl.accessToken = this.apiKeyValue;

    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [139.70817, 35.63395], //Le Wagon Tokyo!
      zoom: 1
    });

    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(latitude, longitude, "user's position");

    this.#addUserMarker({ latitude, longitude });
  }, error => {
    console.error("Error occurred while getting geolocation:", error);
  });
    this.#addMarkersToMap();

    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserLocation: true
  }));
    // this.#fitMapToMarkers();

    // There was time lag with the following, as all process is executed after map loading is done
    // this.map.on('load', () => {
    // // get user's location and display the pin, add other markers as well
    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     this.#addUserMarker(position.coords);
    //     this.#addMarkersToMap();
    //     // this.#fitMapToMarkers(position.coords);
    //   }, (error) => {
    //     console.error("Error occurred while getting geolocation:", error);
    //     // if getting user location fails, display other markers
    //     this.#addMarkersToMap();
    //     // this.#fitMapToMarkers();
    //   });
    // });

  // update userMarker when user location changes
  this.map.on('geolocate', function (e) {
    userMarker.setLngLat([e.coords.longitude, e.coords.latitude]);
  });
  }

  // #fitMapToMarkers() {
  //   const bounds = new mapboxgl.LngLatBounds();
  //   this.markersValue.forEach((marker) => {
  //     bounds.extend([marker.lng, marker.lat]);
  //   });
  //   this.map.fitBounds(bounds, { padding: 50, duration: 10 });
  // }

  #addUserMarker(coords) {
    const userMarkerElement = document.createElement('div');
    userMarkerElement.className = 'user-marker';

    const userSpeechBubble = document.createElement("div");
    userSpeechBubble.className = "user-speech-bubble";
    userMarkerElement.appendChild(userSpeechBubble);

    const speechBubbleText = document.createElement("p");
    speechBubbleText.className = "speech-bubble-text";
    speechBubbleText.textContent = "You are here!"
    userSpeechBubble.appendChild(speechBubbleText);

    const userMarker = new mapboxgl.Marker(userMarkerElement)
          .setLngLat([coords.longitude, coords.latitude])
          .addTo(this.map);

        // adjust map showing range to user's location
        // comment out if this animation can be annoying
        this.map.flyTo({
            center: [coords.longitude, coords.latitude], // set user's location to the center
            zoom: 12,
            essential: true,
            duration: 2000
        });

        userMarker.getElement().addEventListener('click', () => {
        const currentZoom = this.map.getZoom();
        let newZoomLevel = currentZoom >= 12 ? currentZoom + 2 : 12;
        // Limit zoom up to Mapbox maximum zoom level
        newZoomLevel = Math.min(newZoomLevel, this.map.getMaxZoom());

        this.map.flyTo({
          center: [coords.longitude, coords.latitude],
          zoom: newZoomLevel,
          essential: true,
          duration: 1000
              });
    })
      }

  #addMarkersToMap() {
    let popup = null; // set the variable
    this.markersValue.forEach((marker) => {
      // Check if both latitude and longitude exist
      if (marker.lat != null && marker.lng != null) {
        const markerPinPoint = document.createElement("div");
        markerPinPoint.className = "marker-pin-point";

        const markerIcon = document.createElement("div");
        markerIcon.className = "marker-icon";
        markerPinPoint.appendChild(markerIcon);

        const markerText = document.createElement("div");
        markerText.textContent = marker.kanji;
        markerText.className = "marker-text";
        markerIcon.appendChild(markerText);

        const newMarker = new mapboxgl.Marker(markerPinPoint)
          .setLngLat([marker.lng, marker.lat])
          .addTo(this.map);

          markerIcon.addEventListener("click", () => {
            const activeMarkers =
              document.getElementsByClassName("pinpoint-active");
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
            const linkText = `<a href="/kanjis/${marker.kanji_id}">Check details</a>`;

            const onText = `<p class="m-0">on reaning: ${marker.on_reading}</p>`;
            const kunText = `<p class="m-0">kun reaning: ${marker.kun_reading}</p>`;
            const formattedDate = new Date(
              marker.captured_date
            ).toLocaleDateString("en-us", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            const dateText = `<p class="m-0">Added on: ${formattedDate}</p>`;
            console.log(formattedDate, "formatted date");

            popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
            })
              .setLngLat([marker.lng, marker.lat])
              .setHTML(meaningText + onText + kunText + dateText + linkText)
              .setOffset([0, -50])
              .addTo(this.map);

            // When marker is clicked, zoom in as needed
            console.log("fly to marker");
            this.map.flyTo({
              center: [marker.lng, marker.lat], // set marker in the center
              zoom: 12, // zoom level
              essential: true, // animation: true
              duration: 1000,
            });
          });

          newMarker.getElement().addEventListener('click', () => {
            const currentZoom = this.map.getZoom();
            let newZoomLevel = currentZoom >= 12 ? currentZoom + 2 : 12;
        // Limit zoom up to Mapbox maximum zoom level
        newZoomLevel = Math.min(newZoomLevel, this.map.getMaxZoom());

        this.map.flyTo({
          center: [marker.lng, marker.lat],
          zoom: newZoomLevel,
          essential: true,
          duration: 1000
              });
      })
    };
  })
}
}
