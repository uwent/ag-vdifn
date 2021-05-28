class AddRiskArrayToPest < ActiveRecord::Migration[6.1]
  def change
    add_column :pests, :risk_array, :integer, array: true
  end
end
