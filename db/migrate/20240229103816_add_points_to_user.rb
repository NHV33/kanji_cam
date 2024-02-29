class AddPointsToUser < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :points, :integer, default: 0
  end
end
