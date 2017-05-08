class DegreeDayPest < Pest

  def biofix_date
    Date.current.beginning_of_year
  end

  def total_to_severity(total)
    return 5 if very_high.include?(total)
    return 4 if high.include?(total)
    return 3 if moderate.include?(total)
    return 2 if low.include?(total)
    return 1
  end

  def severity_legend
    [
      {name: "Very High", slug: "very_high",
       description: "Very high likelihood (accumulated degree days between #{very_high.min} and #{very_high.max})"},
      {name: "High", slug: "high",
       description: "High likelihood (accumulated degree days between #{high.min} and #{high.max})"},
      {name: "Medium", slug: "medium",
       description: "Medium likelihood (accumulated degree days between #{moderate.min} and #{moderate.max})"},
      {name: "Low", slug: "low",
       description: "Low likelihood (accumulated degree days between #{low.min} and #{low.max})"},
      {name: "Very Low", slug: "very_low",
       description: "Very low likelihood (accumulated degree days less than #{low.min} or greater than #{low.max})"}
    ]
  end

  private
  def very_high
    (critical_value * 0.95).round(0)..(critical_value * 1.05).round(0)
  end

  def high
    (critical_value * 0.9).round(0)..(critical_value * 1.1).round(0)
  end

  def moderate
    (critical_value * 0.85).round(0)..(critical_value * 1.15).round(0)
  end

  def low
    (critical_value * 0.8).round(0)..(critical_value * 1.2).round(0)
  end
end
