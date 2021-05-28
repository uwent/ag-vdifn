class Thrips < Insect

  def total_to_severity(total, freezing, end_date)
    return 0 if freezing
    return sev_ramp(risk_start, risk_peak, risk_end, total) if total.between?(risk_start, risk_end)
    return sev_ramp(risk_start2, risk_peak2, risk_end2, total) if total.between?(risk_start2, risk_end2)
    return sev_ramp(1685, 2025, 2360, total) if total.between?(1685, 2360)
    return sev_ramp(2360, 2700, 3375, total) if total.between?(2360, 3375)
    return 0
  end

end
