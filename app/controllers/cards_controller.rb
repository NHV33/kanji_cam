class CardsController < ApplicationController
  def index
    @cards = current_user.cards.order(created_at: :desc)
  end

  def show
    @card = Card.find(params[:id])
    @card_kanji = KanjiData.new(@card.kanji.id)
    kanji_to_search = @card_kanji.character
    # kanji_to_search = @card.kanji.character
    @jpn_sentences, @eng_sentences = [], []
    # @jpn_sentences, @eng_sentences = Scraper.new(kanji_to_search).scrape
  end

  def destroy
    @card = Card.find(params[:id])
    @card.destroy
    redirect_to cards_path
  end

  def capture
    # p params[:kanji_data]
  end

  def new_capture
    new_kanji = params[:kanji_data]
    @card = Card.new
    @card.user_id = current_user.id
    @card.kanji_id = Kanji.find_by(character: new_kanji).id

    if @card.save!
      redirect_to @card, notice: 'New card was successfully saved to your colletion!.'
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
