class DashboardController < ApplicationController
  def index
    @total_learned_kanji = total_learned_kanji
    @total_kanji = Kanji.count
    @decks = current_user 
  end

  private

  def total_learned_kanji
    Card.where(learned: true).joins(:kanji).distinct.count
  end
end
