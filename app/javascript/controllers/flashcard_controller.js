import { Controller } from "@hotwired/stimulus";
import confetti from "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/+esm";

export default class extends Controller {
  static targets = ["points"];

  connect() {
    if (!sessionStorage.getItem("pageReloaded")) {
      sessionStorage.setItem("pageReloaded", "true");
      window.location.reload();
    } else {
      sessionStorage.removeItem("pageReloaded");

      const sessionPointsValue = this.pointsTarget.dataset.points;
      const sessionPoints = parseInt(sessionPointsValue, 10);
      const animationDuration = 1000;
      const animationInterval = 50;
      const pointsIncrement = Math.ceil(
        sessionPoints / (animationDuration / animationInterval)
      );
      this.animatePoints(sessionPoints, pointsIncrement, animationInterval);
    }
  }

  animatePoints(sessionPoints, pointsIncrement, animationInterval) {
    let currentPoints = 0;
    const interval = setInterval(() => {
      currentPoints += pointsIncrement;
      this.pointsTarget.innerText = `+ ${currentPoints}p`;

      if (currentPoints >= sessionPoints) {
        this.pointsTarget.innerText = `+ ${sessionPoints}p`;
        clearInterval(interval);
        setTimeout(() => {
          this.confirm();
        }, 300);
      }
    }, animationInterval);
  }

  confirm() {
    confetti({
      particleCount: 50,
      startVelocity: 30,
      shapes: ["square", "square", "circle", "star"],
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });

    confetti({
      particleCount: 50,
      startVelocity: 30,
      shapes: ["square", "square", "circle", "star"],
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });
  }
}
