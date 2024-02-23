class DecksController < ApplicationController
  def index
    # excluded_titles = ["Master Deck"] + (1..5).map { |level| "JLPT N#{level}" }
    # @decks = current_user.decks.where.not(title: excluded_titles)
    @custom_decks = current_user.decks.where(custom_deck: true)

    @jlpt_decks = (1..5).map do |level|
      jlpt_deck = current_user.decks.find_or_create_by(title: "JLPT N#{level}")
      Card.joins(:kanji)
          .where(learned: false, kanjis: { jlpt: level }, user_id: current_user.id)
          .each do |card|
            Entry.find_or_create_by(card_id: card.id, deck_id: jlpt_deck.id)
          end

      jlpt_deck
    end

    @master_deck = current_user.decks.find_or_create_by(title: "Master Deck")
    Card.where(learned: false, user_id: current_user.id).each do |card|
      Entry.find_or_create_by(card_id: card.id, deck_id: @master_deck.id)
    end
  end
end
