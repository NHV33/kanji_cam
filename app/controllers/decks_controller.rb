class DecksController < ApplicationController
  before_action :set_deck, only: [:show, :next_card]

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
    session[:progress] = 0
    @cards = @deck.entries.where(card: :kanji)
    redirect_to next_card_deck_path(@deck)
  end

  def next_card
    session[:progress] = session[:progress].to_i + 10
    session[:progress] = 0 if session[:progress] > 100
    unlearned_cards = @deck.cards.where(learned: false)
    @card = unlearned_cards.order(Arel.sql('RANDOM()')).first

    learned_cards = @deck.cards.where(learned: true)
    total_cards = @deck.cards.count
    # @progress_percentage = (learned_cards.count.to_f / total_cards * 100).round(2)
    if @card.nil?
      @done_message = "Done with all flashcards!"
    end
    

    # if @card
    #   when 'easy'
    #     # aaaa
    #   when 'medium'
    #     # aaaa
    #   when 'hard'
    #     # aaaa
    #   end
    # end
  end


  private

  def set_deck
    @deck = current_user.decks.find_by(id: params[:id])
  end
end
