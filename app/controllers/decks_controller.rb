class DecksController < ApplicationController
  before_action :set_deck, only: [:show, :next_card, :finish_session]

  def index
    # excluded_titles = ["Master Deck"] + (1..5).map { |level| "JLPT N#{level}" }
    # @decks = current_user.decks.where.not(title: excluded_titles)

    # Now checks if a deck is custom by referencing the custom_deck column
    # Also, changed variable name to @custom_decks for clarity.
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
      # Do entires ever get deleted from a deck?
      Entry.find_or_create_by(card_id: card.id, deck_id: @master_deck.id)
    end
  end


  def show
    session[:progress] = 0
    session[:session_points] = 0
    session[:finished_session] = false
    @cards = @deck.entries.where(card: :kanji)
    @cards = @deck.cards
    session[:total_cards] = @cards.count
    # session[:learned_cards] = @cards.where(learned: true).count
    session[:learned_cards] = 0

    redirect_to next_card_deck_path(@deck)
  end

  def next_card
    session[:progress] = session[:progress].to_i + 10
    session[:progress] = 0 if session[:progress] > 100
    @unlearned_cards = @deck.cards.where(learned: false)
    @card = @unlearned_cards.order(Arel.sql('RANDOM()')).first
    @user_points = current_user.points
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

  def learn_card
    @deck = Deck.find(params[:id])
    @card = Card.find_by(id: params[:current_card_id])
    @user = current_user
    if @card.present?
      @card.learned = true
      if @card.save
        session[:learned_cards] = session[:learned_cards].to_i + 1
        session[:session_points] = session[:session_points].to_i + 10
        redirect_to next_card_deck_path(@deck), notice: 'Card marked as learned.'
        @user.points += 10
        if @user.save!
          p "points: #{@user.points}"
        end
      end
    else
      redirect_to next_card_deck_path(@deck), alert: 'Card not found.'
    end
  end

  def finish_session
    if session[:finished_session] = true
      redirect_to next_card_deck_path(@deck)
      p "session finished"
    end
  end

  def reset_learned
    current_user.cards.all.each do |user_card|
      user_card.learned = false
      user_card.save!
    end
    redirect_to decks_url, notice: "Reset Flashcards"
  end

  private

  def set_deck
    @deck = current_user.decks.find_by(id: params[:id])
  end
end
