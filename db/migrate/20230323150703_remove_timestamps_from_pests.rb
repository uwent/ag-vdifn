class RemoveTimestampsFromPests < ActiveRecord::Migration[7.0]
  def change
    remove_column :pests, :created_at, :datetime
    remove_column :pests, :updated_at, :datetime
    remove_column :crops, :created_at, :datetime
    remove_column :crops, :updated_at, :datetime
    add_index :pests, :local_name, unique: true
    remove_column :pests, :critical_value, :float
  end
end
