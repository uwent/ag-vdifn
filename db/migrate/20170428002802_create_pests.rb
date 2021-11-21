class CreatePests < ActiveRecord::Migration
  def change
    create_table :pests do |t|
      t.string :type
      t.string :name
      t.string :remote_name
      t.string :info
      t.string :link
      t.integer :biofix_mm
      t.integer :biofix_dd
      t.float :critical_value

      t.timestamps
    end
  end
end
