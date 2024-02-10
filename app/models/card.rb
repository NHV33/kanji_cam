class Card < ApplicationRecord
  belongs_to :kanji
  belongs_to :user
  has_many :decks, through: :entries#, source: :cards

  validates :user_id, presence: true
  validates :kanji_id, presence: true
  validates :practice_count, presence: true
  validates :latitude , numericality: { greater_than_or_equal_to:  -90, less_than_or_equal_to:  90 }
  validates :longitude, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }
end
