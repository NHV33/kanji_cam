class MapsController < ApplicationController
  def index
    # limit this to current user later
    @cards = Card.all
    @markers = @cards.map do |card|
      {
        lat: card.latitude,
        lng: card.longitude,
        kanji: card.kanji.character
      }
    end
  end
end
