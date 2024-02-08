class CreateCards < ActiveRecord::Migration[7.1]
  def change
    create_table :cards do |t|
      t.references :kanji, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.boolean :learned
      t.integer :practice_count
      t.datetime :prev_practice_at
      t.datetime :next_practice_at
      t.float :latitude
      t.float :longitude
      t.boolean :favorite
      t.text :comment

      t.timestamps
    end
  end
end
