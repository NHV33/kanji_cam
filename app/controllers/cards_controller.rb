class CardsController < ApplicationController
  def index
    @cards = Card.all.order(created_at: :desc)
  end

  def show
    @card = Card.find(params[:id])
  end

  # def create
  #   @card = current_user.cards.build(card_params)
  #   if @card.save
  #    redirect_to @card
  #   else
  #     render :new, status: 422
  #   end
  # end

  # def new
  #   @card = Card.new
  # end

  # def update
  #   @card = Card.find(params[:id])
  #   if @card.update(card_params)
  #    redirect_to @card, notice: "Information updated!"
  #   else
  #     render :edit
  #   end
  # end

  # def edit
  #   @card = Card.find(params[:id])
  # end

  # private

  # def card_params
  #   params.require(:card).permit(:user, )
  # end

end
