require "test_helper"

class KanjisControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get kanjis_show_url
    assert_response :success
  end
end
