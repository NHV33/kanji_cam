import { Controller } from "@hotwired/stimulus"
import confetti from "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/+esm";

// connect to data-controller "confetti"
export default class extends Controller {

  connect() {
    console.log("confetti connected");
    this.confirm();
  }

  confirm() {
    const kanjiSymbol = document.getElementById("kanji-symbol")
    const scalar = 2;
    // const starScalar = 2;
    // const circleScalar = 2;
    // const squareScalar = 2;
    const kanji = confetti.shapeFromText({ text: kanjiSymbol.innerText, scalar });

    // confetti
    // launch a few confetti from the left edge
    confetti({
      particleCount: 50,
      startVelocity: 30,
      shapes: [kanji, 'square', 'square', 'circle', 'star'],
      // scalar: [scalar, squareScalar, circleScalar, starScalar],
      scalar,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
  });

  confetti({
      particleCount: 50,
      startVelocity: 30,
      shapes: [kanji, 'square', 'square', 'circle', 'star'],
      // scalar: [scalar, squareScalar, circleScalar, starScalar],
      scalar,

      // writing as an object doesn't work
        // { shape: kanji, scalar, particleCount: 5 }, // Kanji particles
        // { shape: starShape, scalar: starScalar, particleCount: 20 }, // star particles
        // { shape: circleShape, scalar: circleScalar, particleCount: 20 }, // star particles
        // { shape: squareShape, scalar: squareScalar, particleCount: 20 } // Square particles
      // ],
      angle: 120,
      spread: 55,
      origin: { x: 1 }
  });
  }
};
