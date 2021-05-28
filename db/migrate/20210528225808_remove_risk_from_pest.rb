class RemoveRiskFromPest < ActiveRecord::Migration[6.1]
  def change
    remove_column :pests, :risk_start, :integer
    remove_column :pests, :risk_peak, :integer
    remove_column :pests, :risk_end, :integer
    remove_column :pests, :risk_start2, :integer
    remove_column :pests, :risk_peak2, :integer
    remove_column :pests, :risk_end2, :integer
  end
end
