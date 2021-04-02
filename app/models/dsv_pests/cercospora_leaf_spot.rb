class CercosporaLeafSpot < DsvPest

  def severities_from_totals(totals)
    totals.map do |measurement|
      {
        lat: measurement[:lat],
        long: measurement[:long],
        severity: total_to_severity(measurement[:total].to_f)
      }
    end
  end

  def total_to_severity(total)
    return 4 if total >= 7 * 6
    return 3 if total >= 7 * 4
    return 2 if total >= 7 * 2
    return 1 if total >= 7
    return 0
  end

  def severity_legend
    [
      {name: "Very High", slug: "very_high", description: "Very high likelihood of disease (average daily DIVs ≥ 6)"},
      {name: "High", slug: "high", description: "High likelihood of disease (average daily DIVs between 4 and 6)"},
      {name: "Medium", slug: "medium", description: "Medium likelihood of disease (average daily DIVs between 2 and 4)"},
      {name: "Low", slug: "low", description: "Low likelihood of disease (average daily DIVs between 1 and 2)"},
      {name: "Very Low", slug: "very_low", description: "Very low likelihood of disease (average daily DIVs < 1)"}
    ]
  end

  def biofix_date
    14.days.ago.to_date
  end
end
