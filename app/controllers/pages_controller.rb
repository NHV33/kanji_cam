class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:home, :qa]
  def home
  end

  def qa
    @topic = params[:topic]
  end

  def tomo
    # @kanji = current_user.cards.order(created_at: :desc).first
    @kanji = Kanji.all.order("RANDOM()").first
    @points = current_user.points
  end

end
