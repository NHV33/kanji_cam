import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="map"
export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array,
  };

  connect() {
    mapboxgl.accessToken = this.apiKeyValue;

    this.popup = null;
    this.activeMarkerPinPoint = null;

    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [139.70817, 35.63395], //Le Wagon Tokyo!
      zoom: 1,
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude, longitude, "user's position");

        this.#addUserMarker({ latitude, longitude });
      },
      (error) => {
        console.error("Error occurred while getting geolocation:", error);
      }
    );
    this.#addMarkersToMap();

    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserLocation: true,
      })
    );
    this.#fitMapToMarkers();

    // update userMarker when user location changes
    this.map.on("geolocate", function (e) {
      userMarker.setLngLat([e.coords.longitude, e.coords.latitude]);
    });
  }

  setActiveMarkerPinPoint(markerPinPoint) {
    if (this.activeMarkerPinPoint) {
      this.activeMarkerPinPoint.classList.remove("pinpoint-active");
    }
    this.activeMarkerPinPoint = markerPinPoint;
    this.activeMarkerPinPoint.classList.add("pinpoint-active");
  };

  clearActiveMarkerPinPoint() {
    if (this.activeMarkerPinPoint) {
      this.activeMarkerPinPoint.classList.remove("pinpoint-active");
      this.activeMarkerPinPoint = null;
    }
  };

  closePopup() {
    if (this.popup) {
    this.popup.remove();
    this.popup = null;
    }
  };

  #fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds();
    this.markersValue.forEach((marker) => {
      bounds.extend([marker.lng, marker.lat]);
    });
    this.map.fitBounds(bounds, { padding: 100, duration: 10 });
  }

  #addUserMarker(coords) {
    const userMarkerElement = document.createElement("div");
    userMarkerElement.className = "user-marker";

    const userMarker = new mapboxgl.Marker(userMarkerElement)
      .setLngLat([coords.longitude, coords.latitude])
      .addTo(this.map);

    // adjust map showing range to user's location
    // comment out if this animation can be annoying
    // this.map.flyTo({
    //     center: [coords.longitude, coords.latitude], // set user's location to the center
    //     zoom: 14,
    //     essential: true,
    //     duration: 2000
    // });

    userMarker.getElement().addEventListener("click", () => {
      this.map.flyTo({
        center: [coords.longitude, coords.latitude],
        zoom: 14,
        essential: true,
        duration: 1000,
      });
    });
    // this.map.on('moveend', adjustUserMarkerPosition);
  }

  #addMarkersToMap() {
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
          if (this.popup) {
            console.log(this.popup, "first appearance");
            this.closePopup();
            for (let i = 0; i < activeMarkers.length; i++) {
              activeMarkers[i].classList.remove("pinpoint-active");
              // console.log(document.getElementsByClassName("pinpoint-active"));
            }
          }
          this.setActiveMarkerPinPoint(markerPinPoint);
          const meaningText = `<p class="m-0">Meaning: ${marker.meaning}</p>`;
          const linkText = `<a class="detail-link" href="/kanjis/${marker.kanji_id}">Check details</a>`;

          const onText = marker.on_reading !== null ? `<p class="m-0">on reaning: ${marker.on_reading}</p>`: `<p class="m-0">on reaning: None</p>`;
          const kunText = marker.kun_reading !== null ?`<p class="m-0">kun reaning: ${marker.kun_reading}</p>`: `<p class="m-0">Kun reaning: None</p>`;
          const formattedDate = new Date(
            marker.captured_date
          ).toLocaleDateString("en-us", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          const dateText = `<p class="m-0">Added on: ${formattedDate}</p>`;
          console.log(formattedDate, "formatted date");
          // if (markerIcon === this.activeMarker) {
          //   this.closePopup(popup);
          //   console.log("close popup");
          // }
          // if (markerIcon !== this.activeMarker && (popup === null || !popup.isOpen())) {
          //   console.log(popup, "vincent");
            this.popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
            })
            .setLngLat([marker.lng, marker.lat])
            .setHTML(meaningText + onText + kunText + dateText + linkText)
            .setOffset([0, -50])
            .addTo(this.map);
          })

          // When marker is clicked, zoom in as needed
          // console.log("fly to marker");
          this.map.flyTo({
            center: [marker.lng, marker.lat], // set marker in the center
            zoom: 14, // zoom level
            essential: true, // animation: true
            duration: 1000,
          });
        // });

        newMarker.getElement().addEventListener("click", () => {
          this.map.flyTo({
            center: [marker.lng, marker.lat],
            zoom: 14,
            essential: true,
            duration: 1000,
          });
        });
      }
    });
    const mapElement = document.querySelector(".map");

    mapElement.addEventListener("mouseup", () => {
      if (this.popup) {
        console.log(this.popup, "if popup");
        this.closePopup();
        this.clearActiveMarkerPinPoint(this.markerPinPoint);
      } else {
        // popup doesn't exist
        console.log(this.popup);
        console.log("zoom out");
        let currentCenter = this.map.getCenter();
        console.log(currentCenter, "current center");
        this.map.flyTo({
          center: [currentCenter.lng, currentCenter.lat],
          zoom: 8,
          essential: true,
          duration: 1000,
        });
      }
    });
  }
}
