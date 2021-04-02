class FoliarDisease < DsvPest
  def total_to_severity(total, after_november_first, freezing)
    return 4 if total >= 20
    return 3 if total >= 15
    return 2 if total >= 10
    return 1 if total >= 5
    return 0
  end

  def severity_legend
    [
      {name: "Very High", slug: "very_high", description: "Very high likelihood of disease (accumulated DSVs ≥ 20)"},
      {name: "High", slug: "high", description: "High likelihood of disease (15 ≤ accumulated DSVs < 20)"},
      {name: "Medium", slug: "medium", description: "Medium likelihood of disease (10 ≤ accumulated DSVs < 15)"},
      {name: "Low", slug: "low", description: "Low likelihood of disease (5 ≤ accumulated DSVs < 10)"},
      {name: "Very Low", slug: "very_low", description: "Very low likelihood of disease (accumulated DSVs < 5)"}
    ]
  end

  def biofix_date
    7.days.ago.to_date
  end
end
