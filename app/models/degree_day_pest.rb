class DegreeDayPest < Pest

  def biofix_date
    Date.current.beginning_of_year
  end

  def total_to_severity(total)
    return 5 if (total >= critical_value * 0.95 && total <= critical_value * 1.05)
    return 4 if (total >= critical_value * 0.90 && total <= critical_value * 1.1)
    return 3 if (total >= critical_value * 0.85 && total <= critical_value * 1.15)
    return 2 if (total >= critical_value * 0.80 && total <= critical_value * 1.2)
    return 1
  end

end
