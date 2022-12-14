class DegreeDay < Pest
  def f_to_c(temp)
    return 0 if temp.nil?
    ((temp.to_f - 32.0) * 5.0 / 9.0).round(1)
  end

  def name
    n = "Base #{t_min}°F"
    n += ", Upper #{t_max}°F" unless t_max.nil?
    n
  end

  def name_c
    n = "Base #{f_to_c(t_min)}°C"
    n += ", Upper #{f_to_c(t_max)}°C" unless t_max.nil?
    n
  end
end
