class CornRootworm < DegreeDayPest
  def total_to_severity(total)
    return 0 if total < 263 || total > 566
    return 1 if total > 543
    return 2 if total > 519
    return 3 if total > 495
    return 4 if total > 448
    return 3 if total > 408
    return 4 if total > 369
    return 3 if total > 345
    return 4 if total > 312
    return 3 if total > 296
    return 2 if total > 279
    return 1
  end

  def severity_legend
    [
      {name: "Very High", slug: "very_high",
       description: "Very high likelihood (very near peak 1st instar, peak 2nd instar, or peak 3rd instar)"},
    {name: "High", slug: "high",
     description: "High likelihood (near peak 1st instar, peak 2nd instar, or peak 3rd instar)"},
    {name: "Medium", slug: "medium",
     description: "Medium likelihood (before peak 1st instar or after 2nd instar)"},
    {name: "Low", slug: "low",
     description: "Low likelihood (well before peak 1st instar or after 2nd instar)"},
    {name: "Very Low", slug: "very_low",
     description: "Very low likelihood (not near peak 1st instar, peak 2nd instar, or peak 3rd instar)"}
    ]
  end
end
