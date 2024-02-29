class MapsController < ApplicationController
  def index
    # limit this to current user later
    @cards = current_user.cards.where.not(latitude: nil, longitude: nil)
    @markers = @cards.map do |card|
      {
        lat: card.latitude,
        lng: card.longitude,
        kanji: card.kanji.character,
        meaning: card.kanji.meanings[0],
        kanji_id: card.kanji_id
        # link to go show page of the kanji
      }
    end
  end

  def all_kanji_map
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
