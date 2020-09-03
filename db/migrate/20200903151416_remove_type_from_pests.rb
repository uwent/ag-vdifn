class RemoveTypeFromPests < ActiveRecord::Migration[6.0]
  def change
    remove_column :pests, :type
  end
end
