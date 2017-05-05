# coding: utf-8
class DbController < ApplicationController

  HOST = ENV['AG_WEATHER_BASE_URL'] || 'http://localhost:3000'

  def severities
    pest = Pest.find(params[:pest_id])
    render json: pest.severities(start_date, end_date)
  end

  def info
    crop = params[:type]
    @latitude = params[:latitude].to_f.round(1)
    @longitude = params[:longitude].to_f.round(1)
    url = crop == 'carrot' ?
      "#{HOST}/carrot_forecasts/info?start_date=#{start_date}&end_date=#{end_date}&longitude=#{@longitude}&latitude=#{@latitude}" :
      "#{HOST}/potato_forecasts/info?start_date=#{start_date}&end_date=#{end_date}&longitude=#{@longitude}&latitude=#{@latitude}"

    response = HTTParty.get(url, { timeout: 10 })
    @weather = JSON.parse(response.body)
    render layout: false
  end

  def severity_legend
    crop = params[:type]

    @severities = (crop == 'carrot') ? [
      {name: "Very High", slug: "very_high",
       description: "Very high likelihood of disease (accumulated DSVs ≥ 20)"},
      {name: "High", slug: "high",
       description: "High likelihood of disease (15 ≤ accumulated DSVs < 20)"},
      {name: "Medium", slug: "medium", description: "Medium likelihood of disease (10 ≤ accumulated DSVs < 15)"},
      {name: "Low", slug: "low", description: "Low likelihood of disease
(5 ≤ accumulated DSVs < 10)"},
      {name: "Very Low", slug: "very_low", description: "Very low likelihood of disease (accumulated DSVs < 5)"}]
    : [
      {name: "High", slug: "very_high", description: "High likelihood of disease
(widespread outbreak observed OR 7-day accumulated DSVs ≥ 21 or isolated outbreak observed)"},
      {name: "Medium", slug: "medium", description: "Medium likelihood of disease
(7-day accumulated DSVs ≥ 3 or season accumulated DSVs > 30)"},
      {name: "Low", slug: "very_low", description: "Low likelihood of disease
(7-day accumulated DSVs ≤ 3 and season accumulated DSVs < 30)"}]
    render layout: false
  end

  private
  def start_date
    params[:start_date].blank? ? Date.current - 7.days : Date.parse(params[:start_date])
  end
  def end_date
    params[:end_date].blank? ? Date.current : Date.parse(params[:end_date])
  end
end
