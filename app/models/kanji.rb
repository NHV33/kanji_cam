class Kanji < ApplicationRecord
  validates :character, presense: :true #validate length
  validates :strokes, presense: :true

  acts_as_taggable_on :meanings
  acts_as_taggable_on :on_readings
  acts_as_taggable_on :kun_readings
end
