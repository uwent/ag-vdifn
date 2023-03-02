class EarlyBlight < Disease
  def severities_from_totals(grid)
    grid.collect do |point|
      {
        lat: point[:lat],
        long: point[:long],
        value: total_to_severity(point[:total], point[:avg7])
      }
    end
  end

  def total_to_severity(total, avg7)
    if total >= 300
      return 4 if avg7 > 8
      return 3 if avg7 >= 5
      return 2 if avg7 >= 3
      return 1 if avg7 >= 1
    else
      return 3 if total >= 250
      return 2 if total >= 200
      return 1 if total >= 150
    end
    0
  rescue
    nil
  end

  def severity_legend
    [
      {name: "Very Low", slug: "very_low", description: "Very low likelihood of disease (accumulated P-Days < 150 or P-Days > 300 and 7-day average < 1)"},
      {name: "Low", slug: "low", description: "Low likelihood of disease (accumulated P-Days > 150 or P-Days > 300 and 7-day average between 1-3)"},
      {name: "Medium", slug: "medium", description: "Medium likelihood of disease (accumulated P-Days > 200 or P-Days > 300 and 7-day average between 3-5)"},
      {name: "High", slug: "high", description: "High likelihood of disease (accumulated P-Days > 250, or P-Days > 300 and 7-day average between 5-8)"},
      {name: "Very High", slug: "very_high", description: "Very high likelihood of disease (accumulated P-Days > 300 and 7-day average > 8)"}
    ]
  end

  def biofix_label
    "Crop emergence date"
  end
end
