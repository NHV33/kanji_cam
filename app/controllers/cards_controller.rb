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
    @card = Card.new
    @card.user_id = current_user.id

    @card.latitude = params[:latitude_data]
    @card.longitude = params[:longitude_data]

    #Regex to extract kanji found within the Japanese section of the Unicode standard.
    capture_result = match_kanji(params[:kanji_data])

    if capture_result.nil?
      redirect_to dashboard_url #TODO should redirect to error page
    else
      @card.character = capture_result
      # Search for Kanji matching modern form OR old form (kyujitai)
      database_kanji = Kanji.where("character = :term OR old_form = :term", term: capture_result).first

      # If Kanji instance is not found, set ID to 1 (special hidden kanji)
      database_kanji_id = (database_kanji) ? database_kanji.id : 1;
      @card.kanji_id = database_kanji_id
      @points = current_user.points
      @points += 100
      current_user.points = @points
      current_user.save
    end

    if @card.save
      redirect_to edit_card_path(@card), notice: 'You got 100 points!'
    else
      # Redirect to show page if a Card for the Kanji already exists.
      if @card.errors[:character].present?
        duplicate_card_id = current_user.cards.find_by(character: capture_result)
        redirect_to card_path(id: duplicate_card_id, duplicate: true)
      else
        redirect_to dashboard_url #TODO should redirect to error page
      end
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

  def match_kanji(string)
    kanji_pattern = /[一-龯]{1}/
    match = string.match(kanji_pattern)
    match ? match[0] : nil
  end
end
