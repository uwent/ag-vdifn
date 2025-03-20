class CercosporaLeafSpot < Disease
  def severities_from_totals(grid)
    grid.map do |point|
      {
        lat: point[:lat],
        long: point[:long],
        value: total_to_severity(point[:avg7], point[:avg2])
      }
    end
  end

  def total_to_severity(avg7, avg2)
    return 4 if avg7 >= 5 || avg2 >= 5.5
    return 3 if avg7 >= 3 || avg2 >= 3.5
    return 2 if avg7 >= 1.5 || avg2 >= 2
    return 1 if avg7 >= 0.5 || avg2 >= 1
    0
  rescue
    nil
  end

  def severity_legend
    [
      {value: 0, name: "Very Low", description: "Very low likelihood of disease (2-day average DSVs < 1 or 7-day average < 0.5)"},
      {value: 1, name: "Low", description: "Low likelihood of disease (2-day average DSVs 1-2 or 7-day average 0.5-1.5)"},
      {value: 2, name: "Medium", description: "Medium likelihood of disease (2-day average DSVs 2-3.5 or 7-day average 1.5-3)"},
      {value: 3, name: "High", description: "High likelihood of disease (2-day average DSVs 3.5-5.5 or 7-day average 3-5)"},
      {value: 4, name: "Very High", description: "Very high likelihood of disease (2-day average DSVs 5.5-7 or 7-day average 5-7)"}
    ]
  end

  def biofix_date
    Date.today - 14.days
  end
end
