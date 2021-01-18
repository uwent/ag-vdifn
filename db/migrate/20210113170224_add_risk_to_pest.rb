class AddRiskToPest < ActiveRecord::Migration[6.0]
  def change
    add_column :pests, :risk_start, :integer
    add_column :pests, :risk_peak, :integer
    add_column :pests, :risk_end, :integer
    add_column :pests, :risk_start2, :integer
    add_column :pests, :risk_peak2, :integer
    add_column :pests, :risk_end2, :integer
  end
end
