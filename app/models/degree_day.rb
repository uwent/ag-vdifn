class DegreeDay < Pest
  def f_to_c(temp)
    return if temp.nil?
    val = ((temp.to_f - 32) * 5 / 9).round(1)
    fmt(val)
  end

  def fmt(num)
    (num == num.to_i) ? num.to_i : num
  end
  
  def name
    n = "Base #{fmt(t_min)}°F"
    n += ", Upper #{fmt(t_max)}°F" unless t_max.nil?
    n
  end

  def name_c
    n = "Base #{f_to_c(t_min)}°C"
    n += ", Upper #{f_to_c(t_max)}°C" unless t_max.nil?
    n
  end
end
