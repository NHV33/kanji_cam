class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:home, :qa]
  def home
  end

  def qa
    @topic = params[:topic]
  end

end
