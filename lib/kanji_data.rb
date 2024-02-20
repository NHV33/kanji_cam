require "csv"

$csv_file_path = Rails.root.join("lib", "seeds", "joyo.csv")

class KanjiData
  attr_reader :row, :character, :radical, :jlpt, :grade, :strokes, :frequency, :meaning_list, :on_reading_list, :kun_reading_list

  # def initialize(search_term)
    # @row = self.find(search_term)
    # @character = row["kanji"]
    # @radical = row["radical"]
    # @jlpt = row["jlpt"].nil? || row["jlpt"].empty? ? 0 : row["jlpt"].to_i
    # @grade = row["grade"] == "S" ? 7 : row["grade"].to_i
    # @strokes = row["strokes"].to_i
    # @frequency = row["frequency"].nil? || row["frequency"].empty? ? 9_999_999 : row["frequency"].to_i
    # @meaning_list = row["meanings"].nil? || row["meanings"].empty? ? [] : row["meanings"].split("|")
    # @on_reading_list = row["on"].nil? || row["on"].empty? ? [] : row["on"].split("|")
    # @kun_reading_list = row["kun"].nil? || row["kun"].empty? ? [] : row["kun"].split("|")
  def initialize
    @row = nil
    @character = nil
    @radical = nil
    @jlpt = nil
    @grade = nil
    @strokes = nil
    @frequency = nil
    @meaning_list = nil
    @on_reading_list = nil
    @kun_reading_list = nil
  end

  # def find(search_term)
  def self.find(search_term)
    search_col = "kanji"
    search_col = "index" if search_term.is_a?(Integer)
    search_term = search_term.to_s

    CSV.foreach($csv_file_path, headers: true).with_index(1) do |row, index|
      if row[search_col] == search_term
        return {
          character: row["kanji"],
          radical: row["radical"],
          jlpt: row["jlpt"].nil? || row["jlpt"].empty? ? 0 : row["jlpt"].to_i,
          grade: row["grade"] == "S" ? 7 : row["grade"].to_i,
          strokes: row["strokes"].to_i,
          frequency: row["frequency"].nil? || row["frequency"].empty? ? 9_999_999 : row["frequency"].to_i,
          meaning_list: row["meanings"].nil? || row["meanings"].empty? ? [] : row["meanings"].split("|"),
          on_reading_list: row["on"].nil? || row["on"].empty? ? [] : row["on"].split("|"),
          kun_reading_list: row["kun"].nil? || row["kun"].empty? ? [] : row["kun"].split("|"),
        }
      end
    end
  end
end



# example_kanji = KanjiData.find(444)

# p example_kanji[:character]
# row = test.row
# kun = test.kun_reading_list
# on = test.on_reading_list
# puts "found: #{on}, #{kun} #{row["kanji"]}"


# return {
#   character: row["kanji"],
#   radical: row["radical"],
#   jlpt: row["jlpt"].nil? || row["jlpt"].empty? ? 0 : row["jlpt"].to_i,
#   grade: row["grade"] == "S" ? 7 : row["grade"].to_i,
#   strokes: row["strokes"].to_i,
#   frequency: row["frequency"].nil? || row["frequency"].empty? ? 9_999_999 : row["frequency"].to_i,
#   meaning_list: row["meanings"].split("|"),
#   on_reading_list: row["on"].split("|"),
#   kun_reading_list: row["kun"].split("|")
# }
