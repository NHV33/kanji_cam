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
    });

    // get user's location and display the pin there
    navigator.geolocation.getCurrentPosition(
      (position) => {
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
      },
      (error) => {
        console.error("Error occurred while getting geolocation:", error);
      }
    );

    // this.addPulsingDot();
    this.#addMarkersToMap();
    this.#fitMapToMarkers();

    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserLocation: true,
      })
    );

    // update userMarker when user location changes
    this.map.on("geolocate", function (e) {
      userMarker.setLngLat([e.coords.longitude, e.coords.latitude]);
    });
  }

  #fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds();
    this.markersValue.forEach((marker) => {
      bounds.extend([marker.lng, marker.lat]);
    });
    this.map.fitBounds(bounds, { padding: 50, duration: 10 });
  }

  // addPulsingDot() {
  //   const size = 200;
  //   let longitude, latitude; // Define variables here

  //   // Define the pulsing dot icon
  //   const pulsingDot = {
  //     width: size,
  //     height: size,
  //     data: new Uint8Array(size * size * 4),

  //     // Function to render the pulsing dot
  //     render: function () {
  //       const duration = 1000; // Animation duration in milliseconds
  //       const t = (performance.now() % duration) / duration; // Current animation progress

  //       const radius = (size / 2) * 0.3;
  //       const outerRadius = (size / 2) * 0.7 * t + radius;

  //       const canvas = document.createElement('canvas');
  //       canvas.width = size;
  //       canvas.height = size;
  //       const context = canvas.getContext('2d');

  //       // Clear the canvas
  //       context.clearRect(0, 0, size, size);

  //       // Draw the outer circle
  //       context.beginPath();
  //       context.arc(
  //         size / 2,
  //         size / 2,
  //         outerRadius,
  //         0,
  //         Math.PI * 2
  //       );
  //       context.fillStyle = `rgba(255, 200, 200, ${1 - t})`; // Outer circle color
  //       context.fill();

  //       // Draw the inner circle
  //       context.beginPath();
  //       context.arc(
  //         size / 2,
  //         size / 2,
  //         radius,
  //         0,
  //         Math.PI * 2
  //       );
  //       context.fillStyle = 'rgba(255, 100, 100, 1)'; // Inner circle color
  //       context.strokeStyle = 'white'; // Inner circle stroke color
  //       context.lineWidth = 2 + 4 * (1 - t); // Inner circle stroke width
  //       context.fill();
  //       context.stroke();

  //       // Return the canvas containing the pulsing dot
  //       return canvas;
  //     }
  //   };

  //   // Add the pulsing dot icon to the map
  //   this.map.on('load', () => {
  //     this.map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

  //     // Get user's location and display the pin there
  //     navigator.geolocation.getCurrentPosition(position => {
  //       latitude = position.coords.latitude;
  //       longitude = position.coords.longitude;
  //       console.log(latitude, longitude, "user's position");

  //       const userMarker = new mapboxgl.Marker()
  //         .setLngLat([longitude, latitude])
  //         .addTo(this.map);

  //       // Adjust map showing range to user's location
  //       // Comment out as this animation can be annoying
  //       // this.map.flyTo({
  //       //     center: [longitude, latitude], // set user's location to the center
  //       //     zoom: 12,
  //       //     essential: true,
  //       //     duration: 1000
  //       // });
  //     }, error => {
  //       console.error("Error occurred while getting geolocation:", error);
  //     });

  //     // Add a source and layer using the pulsing dot icon
  //     this.map.addSource('dot-point', {
  //       'type': 'geojson',
  //       'data': {
  //         'type': 'FeatureCollection',
  //         'features': [
  //           {
  //             'type': 'Feature',
  //             'geometry': {
  //               'type': 'Point',
  //               'coordinates': [longitude, latitude] // Set the initial coordinates of the pulsing dot
  //             }
  //           }
  //         ]
  //       }
  //     });

  //     this.map.addLayer({
  //       'id': 'layer-with-pulsing-dot',
  //       'type': 'symbol',
  //       'source': 'dot-point',
  //       'layout': {
  //         'icon-image': 'pulsing-dot'
  //       }
  //     });
  //   });
  // }

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
            .setHTML(meaningText + onText + kunText + linkText + dateText)
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
      })
    };
  })
}
}
