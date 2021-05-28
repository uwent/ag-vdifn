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

ActiveRecord::Schema.define(version: 2021_05_28_174203) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "crop_pests", force: :cascade do |t|
    t.integer "crop_id"
    t.integer "pest_id"
  end

  create_table "crops", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "pests", force: :cascade do |t|
    t.string "type"
    t.string "name"
    t.string "remote_name"
    t.integer "biofix_mm"
    t.integer "biofix_dd"
    t.float "t_max"
    t.float "t_min"
    t.float "critical_value"
    t.string "info"
    t.string "severity_info"
    t.string "photo"
    t.string "link"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "risk_start"
    t.integer "risk_peak"
    t.integer "risk_end"
    t.integer "risk_start2"
    t.integer "risk_peak2"
    t.integer "risk_end2"
    t.string "local_name"
  end

end
