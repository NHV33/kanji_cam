import { Controller } from "@hotwired/stimulus"
import * as ks from '../kanji-scanner/kanji-scanner.js'

// Connects to data-controller="capture"
export default class extends Controller {
  connect() {
    console.log("connected to cepture controller");
  }


}
