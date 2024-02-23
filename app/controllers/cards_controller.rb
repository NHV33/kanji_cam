class CardsController < ApplicationController
  def index
    @cards = current_user.cards.order(created_at: :desc)
  end

  def show
    @card = Card.find(params[:id])
    # Moved example-scraping code to partials/kanji_info view,
    # so we don't have to write it in each controller method.
  end

  def destroy
    @card = Card.find(params[:id])
    @card.destroy
    redirect_to cards_path
  end

  def capture
    # Nothing needed here?
  end

  def new_capture
    new_kanji = match_kanji(params[:kanji_data], /[一-龯]/)
    @card = Card.new
    @card.user_id = current_user.id
    @card.kanji_id = Kanji.find_by(character: new_kanji).id

    @card.latitude = params[:latitude_data]
    @card.longitude = params[:longitude_data]

    if @card.save!
      redirect_to edit_card_path(@card), notice: 'New card was successfully saved to your colletion!.'
    else
      redirect_to dashboard_url
    end
  end

  def update
    @card = Card.find(params[:id])
    if @card.update(card_params)
     redirect_to @card, notice: "Information updated!"
    else
      render :edit
    end
  end

  def edit
    @card = Card.find(params[:id])
  end

  private

  def card_params
    params.require(:card).permit(:comment, :latitude, :longitude)
  end

  def match_kanji(string, pattern)
    match = string.match(pattern)
    match ? match[0] : nil
  end
end
