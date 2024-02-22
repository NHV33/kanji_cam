import { Controller } from "@hotwired/stimulus"

// connect to data-controller "confetti"
export default class extends Controller {

  connect() {
    console.log("confetti connected");
  }

    confirm() {
    // confetti
    // var duration = 8 * 1000;

    var startTime = Date.now();

    var formSubmitted = false;

  function frame() {
    // launch a few confetti from the left edge
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    // and launch a few from the right edge
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    // // submit the form after confetti duration has passed
    // if (Date.now() - startTime < duration) {
    //   requestAnimationFrame(frame);
    // } else {
    //   if (!formSubmitted) {
    //     document.getElementById('kanji-form').submit();
    //     formSubmitted = true;
    //   }
    // }
  };
  frame();
  }
};
