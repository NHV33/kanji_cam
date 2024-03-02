import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["points"];

  connect() {
    const sessionPointsValue = this.pointsTarget.dataset.points;
    const sessionPoints = parseInt(sessionPointsValue, 10);
    const animationDuration = 1000;
    const animationInterval = 50;
    const pointsIncrement = Math.ceil(sessionPoints / (animationDuration / animationInterval));
    this.animatePoints(sessionPoints, pointsIncrement, animationInterval);
  }

  animatePoints(sessionPoints, pointsIncrement, animationInterval) {
    let currentPoints = 0;
    const interval = setInterval(() => {
      currentPoints += pointsIncrement;
      this.pointsTarget.innerText = `+ ${currentPoints}p`;

      if (currentPoints >= sessionPoints) {
        this.pointsTarget.innerText = `+ ${sessionPoints}p`;
        clearInterval(interval);
      }
    }, animationInterval);
  }
}
