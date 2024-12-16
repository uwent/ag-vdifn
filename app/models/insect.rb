class Insect < Pest
  def severities_from_totals(totals, end_date)
    totals.map do |point|
      {
        lat: point[:lat],
        long: point[:long],
        value: total_to_severity(point[:value], freezing: point[:freeze])
      }
    end
  end

  def total_to_severity(total, date: nil, freezing: nil)
    sev = 0
    risk_array.each do |gen|
      sev = sev_ramp(gen[0], gen[1], gen[2], total) if total.between?(gen[0], gen[2])
    end
    sev -= freezing if freezing
    [0, sev].max
  rescue
    nil
  end

  def severity_legend
    [
      {name: "Very Low", slug: "very_low", description: "Very low pest abundance or likelihood of damage"},
      {name: "Low", slug: "low", description: "Low pest abundance or likelihood of damage"},
      {name: "Medium", slug: "medium", description: "Medium pest abundance or likelihood of damage"},
      {name: "High", slug: "high", description: "High pest abundance or likelihood of damage"},
      {name: "Very High", slug: "very_high", description: "Very high pest abundance or likelihood of damage"}
    ].freeze
  end

  def sine_wave(value, start, peak)
    # Normalize the input to range [0, 1]
    x = (value - start) / (peak - start).to_f
    # Use sine function to map [0, 1] to [0, 1], then scale to [0, 4]
    y = (Math.sin(x * Math::PI - Math::PI / 2) + 1) / 2 * 4
    y.ceil
  end

  # assign a severity value to total gdd based on start/peak/end of risk range
  def sev_ramp(start, peak, stop, total)
    return sine_wave(total, start, peak) if total.between?(start, peak)
    return sine_wave(-1 * total, -1 * stop, -1 * peak) if total.between?(peak, stop)
    0
  end

  # old method, uses equally-spaced intervals
  # def sev_ramp(start, peak, stop, total)
  #   a = ((peak - start) / 3.5).round(0)
  #   b = ((stop - peak) / 3.5).round(0)
  #   return 4 if total.between?(start + a * 3, stop - b * 3)
  #   return 3 if total.between?(start + a * 2, stop - b * 2)
  #   return 2 if total.between?(start + a, stop - b)
  #   return 1 if total.between?(start, stop)
  #   0
  # end

  def biofix_label
    "Biofix (Default: #{biofix_date.strftime("%b %-d")})"
  end
end
