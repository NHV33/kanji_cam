class Kanji < ApplicationRecord
  has_many :cards, dependent: :destroy
  validates :character, presence: true, length: { is: 1 } #validate length
  validates :grade, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true
  validates :strokes, presence: true, numericality: { greater_than: 0 }
  validates :jlpt, inclusion: { in: 0..5 }
  validates :frequency, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true

  acts_as_taggable_on :meanings, :on_readings, :kun_readings
end

# presence validation not needed for radical (there is kanji without radical)
