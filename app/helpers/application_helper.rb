module ApplicationHelper
  # Checks if the provided path is the current page
  def active_page?(paths)
    is_current_page_included_in_paths = paths.any? { |path| current_page?(path) }
    return 'navbar-icon-active' if is_current_page_included_in_paths
  end
end
