class DashboardController < ApplicationController
  def index
    @points = current_user.points
    @total_learned_kanji = total_learned_kanji
    @total_kanji = Kanji.count
    @total_captured_kanji = current_user.cards.count
    @decks = current_user.decks.limit(2)
    @collected_kanji_by_jlpt = collected_kanji_by_jlpt.sort.to_h.transform_keys { |key| "JLPT#{key}" }
  end

  private

  def collected_kanji_by_jlpt
    Card.joins(:kanji)
        .where(user: current_user)
        .group('kanjis.jlpt')
        .count
  end

  def total_learned_kanji
    current_user.cards.where(learned: true).joins(:kanji).distinct.count
  end
end
