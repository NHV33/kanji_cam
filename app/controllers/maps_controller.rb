class MapsController < ApplicationController
  def index
    # limit this to current user later
    @cards = current_user.cards.includes(:kanji)
    @cards_with_position = current_user.cards.where.not(latitude: nil, longitude: nil)
    @markers = @cards.map do |card|
      {
        lat: card.latitude,
        lng: card.longitude,
        kanji: card.character,
        meaning: card.kanji.meanings[0],
        on_reading: card.kanji.on_readings[0],
        kun_reading: card.kanji.kun_readings[0],
        card_id: card.id,
        kanji_id: card.kanji.id,
        captured_date: card.created_at
        # link to go show page of the kanji
      }
    end
  end

  def all_kanji_map
    @cards = Card.includes(:kanji).all
    @markers = @cards.map do |card|
      {
        lat: card.latitude,
        lng: card.longitude,
        kanji: card.character,
        meaning: card.kanji.meanings[0],
        on_reading: card.kanji.on_readings[0],
        kun_reading: card.kanji.kun_readings[0],
        kanji_id: card.kanji.id,
        captured_date: card.created_at
      }
    end
  end
end
