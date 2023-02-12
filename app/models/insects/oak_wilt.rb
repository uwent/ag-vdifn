# The oak wilt model tracks the combined abundance of two beetle vectors
# See Jagemann et al 2018

class OakWilt < Insect
  def severities_from_totals(totals, end_date)
    totals.map do |point|
      {
        lat: point[:lat],
        long: point[:long],
        severity: total_to_severity(
          point[:total].to_f,
          point[:freeze],
          end_date
        )
      }
    end
  end

  def total_to_severity(total, freeze_days, end_date)
    # severity based on degree-day
    sev = 0
    sev = 1 if total.between?(50, 3221) # 0-100% C. truncatus, 0-90% C. sayi
    sev = 2 if total.between?(150, 2631) # 0-100% C. truncatus, 0-75% C. sayi
    sev = 3 if total.between?(231, 2172) # 5-95% C. truncatus
    sev = 4 if total.between?(388, 913) # 25-90% C. truncatus

    # severity reduction based on time after July 15
    if end_date.yday >= 196
      sev -= 1
      sev = [2, sev].min
    end
    sev -= 1 if end_date.yday >= 203
    sev -= 1 if end_date.yday >= 210

    # severity reduction from hard freeze
    sev -= freeze_days if freeze_days

    # clip at zero
    [0, sev].max
  end

  def severity_legend
    [
      {name: "Peak vector flight", slug: "very_high", description: "Very high risk of oak wilt transmission (25-75% beetle vector flight)"},
      {name: "10-25% vector flight", slug: "high", description: "High risk of oak wilt transmission (10-25% or 75-90% beetle flight)"},
      {name: "5-10% vector flight", slug: "medium", description: "Moderate risk of oak wilt transmission (5-10% or 90-95% beetle flight)"},
      {name: "<5% vector flight", slug: "low", description: "Lower risk of oak wilt transmission (<5% or >95% beetle flight)"},
      {name: "No vectors present", slug: "very_low", description: "Very low risk of oak wilt (no vectors in flight or date after July 15)"}
    ]
  end
end
