class MapsController < ApplicationController
  def index
    # limit this to current user later
    @cards = Card.all
    @markers = @cards.map do |card|
      {
        lat: card.latitude,
        lng: card.longitude
      }
    end
  end
end
