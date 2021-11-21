module ApplicationHelper
  def convert_temp(temp)
    if params[:in_fahrenheit]
      temp.to_f * 9.0 / 5.0 + 32.0
    else
      temp.to_f
    end
  end

  # degree-days by default in fahrenheit
  def convert_dds(dds)
    if params[:in_fahrenheit]
      dds.to_f
    else
      dds.to_f * 5.0 / 9.0
    end
  end

  def temp_symbol
    if params[:in_fahrenheit]
      "F"
    else
      "C"
    end
  end
end
