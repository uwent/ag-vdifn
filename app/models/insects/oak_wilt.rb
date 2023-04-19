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
      sev -= 2
      sev = [1, sev].min
    end
    sev -= 1 if date.yday >= 203 # 1 week after Jul 15
    # sev -= 1 if date.yday >= 210 # 2 weeks after Jul 15

    # severity reduction from hard freeze
    sev -= freezing if freezing

    # clip at zero
    [0, sev].max
  end

  # CT = C. truncatus (primary, early vector)
  # CS = C. sayi (secondary, later vector)
  def oak_wilt_risk(dds)
    return 0 if dds < 180 # before flight
    return 1 if dds < 231 # <5% CT flight
    return 2 if dds < 283 # 5-10% CT flight
    return 3 if dds < 388 # 10-25% CT flight, 0-5% CS flight
    return 4 if dds < 913 # 25-75% CT flight, 5-10% CS flight
    return 3 if dds < 1792 # 75-90% CT flight, 10-25% CS flight
    return 2 if dds < 2172 # 90-95% CT flight, 25-50% CS flight
    1 # late flights
  end

  def severity_legend
    [
      {name: "Very low", slug: "very_low", description: "Very low risk of oak wilt (no vectors in flight or date more than 2 weeks after July 15)"},
      {name: "Low", slug: "low", description: "Low risk of oak wilt transmission (<5% or >95% vector flight, or date after July 15)"},
      {name: "Moderate", slug: "medium", description: "Moderate risk of oak wilt transmission - early or late vector flight (5-10% or 90-95%)"},
      {name: "High", slug: "high", description: "High risk of oak wilt transmission - early peak or late peak vector flight (10-25% or 75-90%)"},
      {name: "Very high", slug: "very_high", description: "Very high risk of oak wilt transmission - peak vector flight (25-75%)"}
    ]
  end
end
