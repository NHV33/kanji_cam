class Kanji < ApplicationRecord
  validates :character, presence: true # Validate length
  validates :stroke_count, presence: true
  validates :character, presence: true, length: { is: 1 }

  acts_as_taggable_on :meanings
  acts_as_taggable_on :on_readings
  acts_as_taggable_on :kun_readings
end
