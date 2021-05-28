class AddLocalNameToPest < ActiveRecord::Migration[6.1]
  def change
    add_column :pests, :local_name, :string
  end
end
