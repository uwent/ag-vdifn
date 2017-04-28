class AddInfoToPests < ActiveRecord::Migration
  def change
    add_column :pests, :info, :string
  end
end
