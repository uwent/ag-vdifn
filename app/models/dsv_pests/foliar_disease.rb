class FoliarDisease < DsvPest

  def severities_from_totals(selected_dates, last_7_days, last_2_days)
    selected_dates.zip(last_7_days, last_2_days).map do |pair|
      {
        lat: pair[0][:lat],
        long: pair[0][:long],
        severity: total_to_severity(
          pair[0][:total],
          pair[1][:total],
          pair[2][:total]
        )
      }
    end
  end

  def total_to_severity(selected_dates, last_7_days, last_2_days)
    return 4 if last_7_days >= 20
    return 3 if last_7_days >= 15
    return 2 if last_7_days >= 10
    return 1 if last_7_days >= 5
    return 0
  end

  def severity_legend
    [
      {name: "Very High", slug: "very_high", description: "Very high likelihood of disease (accumulated DSVs ≥ 20)"},
      {name: "High", slug: "high", description: "High likelihood of disease (15 ≤ accumulated DSVs < 20)"},
      {name: "Medium", slug: "medium", description: "Medium likelihood of disease (10 ≤ accumulated DSVs < 15)"},
      {name: "Low", slug: "low", description: "Low likelihood of disease (5 ≤ accumulated DSVs < 10)"},
      {name: "Very Low", slug: "very_low", description: "Very low likelihood of disease (accumulated DSVs < 5)"}
    ]
  end

  def biofix_date
    7.days.ago.to_date
  end
end
