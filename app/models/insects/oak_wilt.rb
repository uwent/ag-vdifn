# The oak wilt model tracks the combined abundance of two beetle vectors
# See Jagemann et al 2018

class OakWilt < Insect
  def severities_from_totals(totals, end_date)
    totals.map do |point|
      {
        lat: point[:lat],
        long: point[:long],
        value: total_to_severity(
          point[:value],
          date: end_date,
          freezing: point[:freeze] || 0
        )
      }
    end
  end

  def total_to_severity(total, date:, freezing: nil)
    # severity based on degree-day
    sev = oak_wilt_risk(total)

    # severity reduction based on time after July 15
    if date.yday >= 196
      sev -= 1
      sev = [2, sev].min
    end
    sev -= 1 if date.yday >= 203 # 1 week after Jul 15
    sev -= 1 if date.yday >= 210 # 2 weeks after Jul 15

    # severity reduction from hard freeze
    sev -= freezing if freezing

    # clip at zero
    [0, sev].max
  end

  def oak_wilt_risk(dds)
    return 0 if dds < 178 # before flight, estimate based on chart analysis
    return 1 if dds < 231 # <5% flight
    return 2 if dds < 368 # 5-25% flight
    return 3 if dds < 638 # 25-50% flight
    return 4 if dds < 913 # 50-75% flight
    return 3 if dds < 2172 # 75-95% flight
    2 # > 95% flight
  end

  def severity_legend
    [
      {name: "No vectors present", slug: "very_low", description: "Very low risk of oak wilt (no vectors in flight or date after July 15)"},
      {name: "<5% vector flight", slug: "low", description: "Lower risk of oak wilt transmission (<5% or >95% beetle flight)"},
      {name: "5-10% vector flight", slug: "medium", description: "Moderate risk of oak wilt transmission (5-10% or 90-95% beetle flight)"},
      {name: "10-25% vector flight", slug: "high", description: "High risk of oak wilt transmission (10-25% or 75-90% beetle flight)"},
      {name: "Peak vector flight", slug: "very_high", description: "Very high risk of oak wilt transmission (25-75% beetle vector flight)"}
    ]
  end
end
