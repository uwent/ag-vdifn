# This model needs to use selected_dates

class LateBlight < Disease
  def severities_from_totals(grid)
    grid.map do |point|
      freezing = (point[:freeze] || 0) > 0
      severity = freezing ? 0 : total_to_severity(point[:total], point[:season_total])
      {
        lat: point[:lat],
        long: point[:long],
        severity:
      }
    end
  end

  def total_to_severity(total, season_total)
    return 4 if total >= 21 && season_total >= 30
    return 3 if total >= 14 && season_total >= 30
    return 2 if total >= 3 || season_total >= 30
    return 1 if total >= 1 && season_total < 30
    0
  end

  def severity_legend
    [
      {name: "Very High", slug: "very_high", description: "Very high likelihood of disease (accumulated DSVs ≥ 21 and season accumulated DSVs > 30)"},
      {name: "High", slug: "high", description: "High likelihood of disease (accumulated DSVs 14-20 and season accumulated DSVs > 30)"},
      {name: "Medium", slug: "medium", description: "Medium likelihood of disease (accumulated DSVs 3-14 or season accumulated DSVs > 30)"},
      {name: "Low", slug: "low", description: "Low likelihood of disease (accumulated DSVs 1-2 and season accumulated DSVs < 30)"},
      {name: "Very Low", slug: "very_low", description: "Very low likelihood of disease (DSVs = 0 and season DSVs < 30"}
    ]
  end

  def biofix_label
    "Crop emergence/last fungicide application"
  end

  def biofix_date
    Date.today - 7.days
  end
end
