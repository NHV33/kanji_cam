import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="capture"
export default class extends Controller {

  navBar = document.getElementById("navbar");

  videoElement = document.getElementById('camera-feed');
  canvas = document.getElementById('canvas');
  context = this.canvas.getContext('2d');

  captureButton = document.getElementById('capture-button');
  retakeButton = document.getElementById('retake-button');

  alertText = document.getElementById('alert-text');
  errorText = document.getElementById('error-text');

  infoModal = document.getElementById('info-modal');

  kanjiSelectionModal = document.getElementById('kanji-selection-modal');
  kanjiSelectionBox = document.getElementById("kanji-selection-box")
  confirmButton = document.getElementById("confirm-button");
  cancelButton = document.getElementById("cancel-button");

  imageField = document.getElementById('image-data');
  kanjiField = document.getElementById('kanji-data');
  latField = document.getElementById('latitude-data');
  lonField = document.getElementById('longitude-data');

  captureInstruction = "Take a picture of some kanji.";
  selectionInstruction = "Drag to select kanji.";

  topEdge;
  leftEdge;
  rightEdge;
  bottomEdge;

  xOffset;
  yOffset;

  xScale;
  yScale;

  prevX;
  prevY;
  x;
  y;

  captureImage = null;

  isNewUser = document.getElementById("new-user").dataset.newUser === "true";
  cameraAvailable = false;
  locationAvailable = false;

  modalButtonStyle = "camera-modal-button btn btn-primary text-white w-100 rounded-pill shadow-sm m-1";

  connect() {
    console.log("I'm connected");

    this.setPageStyle();

    this.updateAlertText("");
    this.updateErrorText("");

    this.addEventListeners();

    if (this.isNewUser) {
      this.welcomeNewUser();
    } else {
      this.initializeCamera();
      this.getLocation();
    }

  }

  handleDevicePermissions() {
    if (this.cameraAvailable && this.locationAvailable) {
      this.infoModal.close();
      return;
    }

    if (!this.cameraAvailable) {
      this.requestCamera();
    } else if (!this.locationAvailable && this.isNewUser) {
      this.requestLocation();
    } else if (!this.locationAvailable) {
      this.getLocation();
    }
  }

  setPageStyle() {
    document.body.style.backgroundColor = "black";
    this.navBar.style.visibility = "hidden";
  }

  // buttons param should include {label: , classes: , action: }
  newInfoModal(heading, body, buttons) {
    const infoHeading = document.getElementById("info-heading");
    const infoBody = document.getElementById("info-body");
    const infoButtons = document.getElementById("info-buttons");

    infoHeading.innerText = heading;
    infoBody.innerHTML = body;
    infoButtons.textContent = "";

    buttons.forEach(button => {
      let newButton = document.createElement("button");
      newButton.innerText = button.label;
      if (button.classes !== undefined) {
        const list = (typeof button.classes === "string") ? button.classes.split(" ") : button.classes ;
        newButton.classList.add(...list);
      }
      newButton.addEventListener('click', button.action);
      infoButtons.append(newButton)
    });

    this.infoModal.showModal();
  }

  welcomeNewUser() {
    this.newInfoModal(
      "Welcome to Kanji Cam",
      "<ul><li>Hold the camera steady and level when taking a picture.</li><li>The scanner works best on standard, non-cursive font types.</li></ul><center>(<a href='/dashboard'>Learn More</a>)</center>",
      [{label: "Continue", classes: `camera-modal-button`, action: () => {this.handleDevicePermissions()} }]
    );
  }

  requestCamera() {
    this.newInfoModal(
      "Enable Camera",
      "You must enable your camera to scan kanji.<br>Please press \"allow\" when prompted.",
      [
        {label: "Enable Camera", classes: `camera-modal-button`, action: () => {
          this.initializeCamera();
          this.handleDevicePermissions();
        }},
        {label: "Cancel", classes: `camera-modal-button bg-danger`, action: () => {this.infoModal.close();}}
      ]
    );
  }

