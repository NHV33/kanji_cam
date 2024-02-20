require "csv"

$kanji_csv_path = Rails.root.join("lib", "seeds", "joyo.csv")

class KanjiData
  attr_reader :exists, :row, :character, :radical, :jlpt, :grade, :strokes, :frequency, :meaning_list, :on_reading_list, :kun_reading_list

  def initialize(search_term)
    row = find(search_term)

    if row.nil?
      @exists = false

    else
      @exists = true
      @row = row
      @character = row["kanji"]
      @radical = row["radical"]
      @jlpt = row["jlpt"].nil? || row["jlpt"].empty? ? 0 : row["jlpt"].to_i
      @grade = row["grade"] == "S" ? 7 : row["grade"].to_i
      @strokes = row["strokes"].to_i
      @frequency = row["frequency"].nil? || row["frequency"].empty? ? 9_999_999 : row["frequency"].to_i
      @meaning_list = row["meanings"].nil? || row["meanings"].empty? ? [] : row["meanings"].split("|")
      @on_reading_list = row["on"].nil? || row["on"].empty? ? [] : row["on"].split("|")
      @kun_reading_list = row["kun"].nil? || row["kun"].empty? ? [] : row["kun"].split("|")
    end
  end

  def exists?
    return @exists
  end

  private

  def find(search_term)
    search_col = "kanji"
    search_col = "index" if search_term.is_a?(Integer)
    search_term = search_term.to_s

    CSV.foreach($kanji_csv_path, headers: true).with_index(1) do |row, index|
      if row[search_col] == search_term
        return row
      end
    end

    return nil #if no matches found
  end
end

# If implemented using a class method: <== chose NOT to do this

# example_kanji = KanjiData.find(444)
# p example_kanji[:character]

# ---------------------------------------------

# If implemented using an instance method: <== chose to do this
# Lets us use dot notation, which is more
# consistent with the rest of the ActiveRecord
# code (e.g., "Card.all.first", etc.)

# example_kanji = KanjiData.new(2200)
# p example_kanji.exists?
