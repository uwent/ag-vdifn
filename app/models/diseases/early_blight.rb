class EarlyBlight < Disease
  def severities_from_totals(grid)
    grid.collect do |point|
      {
        lat: point[:lat],
        lng: point[:lng],
        value: total_to_severity(point[:total], point[:avg7])
      }
    end
  end

  def total_to_severity(total, avg7)
    if total >= 450
      return 4 if avg7 > 8
      return 3 if avg7 >= 5
      return 2 if avg7 >= 3
      return 1 if avg7 >= 1
    else
      return 4 if total >= 400
      return 3 if total >= 350
      return 2 if total >= 300
      return 1 if total >= 250
    end
    0
  rescue
    nil
  end

  def severity_legend
    [
      {value: 0, name: "Very Low", description: "Very low likelihood of disease (accumulated P-days < 250 or 7-day average < 1)"},
      {value: 1, name: "Low", description: "Low likelihood of disease (accumulated P-days 250-300 or 7-day average 1-3/day)"},
      {value: 2, name: "Medium", description: "Medium likelihood of disease (accumulated P-days 300-350 or 7-day average 3-5/day)"},
      {value: 3, name: "High", description: "High likelihood of disease (accumulated P-days 350-400 or 7-day average 5-8/day)"},
      {value: 4, name: "Very High", description: "Very high likelihood of disease (accumulated P-days 400-450 or 7-day average >8/day)"}
    ]
  end

  def biofix_label
    "Crop emergence date"
  end
end
