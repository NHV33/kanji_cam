# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
require "csv"

csv_file_path = Rails.root.join("lib", "seeds", "joyo.csv")

CSV.foreach(csv_file_path, headers: true).with_index(1) do |row, index|
  break if index > 10

  kanji = Kanji.new(
    character: row["kanji"],
    radical: row["radical"],
    jlpt_level: row["jlpt"].nil? || row["jlpt"].empty? ? 0 : row["jlpt"].to_i,
    grade: row["grade"] == "S" ? 7 : row["grade"].to_i,
    stroke_count: row["strokes"].to_i,
    frequency: row["frequency"].nil? || row["frequency"].empty? ? 9999999 : row["frequency"].to_i,
  )
  kanji.save!

  kanji.meaning_list = row["meanings"].split("|") unless row["meanings"].nil?
  kanji.on_reading_list = row["on"].split("|") unless row["on"].nil?
  kanji.kun_reading_list = row["kun"].split("|") unless row["kun"].nil?

  p kanji
  kanji.save!
end
