class CreateCropPests < ActiveRecord::Migration
  def change
    create_table :crop_pests do |t|
      t.integer :crop_id
      t.integer :pest_id
    end
  end
end
