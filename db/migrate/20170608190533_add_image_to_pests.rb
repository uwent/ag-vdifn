class AddImageToPests < ActiveRecord::Migration
  def change
    add_column :pests, :photo, :string
  end
end
