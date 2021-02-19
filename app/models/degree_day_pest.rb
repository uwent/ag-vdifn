class DegreeDayPest < Pest
  def total_to_severity(total, after_november_first, freezing)
    return 0 if after_november_first && freezing
    return sev_ramp(risk_start, risk_peak, risk_end, total) if total.between?(risk_start, risk_end)
    return 0
  end

  def severity_legend
    [
      {name: "Very High", slug: "very_high", description: "Very high likelihood of pest presence or damage"},
      {name: "High", slug: "high", description: "High likelihood of pest presence or damage"},
      {name: "Medium", slug: "medium", description: "Medium likelihood of pest presence or damage"},
      {name: "Low", slug: "low", description: "Low likelihood of pest presence or damage"},
      {name: "Very Low", slug: "very_low", description: "Very low likelihood of pest presence or damage"}
    ]
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

# pests with two generations per year
class DegreeDayPest2 < DegreeDayPest
  def total_to_severity(total, after_november_first, freezing)
    return 0 if after_november_first && freezing
    return sev_ramp(risk_start, risk_peak, risk_end, total) if total.between?(risk_start, risk_end)
    return sev_ramp(risk_start2, risk_peak2, risk_end2, total) if total.between?(risk_start2, risk_end2)
    return 0
  end
end

# pests with more than two generations per year
class SeedcornMaggot < DegreeDayPest
  def total_to_severity(total, after_november_first, freezing)
    return 0 if after_november_first && freezing
    return sev_ramp(risk_start, risk_peak, risk_end, total) if total.between?(risk_start, risk_end)
    return sev_ramp(risk_start2, risk_peak2, risk_end2, total) if total.between?(risk_start2, risk_end2)
    return sev_ramp(1735, 1800, 1865, total) if total.between?(1735, 1865)
    return sev_ramp(2455, 2520, 2585, total) if total.between?(2455, 2585)
    return sev_ramp(3175, 3240, 3305, total) if total.between?(3175, 3305)
    return 0
  end
end

class Thrips < DegreeDayPest
  def total_to_severity(total, after_november_first, freezing)
    return 0 if after_november_first && freezing
    return sev_ramp(risk_start, risk_peak, risk_end, total) if total.between?(risk_start, risk_end)
    return sev_ramp(risk_start2, risk_peak2, risk_end2, total) if total.between?(risk_start2, risk_end2)
    return sev_ramp(1685, 2025, 2360, total) if total.between?(1685, 2360)
    return sev_ramp(2360, 2700, 3375, total) if total.between?(2360, 3375)
    return 0
  end
end
