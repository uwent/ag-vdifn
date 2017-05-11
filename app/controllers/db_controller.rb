class DbController < ApplicationController

  HOST = ENV['AG_WEATHER_BASE_URL'] || 'http://localhost:3000'

  def severities
    pest = Pest.find(params[:pest_id])
    render json: pest.severities(start_date, end_date)
  end

  def point_details
    @pest = Pest.find(params[:pest_id])
    @latitude = params[:latitude].to_f.round(1)
    @longitude = params[:longitude].to_f.round(1)
    url = "#{HOST}/pest_forecasts/point_details?pest=#{@pest.remote_name}&start_date=#{start_date}&end_date=#{end_date}&longitude=#{@longitude}&latitude=#{@latitude}"

    puts "=====> #{url}"
    response = HTTParty.get(url, { timeout: 10 })
    @weather = JSON.parse(response.body)
    render layout: false
  end

  def severity_legend
    pest = Pest.find(params[:pest_id])
    @severities = pest.severity_legend
    render layout: false
  end

  def pest_info
    pest = Pest.find(params[:pest_id])

    render json: {
             info: pest.info,
             pest_link: pest.link,
             biofix: pest.biofix_date,
             end_date_disabled: false
           }
  end

  private
  def start_date
    params[:start_date].blank? ? Date.current - 7.days : Date.parse(params[:start_date])
  end
  def end_date
    params[:end_date].blank? ? Date.current : Date.parse(params[:end_date])
  end
end
