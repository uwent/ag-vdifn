# coding: utf-8
class DbController < ApplicationController
  def severities
    render json: strategy.severities_from_totals(strategy.severities)
  end

  def stations
    @stations = ag_weather_client.stations
    render json: @stations
  end

  def point_details
    @pest = Pest.find(params[:pest_id])
    @latitude = params[:latitude].to_f.round(1)
    @longitude = params[:longitude].to_f.round(1)

    options = { pest: @pest.remote_name, latitude: @latitude, longitude: @longitude }
    @weather = ag_weather_client.point_details(options)
    render layout: false
  end

  def station_details
    @name = params[:name]

    options = { name: @name, start_date: start_date, end_date: end_date }
    @weather = ag_weather_client.station_observations(options)
    render layout: false
  end

  def severity_legend
    pest = Pest.find(params[:pest_id])
    # TODO ask why base pest model does not have severity legend??
    @severities = pest.severity_legend
    render json: @severities
  end

  def pest_info
    pest = Pest.find(params[:pest_id])
    in_f = params[:in_fahrenheit] == 'true'
    info = pest.info
    info.prepend(ActionController::Base.helpers.image_tag(pest.photo, width: '100px')) unless pest.photo.blank?
    info += " <a href=http://#{pest.link} target='_blank'>More information…</a>" unless pest.link.blank?

    render json: {
             info: info,
             name: pest.name,
             pest_link: pest.link,
             biofix: pest.biofix_date,
             end_date_enabled: pest.end_date_enabled,
             tmin: in_f ? pest.t_min : convert_temp(pest.t_min),
             tmax: pest.t_max.nil? ? '' : (in_f ? pest.t_max : convert_temp(pest.t_max))
           }
  end

  def disease_panel
    @pests = Pest.all.select { |p| p.is_a? DsvPest }
    @crops = crops_for_pests(@pests)
    render json: @crops, include: { diseases: { methods: :end_date_enabled } }
  end

  def insect_panel
    @pests = Pest.all.select { |p| p.is_a? DegreeDayPest }
    @crops = crops_for_pests(@pests)
    render json: @crops, include: { insects: { methods: [ :end_date_enabled, :biofix_date] } }
  end

  private

  def crops_for_pests(pests)
    crops = pests.map { |p| p.crops }.flatten.uniq.sort
    any_crop = Crop.new(id:0, name: 'Any')
    any_crop.pests = pests.sort { |x, y| x.name <=> y.name }
    crops.unshift(any_crop)
  end

  def start_date
    params[:start_date].blank? ? Date.current - 7.days : Date.parse(params[:start_date])
  end

  def end_date
    params[:end_date].blank? ? Date.current : Date.parse(params[:end_date])
  end

  def convert_temp(temp)
    return 0 if temp.nil?
    ((temp - 32) * 5.0/9.0).round(1)
  end

  def ag_weather_client
    AgWeather::Client.new
  end

  def strategy
    @strategy ||= send(pick_strategy(get_pest()).to_sym)
  end

  def pick_strategy(pest)
    case pest.class.name
    when "Pest"
      "build_pest_strategy"
    when "DsvPests::LateBlight"
      "build_late_blight_strategy"
    else
      "build_pest_strategy"
    end
  end

  def get_pest
    @pest ||= Pest.find(params[:pest_id])
  end

  def build_pest_strategy
    PestSeverityStrategy.new(get_pest, ag_weather_client, start_date, end_date)
  end

  def build_late_blight_strategy
    LateBlightStrategy.new(get_pest, ag_weather_client, start_date, end_date)
  end

  class PestSeverityStrategy
    def initialize(pest, client, start_date, end_date)
      @pest = pest
      @client = client
      @start_date = start_date
      @end_date = end_date
    end

    def severities
      begin
        client.pest_forecasts(pest: pest.remote_name, start_date: start_date, end_date: end_date)
      rescue Exception => e
        Rails.logger.error(e.backtrace.join("\n"))
        []
      end
    end

    def severities_from_totals(totals)
      pest.severities_from_totals(totals)
    end

    private

    attr_reader :pest, :client, :start_date, :end_date
  end

  class LateBlightStrategy
    def initialize(pest, client, start_date, end_date)
      @pest = pest
      @client = client
      @start_date = start_date
      @end_date = end_date
    end

    def severities
      past_week = []
      season_to_date = []
      begin
        past_week = client.pest_forecasts(pest: pest.remote_name, start_date: end_date - 7.days, end_date: end_date)
        season_to_date = client.pest_forecasts(pest: pest.remote_name, start_date: end_date.beginning_of_year, end_date: end_date)
      rescue Exception
      end
      { past_week: past_week, season_to_date: season_to_date }
    end

    def severities_from_totals(totals)
      pest.severities_from_totals(totals[:past_week], totals[:season_to_date])
    end

    private

    attr_reader :pest, :client, :start_date, :end_date
  end
end
