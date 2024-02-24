class AddCustomColToDecks < ActiveRecord::Migration[7.1]
  def change
    add_column :decks, :custom_deck, :boolean, default: false
  end
end
