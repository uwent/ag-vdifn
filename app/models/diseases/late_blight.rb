# This model needs to use selected_dates

class LateBlight < Disease

  def severities_from_totals(past_week, season_to_date)

    if past_week.count != season_to_date.count
      logger.error(">> LateBlight :: Past week and season mismatch")
      return []
    end

    past_week.zip(season_to_date).map do | pair |
      logger.error(">> LateBlight :: Latitude mismatch") if pair[0][:lat] != pair[1][:lat]
      logger.error(">> LateBlight :: Longitude mismatch") if pair[0][:long] != pair[1][:long]
      last_week = pair[0][:total]
      season = pair[1][:total]
      {
        lat: pair[0][:lat],
        long: pair[0][:long],
        severity: total_to_severity(last_week, season),
      }
    end

  end

  def total_to_severity(last_week, season)
    return 4 if last_week >= 21 && season >= 30
    return 3 if last_week >= 14 && season >= 30
    return 2 if last_week >= 3 || season >= 30
    return 1 if last_week >= 1 && season < 30
    return 0
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
    14.days.ago.to_date
  end
end
