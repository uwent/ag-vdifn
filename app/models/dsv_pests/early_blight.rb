# coding: utf-8
class EarlyBlight < DsvPest
  def total_to_severity(total, after_november_first, freezing)
    return 0 if after_november_first && freezing
    return 4 if total >= 300
    return 3 if total >= 275
    return 2 if total >= 250
    return 1 if total >= 225
    return 0
  end

  def severity_legend
    [
      {name: "Very High", slug: "very_high", description: "Very high likelihood of disease (accumulated P-Days > 300)"},
      {name: "High", slug: "high", description: "High likelihood of disease (accumulated P-Days > 275)"},
      {name: "Medium", slug: "medium", description: "Medium likelihood of disease (accumulated P-Days > 250)"},
      {name: "Low", slug: "low", description: "Low likelihood of disease (accumulated P-Days > 225)"},
      {name: "Very Low", slug: "very_low", description: "Very low likelihood of disease (accumulated P-Days < 225)"}
    ]
  end

end
