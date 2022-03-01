class EarlyBlight < Disease
  def severities_from_totals(grid)
    grid.map do |point|
      {
        lat: point[:lat],
        long: point[:long],
        severity: total_to_severity(point[:total], point[:seven_day_avg])
      }
    end
  end

  def total_to_severity(total, seven_day_avg)
    if total >= 300
      return 4 if seven_day_avg > 8
      return 3 if seven_day_avg >= 5
      return 2 if seven_day_avg >= 3
      return 1 if seven_day_avg >= 1
    else
      return 3 if total >= 250
      return 2 if total >= 200
      return 1 if total >= 150
    end
    return 0
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

  def biofix_label
    "Emergence date"
  end
end
