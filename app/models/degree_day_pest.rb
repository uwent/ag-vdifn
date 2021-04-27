class DegreeDayPest < Pest

  def total_to_severity(total, freezing)
    return 0 if freezing
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
