class Card < ApplicationRecord
  belongs_to :kanji
  belongs_to :user
  has_many :decks, through: :entries#, source: :cards
end
