module ApplicationHelper
  # Checks if the provided path is the current page
  def active_page?(path)
    'active' if current_page?(path)
  end
end