  requestLocation() {
    this.newInfoModal(
      "Enable Location Data",
      "Enable location data to view your kanji on a map.<br>Please press \"allow\" when prompted.<br><i class='fa-solid fa-triangle-exclamation'></i> Note <i class='fa-solid fa-triangle-exclamation'></i><br>Location data cannot be added to a kanji after it is captured.",
      [
        {label: "Enable Location Data", classes: `camera-modal-button bg-primary`,
          action: () => {
            this.getLocation();
            this.infoModal.close();
        }},
        {label: "Continue Without Location Data", classes: `camera-modal-button bg-danger`, action: () => {this.infoModal.close()}},
        {label: "Learn More", classes: `camera-modal-button bg-secondary`, action: () => {window.location.href = "/dashboard";}}
      ]
    );
  }

  updateCanvasDimensions() {
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const vw = this.videoElement.videoWidth
    const vh = this.videoElement.videoHeight

    let canvasHeight;
    let canvasWidth;
    if (wh > ww) {
      canvasHeight = (vh * ww) / vw;
      canvasWidth = ww;
    } else {
      canvasHeight = wh;
      canvasWidth = (wh * vw) / vh;
    }

    // this.xScale = ww / canvasWidth;
    // this.yScale = wh / (canvasHeight);

    this.xOffset = (ww - canvasWidth) / 2;
    this.yOffset = (wh - canvasHeight) / 2;

    // this.canvas.width = this.videoElement.videoWidth;
    // this.canvas.height = this.videoElement.videoHeight;
    // this.canvas.width = window.innerWidth;
    // this.canvas.height = window.innerHeight;
    this.canvas.width = canvasWidth;
    this.canvas.style.width = `${(canvasWidth / ww) * 100}vw`
    this.canvas.style.left = `${this.xOffset}px`

    this.canvas.height = canvasHeight;
    this.canvas.style.height = `${(canvasHeight / wh) * 100}vh`
    this.canvas.style.top = `${this.yOffset}px`

    // this.leftEdge = xOffset;
    // this.topEdge = yOffset;
    // this.rightEdge = this.canvas.width + xOffset;
    // this.bottomEdge = this.canvas.height + yOffset;
    this.leftEdge = 0;
    this.topEdge = 0;
    this.rightEdge = this.canvas.width;
    this.bottomEdge = this.canvas.height;
  }

  turnElement(element_id, onOff) {
    const visibilitySetting = (onOff.toLowerCase() === "on") ? "visible" : "hidden";
    document.getElementById(element_id).style.visibility = visibilitySetting;
  }

  updateAlertText(message) {
    if (message === "") {
      this.turnElement("alert-text", "off");
    } else {
      this.turnElement("alert-text", "on");
      this.alertText.innerText = message;
    }
  }

  updateErrorText(message) {
    if (message === "") {
      this.turnElement("error-text", "off");
    } else {
      this.turnElement("error-text", "on");
      // this.errorText.innerHTML = `<i class='fa-solid fa-triangle-exclamation'></i><span>${message}</span>`;
      this.errorText.innerHTML = `⚠ ${message}`;
    }
  }

  onCameraFail() {
    this.cameraAvailable = false;
    this.updateErrorText("Camera Unavailable");
  }

  onLocationFail() {
    this.locationAvailable = false;
    this.updateErrorText("Location Data Unavailable");
  }

