class DbController < ApplicationController

  HOST = ENV['AG_WEATHER_HOST'] || 'http://localhost:3000'

  def severities
    start_date = params[:start_date]
    end_date = params[:end_date]
    crop = params[:type]

    url = (crop == 'carrot') ?
      "#{HOST}/carrot_forecasts?start_date=#{start_date}&end_date=#{end_date}" :
      "#{HOST}/potato_forecasts?end_date=#{end_date}"
    response = HTTParty.get(url, { timeout: 10 })

    render json: response
  end

  def info
    start_date = params[:start_date]
    end_date = params[:end_date]
    crop = params[:type]
    @latitude = params[:latitude].to_f.round(1)
    @longitude = params[:longitude].to_f.round(1)
    url = crop == 'carrot' ?
      "http://localhost:4000/carrot_forecasts/info?start_date=#{start_date}&end_date=#{end_date}&longitude=#{@longitude}&latitude=#{@latitude}" :
      "http://localhost:4000/potato_forecasts/info?start_date=#{start_date}&end_date=#{end_date}&longitude=#{@longitude}&latitude=#{@latitude}"

    response = HTTParty.get(url, { timeout: 10 })
    @weather = JSON.parse(response.body)
    render layout: false
  end
end
