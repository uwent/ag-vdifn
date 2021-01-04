class AddSeverityInfoToPest < ActiveRecord::Migration[6.0]
  def change
    add_column :pests, :severity_info, :string
  end
end
