import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="tss"
export default class extends Controller {
  connect() {
    console.log("Connected to tts");
  }
}
