# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170608190533) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "crop_pests", force: :cascade do |t|
    t.integer "crop_id"
    t.integer "pest_id"
  end

  create_table "crops", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "pests", force: :cascade do |t|
    t.string   "type"
    t.string   "name"
    t.string   "remote_name"
    t.string   "info"
    t.string   "link"
    t.integer  "biofix_mm"
    t.integer  "biofix_dd"
    t.float    "critical_value"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "photo"
    t.float    "t_max"
    t.float    "t_min"
  end

end
