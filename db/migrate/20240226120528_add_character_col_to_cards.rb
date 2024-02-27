class AddCharacterColToCards < ActiveRecord::Migration[7.1]
  def change
    add_column :cards, :character, :string, default: nil
  end
end
