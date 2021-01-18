class Pest < ApplicationRecord
  has_many :crop_pests, dependent: :destroy
  has_many :crops, through: :crop_pests

  def severities_from_totals(totals)
    totals.map do |measurement|
      {
        lat: measurement[:lat],
        long: measurement[:long],
        severity: total_to_severity(measurement[:total].to_f, measurement[:after_november_first], measurement[:freeze])
      }
    end
  end

  def total_to_severity(total, after_november_first, freezing)
    return 0
  end

  def biofix_date
    Date.new(Date.current.year, biofix_mm, biofix_dd)
  end

  def end_date_enabled
    true
  end

  def sev_ramp(start, peak, stop, total)
    a = ((peak - start) / 3.5).round(0)
    b = ((stop - peak) / 3.5).round(0)
    return 4 if total.between?(start + a * 3, stop - b * 3)
    return 3 if total.between?(start + a * 2, stop - b * 2)
    return 2 if total.between?(start + a, stop - b)
    return 1 if total.between?(start, stop)
    return 0
  end

end
