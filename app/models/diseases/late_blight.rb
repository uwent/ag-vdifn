# This model needs to use selected_dates

class LateBlight < Disease
  def severities_from_totals(grid)
    grid.collect do |point|
      {
        lat: point[:lat],
        lng: point[:lng],
        value: total_to_severity(
          point[:selected_total],
          point[:season_total],
          freezing: point[:freeze]
        )
      }
    end
  end

  def total_to_severity(total, season_total, freezing: nil)
    return 0 if freezing && freezing > 0
    return 4 if total >= 21 && season_total >= 30
    return 3 if total >= 14 && season_total >= 30
    return 2 if total >= 3 || season_total >= 30
    return 1 if total >= 1 && season_total < 30
    0
  rescue
    nil
  end

  def severity_legend
    [
      {value: 0, name: "Very Low", description: "Very low likelihood of disease (DSVs = 0 and season DSVs < 30"},
      {value: 1, name: "Low", description: "Low likelihood of disease (accumulated DSVs 1-2 and season accumulated DSVs < 30)"},
      {value: 2, name: "Medium", description: "Medium likelihood of disease (accumulated DSVs 3-14 or season accumulated DSVs > 30)"},
      {value: 3, name: "High", description: "High likelihood of disease (accumulated DSVs 14-20 and season accumulated DSVs > 30)"},
      {value: 4, name: "Very High", description: "Very high likelihood of disease (accumulated DSVs ≥ 21 and season accumulated DSVs > 30)"}
    ]
  end

  def biofix_label
    "Crop emergence/last fungicide application"
  end

  def biofix_date
    Date.today - 7.days
  end
end
