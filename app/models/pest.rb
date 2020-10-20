class Pest < ApplicationRecord
  has_many :crop_pests, dependent: :destroy
  has_many :crops, through: :crop_pests

  def severities_from_totals(totals)
    totals.map do |measurement|
      {
        lat: measurement[:lat],
        long: measurement[:long],
        severity: total_to_severity(measurement[:total].to_f)
      }
    end
  end

  def total_to_severity(total)
    return 0
  end

  def biofix_date
    Date.new(Date.current.year, biofix_mm, biofix_dd)
  end

  def end_date_enabled
    true
  end
end
