class ChangeMeaningsToArrayType < ActiveRecord::Migration[7.1]
  def change
    add_column :kanjis, :meanings, :string, array: true, default: []
    add_column :kanjis, :on_readings, :string, array: true, default: []
    add_column :kanjis, :kun_readings, :string, array: true, default: []
  end
end
