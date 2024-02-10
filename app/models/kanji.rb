class Kanji < ApplicationRecord
  validates :character, presence: true # Validate length
  validates :stroke_count, presence: true
  validates :character, presence: true, length: { is: 1 }

  acts_as_taggable_on :meanings, :on_readings, :kun_readings
end
