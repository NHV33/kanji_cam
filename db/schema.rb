# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_02_29_103816) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "cards", force: :cascade do |t|
    t.bigint "kanji_id", null: false
    t.bigint "user_id", null: false
    t.boolean "learned"
    t.integer "practice_count"
    t.datetime "prev_practice_at"
    t.datetime "next_practice_at"
    t.float "latitude"
    t.float "longitude"
    t.boolean "favorite"
    t.text "comment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "character"
    t.index ["kanji_id"], name: "index_cards_on_kanji_id"
    t.index ["user_id"], name: "index_cards_on_user_id"
  end

  create_table "decks", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "title"
    t.text "comment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "custom_deck", default: false
    t.index ["user_id"], name: "index_decks_on_user_id"
  end

  create_table "entries", force: :cascade do |t|
    t.bigint "card_id", null: false
    t.bigint "deck_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["card_id"], name: "index_entries_on_card_id"
    t.index ["deck_id"], name: "index_entries_on_deck_id"
  end

  create_table "kanjis", force: :cascade do |t|
    t.string "character"
    t.string "radical"
    t.integer "jlpt"
    t.integer "grade"
    t.integer "strokes"
    t.integer "frequency"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "meanings", default: [], array: true
    t.string "on_readings", default: [], array: true
    t.string "kun_readings", default: [], array: true
    t.string "old_form"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "point"
    t.integer "points", default: 0
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "cards", "kanjis"
  add_foreign_key "cards", "users"
  add_foreign_key "decks", "users"
  add_foreign_key "entries", "cards"
  add_foreign_key "entries", "decks"
end
