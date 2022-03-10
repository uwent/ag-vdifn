# This model needs to use selected_dates

class LateBlight < Disease
  def severities_from_totals(grid)
    grid.map do |point|
      {
        lat: point[:lat],
        long: point[:long],
        severity: (point[:freeze] || 0) > 0 ? 0 : total_to_severity(point[:total], point[:seven_day])
      }
    end
  end

  def total_to_severity(total, seven_day)
    return 4 if seven_day >= 21 && total >= 30
    return 3 if seven_day >= 14 && total >= 30
    return 2 if seven_day >= 3 || total >= 30
    return 1 if seven_day >= 1 && total < 30
    0
  end

  def severity_legend
    [
      {name: "Very High", slug: "very_high", description: "Very high likelihood of disease (7-day accumulated DSVs ≥ 21 and season accumulated DSVs > 30)"},
      {name: "High", slug: "high", description: "High likelihood of disease (7-day accumulated DSVs 14-20 and season accumulated DSVs > 30)"},
      {name: "Medium", slug: "medium", description: "Medium likelihood of disease (7-day accumulated DSVs 3-14 or season accumulated DSVs > 30)"},
      {name: "Low", slug: "low", description: "Low likelihood of disease (7-day accumulated DSVs 1-2 and season accumulated DSVs < 30)"},
      {name: "Very Low", slug: "very_low", description: "Very low likelihood of disease (7-day DSVs = 0 and season DSVs < 30"}
    ]
  end

  def biofix_date
    Date.today - 14.days
  end
end
