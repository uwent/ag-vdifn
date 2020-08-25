ActiveRecord::Schema.define(version: 20170608190533) do
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
