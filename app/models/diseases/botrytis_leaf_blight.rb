class BotrytisLeafBlight < Disease
  def severities_from_totals(grid)
    grid.collect do |point|
      {
        lat: point[:lat],
        lng: point[:lng],
        value: total_to_severity(point[:total], freezing: point[:freeze])
      }
    end
  end

  def total_to_severity(total, freezing: nil)
    return 0 if freezing && freezing > 0
    return 0 if total == 0
    return 1 if total < 21
    return 2 if total < 31
    return 3 if total < 40
    return 4 if total >= 40
    0
  rescue
    nil
  end

  # list low to high
  def severity_legend
    [
      {value: 0, name: "No DSV", description: "Very low risk of disease (no accumulated disease severity values in season, or end-of-season freeze has occurred)"},
      {value: 1, name: "CDSV < 21", description: "Low risk of disease (cumulative disease severity values < 21)"},
      {value: 2, name: "Threshold 1", description: "Moderate risk of disease (cumulative disease severity values 21-30)"},
      {value: 3, name: "Threshold 2", description: "High risk of disease (cumulative disease severity values 31-40)"},
      {value: 4, name: "CDSV > 40", description: "Very high risk of disease (cumulative disease severity values > 40)"}
    ]
  end

  def biofix_label
    "Emergence date"
  end
end
