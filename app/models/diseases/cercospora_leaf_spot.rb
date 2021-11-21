class CercosporaLeafSpot < Disease
  def severities_from_totals(selected_dates, last_7_days, last_2_days)
    if last_2_days == []
      logger.warn("Cercospora Leaf Spot :: No weather data for last 2 days!")
      last_7_days.map do |point|
        {
          lat: point[:lat],
          long: point[:long],
          severity: total_to_severity(point[:total], 0)
        }
      end
    elsif last_7_days == []
      logger.error("Cercospora Leaf Spot :: No weather data for last 7 days!")
    else
      last_7_days.zip(last_2_days).map do |pair|
        {
          lat: pair[0][:lat],
          long: pair[0][:long],
          severity: total_to_severity(pair[0][:total], pair[1][:total])
        }
      end
    end
  end

  def total_to_severity(last_7_days, last_2_days)
    avg7 = last_7_days / 7
    avg2 = last_2_days / 2

    return 4 if avg2 >= 5.5 || avg7 >= 5
    return 3 if avg2 >= 3.5 || avg7 >= 3
    return 2 if avg2 >= 2 || avg7 >= 1.5
    return 1 if avg2 >= 1 || avg7 >= 0.5
    0
  end

  def severity_legend
    [
      {name: "Very High", slug: "very_high", description: "Very high likelihood of disease (2-day average DIVs 5.5-7 or 7-day average 5-7)"},
      {name: "High", slug: "high", description: "High likelihood of disease (2-day average DIVs 3.5-5.5 or 7-day average 3-5)"},
      {name: "Medium", slug: "medium", description: "Medium likelihood of disease (2-day average DIVs 2-3.5 or 7-day average 1.5-3)"},
      {name: "Low", slug: "low", description: "Low likelihood of disease (2-day average DIVs 1-2 or 7-day average 0.5-1.5)"},
      {name: "Very Low", slug: "very_low", description: "Very low likelihood of disease (2-day average DIVs < 1 or 7-day average < 0.5)"}
    ]
  end

  def biofix_date
    Date.today - 14.days
  end
end
