import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="tts"
export default class extends Controller {

  japaneseVoices = [];

  connect() {
    // console.log("tts");
    this.element.addEventListener("click", this.handleClick.bind(this));

    // Store available Japanese voices to class var "japaneseVoices"
    const voices = window.speechSynthesis.getVoices();
    voices.forEach(voice => {
      // if (voice.lang.includes("ja") && voice.name.includes("female")) {
      if (voice.lang.includes("ja")) {
          this.japaneseVoices.push(voice);
        // console.log("voice: ", voice);
      }
    });

  }

  // Generate a random integer between 0 (inclusive) and the length of the array (exclusive)
  sampleRandom(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  getTextOfMatches(str, regex) {
    // Ensure the regex has the global flag set
    const regexWithGlobal = new RegExp(regex, 'g');
    const matches = [];
    let matchObj;
    while ((matchObj = regexWithGlobal.exec(str)) !== null) {
      const matchObjLastIndex = matchObj.length - 1;
      const matchString = matchObj[matchObjLastIndex];
      matches.push(matchString);
    }

    return matches.join("");
  }

  // Handle click on dynamically created "reading" elements
  handleClick(event) {
    if (event.target.matches(".sound-icon")) {
      const parentElement = event.target.parentNode;

      // const readingText = parentElement.textContent.trim().replace("-", "");
      const readingText = this.getTextOfMatches(parentElement.textContent, /[ぁ-ゖァ-ヺ]{1}/g);

      let msg = new SpeechSynthesisUtterance();
      msg.text = readingText;
      // Currently chooses a random voice to use. Some are quire strange.
      msg.voice = this.sampleRandom(this.japaneseVoices);
      msg.volume = 1; // From 0 to 1
      // Slowed the rate to 0.6
      msg.rate = 0.6; // From 0.1 to 10
      msg.pitch = 1; // From 0 to 2
      msg.lang = "ja-JP";
      speechSynthesis.speak(msg);
    }
  }

}
