// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "@popperjs/core"
import "bootstrap"
import "chartkick"
import "Chart.bundle"

import ConfettiController from './controllers/confetti_controller.js'
Stimulus.register('confetti', ConfettiController)
