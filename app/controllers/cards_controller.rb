class CardsController < ApplicationController
  def index
    @cards = Card.all.order(created_at: :desc)
  end

  def show
    @card = Card.find(params[:id])
  end

  def create
    # @card = current_user.cards.build(card_params)
    @card = Card.new
    @card.kanji = params(:kanji_data)
    if @card.save
     redirect_to @card
    else
      render :new, status: 422
    end
  end

  def new
    @card = Card.new
  end

  def capture
    # p params[:kanji_data]
  end

  def new_capture
    new_kanji = params[:kanji_data]
    @card = Card.new
    @card.user_id = current_user.id
    # @card.kanji_id = 1
    @card.kanji_id = Kanji.find_by(character: "員").id

    if @card.save!
      redirect_to @card
    end
  end

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
  #   params.require(:card).permit(:user)
  # end

end
