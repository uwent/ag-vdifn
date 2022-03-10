class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

  def index
  end

  private

  def start_date
    params[:start_date].blank? ? Date.yesterday - 7.days : Date.parse(params[:start_date])
  end

  def end_date
    params[:end_date].blank? ? Date.yesterday : Date.parse(params[:end_date])
  end

  def lat_range
    params[:lat_range]
  end

  def long_range
    params[:long_range]
  end

  def t_min
    if !params[:in_fahrenheit].nil? && params[:t_min].present? && !params[:in_fahrenheit]
      c_to_f(params[:t_min])
    else
      params[:t_min].nil? ? 0 : params[:t_min].to_f
    end
  end

  def t_max
    if !params[:in_fahrenheit].nil? && params[:t_max].present? && !params[:in_fahrenheit] && params[:t_max] != "None"
      c_to_f(params[:t_max])
    else
      params[:t_max].nil? || params[:t_max] === "None" ? nil : params[:t_max].to_f
    end
  end

  def c_to_f(temp)
    return 0 if temp.nil?
    ((temp.to_f * 9.0 / 5.0) + 32.0).round(1)
  end

  def f_to_c(temp)
    return 0 if temp.nil?
    ((temp.to_f - 32.0) * 5.0 / 9.0).round(1)
  end

  def ag_weather_client
    AgWeather::Client.new
  end

  def get_pest
    if params[:pest_id]
      @pest ||= Pest.find(params[:pest_id])
    else
      @pest = Pest.new(type: "Custom")
    end
  end
end
