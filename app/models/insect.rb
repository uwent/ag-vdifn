class Insect < Pest
  def severities_from_totals(totals, end_date)
    totals.map do |point|
      {
        lat: point[:lat],
        long: point[:long],
        severity: point[:freeze] > 0 ? 0 : total_to_severity(point[:total].to_f)
      }
    end
  end

  def total_to_severity(total)
    sev = 0
    risk_array.each do |gen|
      sev = sev_ramp(gen[0], gen[1], gen[2], total) if total.between?(gen[0], gen[2])
    end
    sev
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
    0
  end

  def biofix_label
    "Start date (Default: #{biofix_date.strftime("%b %d")})"
  end
end
