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
csv_file_path = Rails.root.join("lib", "seeds", "joyo.csv")

CSV.foreach(csv_file_path, headers: true).with_index(1) do |row, index|
  # break if index > 100

  if Kanji.where(character: row['kanji']).empty?
    kanji = Kanji.new(
    character: row["kanji"],
    radical: row["radical"],
    jlpt: row["jlpt"].nil? || row["jlpt"].empty? ? 0 : row["jlpt"].to_i,
    grade: row["grade"] == "S" ? 7 : row["grade"].to_i,
    strokes: row["strokes"].to_i,
    frequency: row["frequency"].nil? || row["frequency"].empty? ? 9_999_999 : row["frequency"].to_i,
    meanings: row["meanings"].nil? || row["meanings"].empty? ? [] : row["meanings"].split("|"),
    on_readings: row["on"].nil? || row["on"].empty? ? [] : row["on"].split("|"),
    kun_readings: row["kun"].nil? || row["kun"].empty? ? [] : row["kun"].split("|")
  )
    kanji.save!
    puts "Saved NEW Kanji: #{row["kanji"]} # #{index}"
  else
    puts "Kanji ALREADY saved: #{row["kanji"]} # #{index}"
  end
end

# Card seeds
if Card.all.empty?
  Kanji.limit(64).all.each do |kanji|
    card = Card.new(
      user_id: User.find_by(email: "test@me.com").id,
      kanji_id: kanji.id,
      learned: [true, false].sample,
      practice_count: rand(1..5),
      prev_practice_at: nil,
      next_practice_at: nil,
      latitude: rand(35.65...35.69),
      longitude: rand(139.70...139.75),
      favorite: false,
      comment: nil,
    )
    card.save!
    puts "Saved Card: # #{kanji.id}"
  end
end

# Deck seeds
Deck.destroy_all #to clear out decks with names including "un-learned"

if Deck.all.empty?
  user = User.find_by(email: "test@me.com")

  beginner_deck = Deck.new(
    user_id: user.id,
    title: "Beginner Kanji Deck",
    comment: "A deck containing basic Kanji characters for beginners.",
    custom_deck: true
  )
  beginner_deck.save!

  intermediate_deck = Deck.new(
    user_id: user.id,
    title: "Intermediate Kanji Deck",
    comment: "A deck containing intermediate level Kanji characters.",
    custom_deck: true
  )
  intermediate_deck.save!
  puts "Decks saved."
end

# Entry seeds
if Entry.all.empty?
  beginner_deck = Deck.find_by(title: "Beginner Kanji Deck")
  intermediate_deck = Deck.find_by(title: "Intermediate Kanji Deck")

  beginner_cards = Card.joins(:kanji).where(kanjis: { jlpt: [4, 5] }).order("RANDOM()").limit(5)
  beginner_cards.each do |card|
    beginner_deck.entries.create(card_id: card.id)
  end
  intermediate_cards = Card.joins(:kanji).where(kanjis: { jlpt: [2, 3] }).order("RANDOM()").limit(5)
  intermediate_cards.each do |card|
    intermediate_deck.entries.create(card_id: card.id)
  end

  puts "Entries saved."
end
