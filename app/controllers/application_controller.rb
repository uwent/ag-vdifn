class ApplicationController < ActionController::Base
  def index
  end

  private

  def end_date
    Date.parse(params[:end_date])
  rescue
    Date.yesterday
  end

  def start_date
    Date.parse(params[:start_date])
  rescue
    end_date.beginning_of_year
  end

  def lat_range
    params[:lat_range]
  end

  def lng_range
    params[:lng_range]
  end

  def in_f
    str = params[:in_f].to_s
    return true if str == "true"
    return false if str == "false"
    true
  end

  def units
    in_f ? "F" : "C"
  end

  def t_min
    val = params[:t_min]
    val.to_f if val.present?
  end

  def t_max
    val = params[:t_max]
    val.to_f if val.present?
  end

  def c_to_f(temp)
    return 0 if temp.nil?
    ((temp.to_f * 9.0 / 5) + 32).round(1)
  end

  def f_to_c(temp)
    return 0 if temp.nil?
    ((temp.to_f - 32) * 5.0 / 9).round(1)
  end

  def get_pest
    if params[:pest_id]
      @pest ||= Pest.find(params[:pest_id])
    else
      @pest = Pest.new(type: "Custom")
    end
  end
end
