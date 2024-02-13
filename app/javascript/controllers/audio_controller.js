import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    console.log("card controller connected");
  }

  audioRequest() {
    console.log("Audio play button clicked");

    const requestData = "Miho";

    const endpointUrl = "[API Base URL]/tts/v1/tts";

    fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => console.log(data));
  }
}
