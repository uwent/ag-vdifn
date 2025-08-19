class Pest < ApplicationRecord
  has_many :crop_pests, dependent: :destroy
  has_many :crops, through: :crop_pests
  attr_accessor :end_date

  def severities_from_totals(*args)
  end

  def total_to_severity(*args)
  end

  def severity_legend
  end

  def biofix_date
    Date.new(Date.current.year, biofix_mm || 1, biofix_dd || 1)
  end

  def biofix_label
    "Start date"
  end
end
