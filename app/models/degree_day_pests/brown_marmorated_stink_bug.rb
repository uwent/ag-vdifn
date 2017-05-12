class BrownMarmoratedStinkBug < DegreeDayPest

  def total_to_severity(total)
    return 0 if total < 1286 || total > 2656
    return 1 if total > 2545
    return 2 if total > 2434
    return 3 if total > 2223
    return 4 if total > 2102
    return 3 if total > 1991
    return 2 if total > 1769
    return 3 if total > 1688
    return 4 if total > 1567
    return 3 if total > 1447
    return 2 if total > 1367
    return 1
  end

  def severity_legend
    [
      {name: "Very High", slug: "very_high",
       description: "Very high likelihood (very near initial 1st gen. adults or peak 2nd gen. adults)"},
      {name: "High", slug: "high",
       description: "High likelihood (near initial 1st gen. adults or near peak 2nd gen. adults)"},
      {name: "Medium", slug: "medium",
       description: "Medium likelihood (before initial 1st gen. adults, between inital 1st gen. adults and peak 2nd gen. adults or after peak 2nd gen. adults)"},
      {name: "Low", slug: "low",
       description: "Low likelihood (well before initial 1st gen. adults or well after peak 2nd gen. adults)"},
      {name: "Very Low", slug: "very_low",
       description: "Very low likelihood (not near initial 1st gen. adults nor peak 2nd gen. adults)"}
    ]
  end
end
