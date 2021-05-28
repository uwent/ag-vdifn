class SeedcornMaggot < Insect

  def total_to_severity(total, freezing, end_date)
    return 0 if freezing
    return sev_ramp(risk_start, risk_peak, risk_end, total) if total.between?(risk_start, risk_end)
    return sev_ramp(risk_start2, risk_peak2, risk_end2, total) if total.between?(risk_start2, risk_end2)
    return sev_ramp(1735, 1800, 1865, total) if total.between?(1735, 1865)
    return sev_ramp(2455, 2520, 2585, total) if total.between?(2455, 2585)
    return sev_ramp(3175, 3240, 3305, total) if total.between?(3175, 3305)
    return 0
  end

end
