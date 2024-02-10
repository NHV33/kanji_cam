class Deck < ApplicationRecord
  belongs_to :user
  has_many :entries
  has_many :cards, through: :entries
end
