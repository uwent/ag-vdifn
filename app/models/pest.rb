class Pest < ApplicationRecord
  has_many :crop_pests, dependent: :destroy
  has_many :crops, through: :crop_pests
  attr_accessor :end_date

  def severities_from_totals(totals, end_date)
    # totals.map do |point|
    #   {
    #     lat: point[:lat],
    #     long: point[:long],
    #     severity: total_to_severity(point[:total].to_f, point[:freeze], end_date)
    #   }
    # end
  end

  def total_to_severity
  end

  def biofix_date
    Date.new(Date.current.year, (biofix_mm || 1), (biofix_dd || 1))
  end

  def biofix_label
    "Start date"
  end

  def end_date_enabled
    true
  end
end
