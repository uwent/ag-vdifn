class CreatePests < ActiveRecord::Migration
  def change
    create_table :pests do |t|
      t.string :type
      t.string :name
      t.string :remote_name

      t.timestamps
    end
  end
end
