class CreateKanjis < ActiveRecord::Migration[7.1]
  def change
    create_table :kanjis do |t|
      t.string :character
      t.string :radical
      t.integer :jlpt
      t.integer :grade
      t.integer :strokes
      t.integer :frequency

      t.timestamps
    end
  end
end
