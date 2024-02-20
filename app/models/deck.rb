class Deck < ApplicationRecord
  belongs_to :user
  has_many :entries, dependent: :destroy
  has_many :cards, through: :entries#, source: :decks

  validates :title, presence: true
end
