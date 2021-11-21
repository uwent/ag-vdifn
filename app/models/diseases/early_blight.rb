class EarlyBlight < Disease
  def severities_from_totals(selected_dates, past_week, last_2_days = nil)
    selected_dates.zip(past_week).map do |pair|
      {
        lat: pair[0][:lat],
        long: pair[0][:long],
        severity: total_to_severity(pair[0][:total], pair[1][:avg])
      }
    end
  end

  def total_to_severity(selected_dates, past_week_avg)
    if selected_dates >= 300
      return 4 if past_week_avg > 8
      return 3 if past_week_avg >= 5
      return 2 if past_week_avg >= 3
      return 1 if past_week_avg >= 1
    else
      return 3 if selected_dates >= 250
      return 2 if selected_dates >= 200
      return 1 if selected_dates >= 150
    end
    0
  end

  def severity_legend
    [
      {name: "Very High", slug: "very_high", description: "Very high likelihood of disease (accumulated P-Days > 300 and 7-day average > 8)"},
      {name: "High", slug: "high", description: "High likelihood of disease (accumulated P-Days > 250, or P-Days > 300 and 7-day average between 5-8)"},
      {name: "Medium", slug: "medium", description: "Medium likelihood of disease (accumulated P-Days > 200 or P-Days > 300 and 7-day average between 3-5)"},
      {name: "Low", slug: "low", description: "Low likelihood of disease (accumulated P-Days > 150 or P-Days > 300 and 7-day average between 1-3)"},
      {name: "Very Low", slug: "very_low", description: "Very low likelihood of disease (accumulated P-Days < 150 or P-Days > 300 and 7-day average < 1)"}
    ]
  end
end
