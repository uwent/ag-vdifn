class BotrytisLeafBlight < Disease
  def severities_from_totals(grid)
    grid.map do |point|
      {
        lat: point[:lat],
        long: point[:long],
        severity: total_to_severity(point[:total], point[:freeze] || 0)
      }
    end
  end

  def total_to_severity(total, freeze)
    return 0 if total == 0 || freeze > 0
    return 1 if total < 21
    return 2 if total < 31
    return 3 if total < 40
    return 4 if total >= 40
    0
  end

  def severity_legend
    [
      {name: "CDSI > 40", slug: "very_high", description: "Very high risk of disease (cumulative disease severity index > 40)"},
      {name: "Threshold 2", slug: "high", description: "High risk of disease (cumulative disease severity index 31-40)"},
      {name: "Threshold 1", slug: "medium", description: "Moderate risk of disease (cumulative disease severity index 21-30)"},
      {name: "CDSI < 21", slug: "low", description: "Low risk of disease (cumulative disease severity index < 21)"},
      {name: "No DSI", slug: "very_low", description: "Very low risk of disease (no accumulated disease severity index in season, or end-of-season freeze has occurred)"}
    ]
  end

  def biofix_label
    "Emergence date"
  end
end
