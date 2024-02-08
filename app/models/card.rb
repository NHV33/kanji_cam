class Card < ApplicationRecord
  belongs_to :kanji
  belongs_to :user
end
