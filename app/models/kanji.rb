class Kanji < ApplicationRecord
  validates :character, presense: :true #validate length
  validates :strokes, presense: :true
end
