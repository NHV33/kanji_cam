class CardsController < ApplicationController
  def index
    @cards = Card.all.order(created_at: :desc)
  end

  def show
    @card = Card.find(params[:id])
  end
end
