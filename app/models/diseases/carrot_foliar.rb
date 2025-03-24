class CarrotFoliar < Disease
  def severities_from_totals(seven_day)
    seven_day.map do |point|
      {
        lat: point[:lat],
        lng: point[:lng],
        value: total_to_severity(point[:total])
      }
    end
  end

  def total_to_severity(seven_day)
    return 4 if seven_day >= 20
    return 3 if seven_day >= 15
    return 2 if seven_day >= 10
    return 1 if seven_day >= 5
    0
  rescue
    nil
  end

  def severity_legend
    [
      {value: 0, name: "Very Low", description: "Very low likelihood of disease (accumulated DSVs < 5)"},
      {value: 1, name: "Low", description: "Low likelihood of disease (5 ≤ accumulated DSVs < 10)"},
      {value: 2, name: "Medium", description: "Medium likelihood of disease (10 ≤ accumulated DSVs < 15)"},
      {value: 3, name: "High", description: "High likelihood of disease (15 ≤ accumulated DSVs < 20)"},
      {value: 4, name: "Very High", description: "Very high likelihood of disease (accumulated DSVs ≥ 20)"}
    ]
  end

  def biofix_date
    Date.today - 14.days
  end
end
