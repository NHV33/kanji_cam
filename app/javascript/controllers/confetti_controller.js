import { Controller } from "@hotwired/stimulus"
import confetti from "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/+esm";

// connect to data-controller "confetti"
export default class extends Controller {

  connect() {
    console.log("confetti connected");
    this.confirm();
  }

  confirm() {
    // confetti
    // launch a few confetti from the left edge
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    // and launch a few from the right edge
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });
  }
};
