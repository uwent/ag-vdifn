class CabbageLooper < DegreeDayPest
  def total_to_severity(total)
    start1 = 325
    peak1 = 520
    stop1 = 750
    return sev(start1, peak1, stop1, total) if total.between?(start1, stop1)
    start2 = 1115
    peak2 = 1310
    stop2 = 1540
    return sev(start2, peak2, stop2, total) if total.between?(start2, stop2)
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

private
  def sev(start, peak, stop, total)
    a = ((peak - start) / 3.5).round(0)
    b = ((stop - peak) / 3.5).round(0)
    return 4 if total.between?(start + a * 3, stop - b * 3)
    return 3 if total.between?(start + a * 2, stop - b * 2)
    return 2 if total.between?(start + a, stop - b)
    return 1 if total.between?(start, stop)
    return 0
  end
end
