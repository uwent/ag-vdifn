class Pest < ApplicationRecord
  has_many :crop_pests, dependent: :destroy
  has_many :crops, through: :crop_pests

  def severities_from_totals(totals, end_date)
    totals.map do |grid|
      {
        lat: grid[:lat],
        long: grid[:long],
        severity: total_to_severity(
          grid[:total].to_f,
          grid[:freeze],
          end_date)
      }
    end
  end

  def total_to_severity(total, freezing, end_date)
    return 0
  end

  def biofix_date
    Date.new(Date.current.year, (biofix_mm || 1), (biofix_dd || 1))
  end

  def end_date_enabled
    true
  end

end
