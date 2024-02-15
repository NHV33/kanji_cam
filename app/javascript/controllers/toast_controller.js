// import { Controller } from "stimulus"

// export default class extends Controller {
//   static targets = ["toast"]

//   connect() {
//     this.hideToast() // Initially hide the toast
//   }

//   showToast(event) {
//     const message = event.params.message || "Default message"
//     this.toastTarget.textContent = message
//     this.toastTarget.classList.add("show")
//     setTimeout(() => {
//       this.hideToast()
//     }, 3000) // Customize duration as needed
//   }

//   hideToast() {
//     this.toastTarget.classList.remove("show")
//   }
// }
