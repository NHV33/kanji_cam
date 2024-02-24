class DashboardController < ApplicationController
  def index
    @total_learned_kanji = total_learned_kanji
    @total_kanji = Kanji.count
    @total_captured_kanji = current_user.cards.count
    @decks = current_user.decks.limit(2)
    @learned_kanji_by_jlpt = learned_kanji_by_jlpt.sort.to_h.transform_keys { |key| "JLPT#{key}" }
  end

  private

  def learned_kanji_by_jlpt
    Card.joins(:kanji)
        .where(user: current_user, learned: true)
        .group('kanjis.jlpt')
        .count
  end

  def total_learned_kanji
    Card.where(learned: true).joins(:kanji).distinct.count
  end
end
