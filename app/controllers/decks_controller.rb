class DecksController < ApplicationController
  before_action :set_deck, only: [ :next_card]

  def index
    # @kanji_data = KanjiData.new("胃")
    excluded_titles = ["Master Un-learned Deck"] + (1..5).map { |level| "Un-learned JLPT N#{level}" }
    @decks = current_user.decks.where.not(title: excluded_titles)

    @jlpt_decks = (1..5).map do |level|
      jlpt_deck = current_user.decks.find_or_create_by(title: "Un-learned JLPT N#{level}")
      Card.joins(:kanji)
          .where(learned: false, kanjis: { jlpt: level }, user_id: current_user.id)
          .each do |card|
            Entry.find_or_create_by(card_id: card.id, deck_id: jlpt_deck.id)
          end
      jlpt_deck
    end

    @master_deck = current_user.decks.find_or_create_by(title: "Master Un-learned Deck")
    Card.where(learned: false, user_id: current_user.id).each do |card|
      Entry.find_or_create_by(card_id: card.id, deck_id: @master_deck.id)
    end
  end


  def show
    @cards = @deck.entries.includes(card: :kanji)
  end

  def next_card
    unlearned_cards = @deck.cards.where(learned: false)
    @card = unlearned_cards.order(Arel.sql('RANDOM()')).first
    respond_to do |format|
      format.html do
        if @card
          render 'flashcard'
        else
          redirect_to deck_path(@deck), notice: "Good work!!"
        end
      end
      format.js
    end
  end


  private

  def set_deck
    @deck = current_user.decks.find_by(id: params[:id])
  end
end
