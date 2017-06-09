class AddImageTmaxTminToPests < ActiveRecord::Migration
  def change
    add_column :pests, :photo, :string
    add_column :pests, :t_max, :float
    add_column :pests, :t_min, :float
  end
end
