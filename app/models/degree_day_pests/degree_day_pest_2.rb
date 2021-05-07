# pests with two generations per year
class DegreeDayPest2 < DegreeDayPest

  def total_to_severity(total, freezing, end_date)
    return 0 if freezing
    return sev_ramp(risk_start, risk_peak, risk_end, total) if total.between?(risk_start, risk_end)
    return sev_ramp(risk_start2, risk_peak2, risk_end2, total) if total.between?(risk_start2, risk_end2)
    return 0
  end

end
