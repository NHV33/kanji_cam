class ChangeColumnTypeOfKanjiInCards < ActiveRecord::Migration[7.1]
  def change
    change_column :cards, :kanji_id, :integer
  end
end

# t.references :kanji, null: false, foreign_key: true