  initializeCamera() {

    // Check if the browser supports the MediaDevices API
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Define constraints to request the rear camera
      const constraints = {
          video: {
              facingMode: 'environment' // 'environment' value is used to request the rear camera
          }
      };

      // Request access to the camera with the specified constraints
      navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        // Success callback: stream contains the media stream from the camera
        // You can assign this stream to a <video> element to display the camera feed
        this.videoElement.srcObject = stream;
        this.videoElement.play();

        // Get information about the tracks in the stream
        stream.getVideoTracks().forEach(function(track) {
            // Check the constraints of each track to determine the camera used
            const facingMode = track.getSettings().facingMode;
            // console.log('Camera used:', facingMode);
        });

        this.cameraAvailable = true;
        this.updateAlertText(this.captureInstruction);
        this.handleDevicePermissions();

      })
      .catch((error) => {
          // Error callback: handle errors when accessing the camera
          console.error('Error accessing the camera:', error);
          this.onCameraFail();
          this.handleDevicePermissions();
      });
    } else {
      // Browser does not support getUserMedia
      console.error('getUserMedia not supported in this browser');
      this.onCameraFail();
    }
  }

  stopCamera() {
    this.videoElement.srcObject = null;
  }

  // +++ Segmentation Modes +++
  // OSD_ONLY: '0',
  // AUTO_OSD: '1',
  // AUTO_ONLY: '2',
  // AUTO: '3',
  // SINGLE_COLUMN: '4',
  // SINGLE_BLOCK_VERT_TEXT: '5',
  // SINGLE_BLOCK: '6',
  // SINGLE_LINE: '7',
  // SINGLE_WORD: '8',
  // CIRCLE_WORD: '9',
  // SINGLE_CHAR: '10',
  // SPARSE_TEXT: '11',
  // SPARSE_TEXT_OSD: '12',
  // RAW_LINE: '13',

  stripKanji(text) {
    const matches = text.match(/[一-龯]{1}/g);
    return (matches === null) ? ["?"] : matches;
  }

  extractText = async () => {
    this.updateAlertText("Scanning...");

    const worker = await Tesseract.createWorker('jpn');
    await worker.setParameters({
      // tessedit_char_whitelist: all_kanji,
      // segsearch_max_char_wh_ratio: 10,
      // PSM_SINGLE_CHAR
      // tessedit_pageseg_mode: "1", // best setting so far
      tessedit_pageseg_mode: "9", //circle_word also effective
      preserve_interword_spaces: 0,

    });

    const ret = await worker.recognize(this.canvas.toDataURL("image/png"), "jpn");
    console.log(ret.data.text);

    const recognizedKanji = this.stripKanji(ret.data.text);

    this.displayKanji(recognizedKanji);

    await worker.terminate();
  };

  displayKanji(kanjiList) {
    this.updateAlertText("Select a kanji.")

    this.confirmButton.style.visibility = "hidden";

    this.kanjiSelectionBox.textContent = "";

    kanjiList.forEach(kanji => {
      let newDiv;
      if (kanji === "?") {
        newDiv = `<div class="kanji-not-found">${kanji}<div>`;
      } else {
        newDiv = `<div class="kanji-choice">${kanji}<div>`;
      }
      this.kanjiSelectionBox.innerHTML += newDiv;
    });

    const kanjiChoices = document.querySelectorAll(".kanji-choice");

    kanjiChoices.forEach(kanjiChoice => {
      kanjiChoice.addEventListener('click', (event) => {
        const siblings = document.querySelectorAll(".kanji-choice");
          siblings.forEach(sib => {
            sib.classList.remove("selected");
          });
          event.target.classList.add("selected");
          this.confirmButton.style.visibility = "visible";
      });
    });

    this.kanjiSelectionModal.showModal();
  }

  calcBounds(x1, y1, x2, y2) {

    return {
      left:   Math.min(x1, x2),
      top:    Math.min(y1, y2),
      right:  Math.max(x1, x2),
      bottom: Math.max(y1, y2)
    }
  }

  drawBorder(context, prevX, prevY, x, y, strokeColor="black", borderColor="white") {

    const inner = this.calcBounds(prevX, prevY, x, y);

    context.fillStyle = borderColor;
    context.fillRect(this.leftEdge, this.topEdge, inner.left, inner.bottom); // Left
    context.fillRect(inner.left, this.topEdge, this.rightEdge, inner.top); // Top
    context.fillRect(inner.right, inner.top, this.rightEdge - inner.right, this.bottomEdge); // Right
    context.fillRect(this.leftEdge, inner.bottom, inner.right, this.bottomEdge - inner.bottom); // Bottom

    context.strokeStyle = strokeColor;
    context.lineWidth = "5px";
    // context.strokeRect(prevX, prevY, x-prevX, y-prevY);
    // context.strokeRect(this.leftEdge, this.topEdge, inner.left, inner.bottom); // Left
    // context.strokeRect(inner.left, this.topEdge, this.rightEdge, inner.top); // Top
    // context.strokeRect(inner.right, inner.top, this.rightEdge - inner.right, this.bottomEdge); // Right
    // context.strokeRect(this.leftEdge, inner.bottom, inner.right, this.bottomEdge - inner.bottom); // Bottom
    context.strokeRect(inner.left, this.topEdge, 0, this.bottomEdge); // TopLeft
    context.strokeRect(inner.right, this.topEdge, 0, this.bottomEdge); // TopRight
    context.strokeRect(this.leftEdge, inner.top, this.rightEdge, 0); // LeftTop
    context.strokeRect(this.leftEdge, inner.bottom, this.rightEdge, 0); // LeftBottom
  }

  clearCanvas() {
    this.context.clearRect(this.leftEdge, this.topEdge, this.rightEdge, this.bottomEdge);
  }

  renderImage() {
    this.clearCanvas();
    if (this.captureImage !== null) {
      this.context.drawImage(this.captureImage, 0, 0, this.canvas.width, this.canvas.height);
    }
  }

  updateMousePos(event, newTouch=false) {
    const rect = this.canvas.getBoundingClientRect();
    this.x = event.clientX - this.xOffset;
    this.y = event.clientY - this.yOffset;
    if (newTouch) {
      this.prevX = this.x;
      this.prevY = this.y;
    }
  }

  updateTouchPos(event, newTouch=false) {
    console.log("touch");
    // Example touch event:
    // Touch { identifier: 1815, target: canvas#canvas.full-screen, screenX: 880, screenY: 174, clientX: 712, clientY: 133, pageX: 712, pageY: 133, radiusX: 1, radiusY: 1 }
    if (event.touches[0] === undefined) { return; }
    const rect = this.canvas.getBoundingClientRect();
    this.x = event.touches[0].clientX - this.xOffset;
    this.y = event.touches[0].clientY - this.yOffset;
    if (newTouch) {
      this.prevX = this.x;
      this.prevY = this.y;
    }
  }

  startTouchCanvas() {
    if (this.captureImage === null) { return; }
    this.updateCanvasDimensions();
    this.renderImage();
  }

  dragCanvas() {
    if (this.captureImage === null) { return; }
    if (this.prevX === null || this.prevY === null) { return; }

    const bounds = this.calcBounds(this.prevX, this.prevY, this.x, this.y);
    const boxWidth = bounds.right - bounds.left;
    const boxHeight = bounds.bottom - bounds.top;

    this.renderImage();
    if (boxHeight > 3 && boxWidth > 3) {
      this.drawBorder(this.context, this.prevX, this.prevY, this.x, this.y, "#000000ff", "#ffffffcc");
    }
  }

  endTouchCanvas() {
    if (this.captureImage === null) { return; }

    this.updateAlertText("");

    const bounds = this.calcBounds(this.prevX, this.prevY, this.x, this.y);
    const boxWidth = bounds.right - bounds.left;
    const boxHeight = bounds.bottom - bounds.top;

    if (boxHeight > 10 && boxWidth > 10) {
      this.drawBorder(this.context, this.prevX, this.prevY, this.x, this.y, "#ffffff", "#ffffff");
      this.extractText(this.canvas);
    } else {
      this.renderImage();
    }
    this.prevX = null;
    this.prevY = null;

  }

  loadImageFromDataURL(dataURL) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        resolve(image);
      };
      image.onerror = (error) => {
        reject(error);
      };
      image.src = dataURL;
    });
  }

  // getLocation(callback) {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(position => {
  //         const latitude = position.coords.latitude;
  //         const longitude = position.coords.longitude;
  //         this.locationAvailable = true;
  //         this.handleDevicePermissions();
  //         // Call the callback function with latitude and longitude
  //         callback(latitude, longitude);
  //     },
  //     error => {
  //         console.error("Error occurred while getting geolocation:", error);
  //         this.locationAvailable = false;
  //         // Call the callback function with null values
  //         callback(null, null);
  //         // update alert like..."enable location for more points"
  //     });
  //   } else {
  //     this.locationAvailable = false;
  //     // If geolocation is not supported, call the callback function with null values
  //       callback(null, null);
  //   }
  // }
    getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
          this.latField = position.coords.latitude;
          this.lonField = position.coords.longitude;
          this.locationAvailable = true;
        },
        error => {
          console.error("Error occurred while getting geolocation:", error);
          this.onLocationFail();
      });
    } else {
      this.onLocationFail();
    }
  }

  // EVENT LISTENERS

  addEventListeners() {
    // Capture image
    this.captureButton.addEventListener('click', () => {

      this.turnElement("button-bar", "off");
      this.updateAlertText(this.selectionInstruction);

      this.updateCanvasDimensions();
      this.canvas.getContext('2d').drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);

      // Get the Data URL representing the current state of the canvas
      const imageDataURL = this.canvas.toDataURL('image/png');

      // This needs to happen with an async function.
      this.loadImageFromDataURL(imageDataURL)
        .then((image) => {
          console.log("Image loaded:", image);
          this.captureImage = image;
        })
        .catch((error) => {
          console.error("Error loading image:", error);
          this.captureImage = null;
        });
    });

    this.cancelButton.addEventListener('click', () => {
      this.kanjiSelectionModal.close();
    });

    this.confirmButton.addEventListener('click', () => {

      this.stopCamera();

      const kanjiText = document.querySelector('.selected').innerText;
      console.log("kanjiText: ", kanjiText);
      // const newDataURL = canvas.toDataURL('image/png'); // Adjust format as needed
      // imageField.value = newDataURL;
      this.kanjiField.value = kanjiText;
      console.log("kanjiField: ", this.kanjiField);

      // submitFormWithImageData();
      if (this.kanjiField !== "") {
        document.getElementById('kanji-form').submit();
        // document.getElementById("submit-button").click();
      }
    });

    this.canvas.addEventListener('mousedown',  (event) => { this.updateMousePos(event, true); this.startTouchCanvas(event); });
    this.canvas.addEventListener('mousemove',  (event) => { this.updateMousePos(event); this.dragCanvas(event); });
    this.canvas.addEventListener('mouseup',    (event) => { this.updateMousePos(event); this.endTouchCanvas(event); });
    this.canvas.addEventListener('touchstart', (event) => { this.updateTouchPos(event, true); this.startTouchCanvas(event); });
    this.canvas.addEventListener('touchmove',  (event) => { this.updateTouchPos(event); this.dragCanvas(event); });
    this.canvas.addEventListener('touchend',   (event) => { this.updateTouchPos(event); this.endTouchCanvas(event); });

    this.retakeButton.addEventListener('mouseup', () => {
      this.captureImage = null;
      this.clearCanvas();
      this.turnElement("button-bar", "on");
      this.updateAlertText(this.captureInstruction);
    });

    // Prevent pull-to-refresh
    document.addEventListener('touchstart', function(e) {
      if (e.touches.length > 1) {
          e.preventDefault();
      }
    }, { passive: false });

    // Prevent swipe-back
    window.onbeforeunload = function() {
      window.history.forward();
    };

    // Code to handle resize event
    // window.addEventListener('resize', function(event) {
    //   this.updateCanvasDimensions();
    //   this.renderImage();
    // });

  }

}
