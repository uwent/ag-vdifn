# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_09_03_151416) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "crop_pests", id: :serial, force: :cascade do |t|
    t.integer "crop_id"
    t.integer "pest_id"
  end

  create_table "crops", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "pests", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "remote_name"
    t.string "info"
    t.string "link"
    t.integer "biofix_mm"
    t.integer "biofix_dd"
    t.float "critical_value"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "photo"
    t.float "t_max"
    t.float "t_min"
  end

end
