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

# User seeds

if User.all.empty?
  user = User.new(
    email: "test@me.com",
    password: "Kanji-ga-daisuki!",
  )
  user.save!
end

# Kanji seeds
if Kanji.all.empty?
  csv_file_path = Rails.root.join("lib", "seeds", "joyo.csv")

  CSV.foreach(csv_file_path, headers: true).with_index(1) do |row, index|
    break if index > 100

    kanji = Kanji.new(
      character: row["kanji"],
      radical: row["radical"],
      jlpt: row["jlpt"].nil? || row["jlpt"].empty? ? 0 : row["jlpt"].to_i,
      grade: row["grade"] == "S" ? 7 : row["grade"].to_i,
      strokes: row["strokes"].to_i,
      frequency: row["frequency"].nil? || row["frequency"].empty? ? 9_999_999 : row["frequency"].to_i,
    )
    kanji.meaning_list = row["meanings"].split("|") unless row["meanings"].nil?
    kanji.on_reading_list = row["on"].split("|") unless row["on"].nil?
    kanji.kun_reading_list = row["kun"].split("|") unless row["kun"].nil?
    kanji.save!
  end
end

# Card seeds
if Card.all.empty?
  Kanji.all.each do |kanji|
    card = Card.new(
      user_id: User.find_by(email: "test@me.com").id,
      kanji_id: kanji.id,
      learned: false,
      practice_count: (1..5).to_a.sample,
      prev_practice_at: nil,
      next_practice_at: nil,
      latitude: rand(35.65...35.69),
      longitude: rand(139.70...139.75),
      favorite: false,
      comment: nil,
    )
    card.save!
  end
end

# Deck seeds
if Deck.all.empty?
  user = User.find_by(email: "test@me.com")

  beginner_deck = Deck.new(
    user_id: user.id,
    title: "Beginner Kanji Deck",
    comment: "A deck containing basic Kanji characters for beginners."
  )
  beginner_deck.save!

  intermediate_deck = Deck.new(
    user_id: user.id,
    title: "Intermediate Kanji Deck",
    comment: "A deck containing intermediate level Kanji characters."
  )
  intermediate_deck.save!
end

# Entry seeds
if Entry.all.empty?
  beginner_deck = Deck.find_by(title: "Beginner Kanji Deck")
  intermediate_deck = Deck.find_by(title: "Intermediate Kanji Deck")

  beginner_cards = Card.joins(:kanji).where(kanjis: { jlpt: [1, 2] }).order("RANDOM()").limit(5)
  beginner_cards.each do |card|
    beginner_deck.entries.create(card_id: card.id)
  end
  intermediate_cards = Card.joins(:kanji).where(kanjis: { jlpt: [3, 4] }).order("RANDOM()").limit(5)
  intermediate_cards.each do |card|
    intermediate_deck.entries.create(card_id: card.id)
  end
end
