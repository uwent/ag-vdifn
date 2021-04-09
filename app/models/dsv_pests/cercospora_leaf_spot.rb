class CercosporaLeafSpot < DsvPest

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
    avg7 = last_7_days / 7
    avg2 = last_2_days / 2

    return 4 if avg2 >= 6 || avg7 >= 5
    return 3 if avg2 >= 3.5 || avg7 >= 3
    return 2 if avg2 >= 1.5 || avg7 >= 1.25
    return 1 if avg2 >= 0.5 || avg7 >= 0.25
    return 0
  end

  def severity_legend
    [
      {name: "Very High", slug: "very_high", description: "Very high likelihood of disease (2-day average DIVs ≥ 6 or 7-day average ≥ 5)"},
      {name: "High", slug: "high", description: "High likelihood of disease (2-day average DIVs ≥ 3.5 or 7-day average ≥ 3)"},
      {name: "Medium", slug: "medium", description: "Medium likelihood of disease (2-day average DIVs ≥ 1.5 or 7-day average ≥ 1.25)"},
      {name: "Low", slug: "low", description: "Low likelihood of disease (2-day average DIVs ≥ 0.5 or 7-day average ≥ 0.25)"},
      {name: "Very Low", slug: "very_low", description: "Very low likelihood of disease (2-day average DIVs < 0.5 or 7-day average < 0.25)"}
    ]
  end

  def biofix_date
    14.days.ago.to_date
  end
end
