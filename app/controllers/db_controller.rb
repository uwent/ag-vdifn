class DbController < ApplicationController
  def severities
    render json: strategy.severities_from_totals(strategy.severities)
  end

  # def stations
  #   @stations = ag_weather_client.stations
  #   render json: @stations
  # end

  def point_details
    @pest = get_pest
    @latitude = params[:latitude].to_f.round(1)
    @longitude = params[:longitude].to_f.round(1)
    @t_min = params[:t_min]
    @t_max = params[:t_max].nil? ? "None" : params[:t_max]
    @in_fahrenheit = params[:in_fahrenheit]

    case params[:panel]

    when "custom"
      @model_value = "Custom"
      params = {
        lat: @latitude,
        long: @longitude,
        t_base: t_min,
        t_upper: t_max,
        start_date: start_date,
        end_date: end_date
      }
      response = ag_weather_client.custom_point_details(params)
      @weather = response[:data]

    when "insect"
      @model_value = @pest.name
      params = {
        pest: @pest.remote_name,
        lat: @latitude,
        long: @longitude,
        start_date: start_date,
        end_date: end_date
      }
      response = ag_weather_client.point_details(params)
      @weather = response[:data]

    when "disease"
      params = {
        pest: @pest.remote_name,
        lat: @latitude,
        long: @longitude,
        start_date: start_date,
        end_date: end_date
      }
      response = ag_weather_client.point_details(params)
      @weather = response[:data]
    end
    render layout: false
  end

  # def station_details
  #   @name = params[:name]
  #   options = { name: @name, start_date: start_date, end_date: end_date }
  #   @weather = ag_weather_client.station_observations(options)
  #   render layout: false
  # end

  def severity_legend
    pest = Pest.find(params[:pest_id])
    @severities = pest.severity_legend
    render json: @severities
  end

  def severity_legend_info
    pest_info = Pest.find(params[:pest_id]).severity_info
    render json: pest_info
  end

  def pest_info
    pest = Pest.find(params[:pest_id])
    in_f = params[:in_fahrenheit] == "true"
    info = pest.info
    info.prepend(ActionController::Base.helpers.image_tag(pest.photo, width: "100px")) unless pest.photo.blank?
    info += " <a href=https://#{pest.link} target='_blank'>More information…</a>" unless pest.link.blank?

    render json: {
      info: info,
      name: pest.name,
      pest_link: pest.link,
      biofix: pest.biofix_date,
      end_date_enabled: pest.end_date_enabled,
      tmin: in_f ? pest.t_min : f_to_c(pest.t_min),
      tmax: pest.t_max.nil? ? "" : (in_f ? pest.t_max : f_to_c(pest.t_max))
    }
  end

  def disease_panel
    @crops = create_crops_for_disease_panel.unshift(create_any_option(Disease))
    render json: @crops, include: {diseases: {methods: [:end_date_enabled, :biofix_date]}}
  end

  def insect_panel
    @crops = create_crops_for_insect_panel.unshift(create_any_option(Insect))
    render json: @crops, include: {insects: {methods: [:end_date_enabled, :biofix_date]}}
  end

  private

  def create_crops_for_disease_panel
    Crop.includes(:pests).references(:pests).all.select { |crop| crop.diseases.count > 0 }
  end

  def create_crops_for_insect_panel
    Crop.includes(:pests).references(:pests).all.select { |crop| crop.insects }
  end

  def create_any_option(pest_type)
    any_crop = Crop.new(id: 0, name: "Any")
    any_crop.pests = Pest.all.select { |pest| pest.is_a? pest_type }.sort { |x, y| x.name.to_s <=> y.name.to_s }
    any_crop
  end

  def start_date
    params[:start_date].blank? ? Date.yesterday - 7.days : Date.parse(params[:start_date])
  end

  def end_date
    params[:end_date].blank? ? Date.yesterday : Date.parse(params[:end_date])
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

  def strategy
    @strategy ||= send(pick_strategy(get_pest).to_sym)
  end

  def pick_strategy(pest)
    Rails.logger.debug ">>> Picking strategy for #{pest}"
    case pest.class.name
    when "Custom"
      "build_custom_strategy"
    when "CercosporaLeafSpot"
      "build_cercospora_strategy"
    when "EarlyBlight"
      "build_early_blight_strategy"
    when "FoliarDisease"
      "build_foliar_disease_strategy"
    when "LateBlight"
      "build_late_blight_strategy"
    else
      "build_pest_strategy"
    end
  end

  def get_pest
    if params[:pest_id]
      @pest ||= Pest.find(params[:pest_id])
    else
      @pest = Pest.new(type: "Custom")
    end
  end

  def build_pest_strategy
    PestStrategy.new(get_pest, ag_weather_client, start_date, end_date)
  end

  class PestStrategy
    def initialize(pest, client, start_date, end_date)
      @pest = pest
      @client = client
      @start_date = start_date
      @end_date = end_date
    end

    def severities
      client.pest_forecasts(
        pest: pest.remote_name,
        start_date: start_date,
        end_date: end_date
      )[:data]
    rescue => e
      Rails.logger.error "DB Controller :: #{e}"
      []
    end

    def severities_from_totals(totals)
      pest.severities_from_totals(totals, end_date)
    end

    private

    attr_reader :pest, :client, :start_date, :end_date
  end

  def build_custom_strategy
    CustomStrategy.new(ag_weather_client, start_date, end_date, t_min, t_max)
  end

  class CustomStrategy
    def initialize(client, start_date, end_date, t_min, t_max)
      @client = client
      @start_date = start_date
      @end_date = end_date
      @t_min = t_min
      @t_max = t_max
    end

    def severities
      pests = Pest.where(t_max: t_max, t_min: t_min)
      begin
        if pests.any?
          client.custom(
            start_date: start_date,
            end_date: end_date,
            pest: pests.first.remote_name
          )
        else
          client.custom(
            start_date: start_date,
            end_date: end_date,
            t_base: t_min,
            t_upper: t_max
          )
        end
      rescue => e
        Rails.logger.error "CustomStrategy :: Error: #{e.message}"
        []
      end
    end

    def severities_from_totals(totals)
      totals
    end

    private

    attr_reader :client, :start_date, :end_date, :t_min, :t_max
  end

  def build_cercospora_strategy
    CercosporaStrategy.new(get_pest, ag_weather_client, start_date, end_date)
  end

  class CercosporaStrategy
    def initialize(pest, client, start_date, end_date)
      Rails.logger.debug ">>> Launching Cercospora Leaf Spot Strategy"
      @pest = pest
      @client = client
      @start_date = start_date
      @end_date = end_date
    end

    def severities
      last_7_days = []
      last_2_days = []
      begin
        last_7_days = client.pest_forecasts(
          pest: pest.remote_name,
          start_date: end_date - 7.days,
          end_date: end_date
        )[:data]
        last_2_days = client.pest_forecasts(
          pest: pest.remote_name,
          start_date: end_date - 2.days,
          end_date: end_date
        )[:data]
      rescue => e
        Rails.logger.error "DiseaseStrategy :: Error: #{e.message}"
      end
      {
        last_7_days: last_7_days,
        last_2_days: last_2_days
      }
    end

    def severities_from_totals(totals)
      pest.severities_from_totals(
        totals[:last_7_days],
        totals[:last_2_days]
      )
    end

    private

    attr_reader :pest, :client, :start_date, :end_date
  end

  def build_early_blight_strategy
    EarlyBlightStrategy.new(get_pest, ag_weather_client, start_date, end_date)
  end

  class EarlyBlightStrategy
    def initialize(pest, client, start_date, end_date)
      Rails.logger.debug ">>> Launching Early Blight Strategy"
      @pest = pest
      @client = client
      @start_date = start_date
      @end_date = end_date
    end

    def severities
      selected_dates = []
      last_7_days = []
      begin
        selected_dates = client.pest_forecasts(
          pest: pest.remote_name,
          start_date: start_date,
          end_date: end_date
        )[:data]
        last_7_days = client.pest_forecasts(
          pest: pest.remote_name,
          start_date: end_date - 7.days,
          end_date: end_date
        )[:data]
      rescue => e
        Rails.logger.error "DiseaseStrategy :: Error: #{e.message}"
      end
      {
        selected_dates: selected_dates,
        last_7_days: last_7_days
      }
    end

    def severities_from_totals(totals)
      pest.severities_from_totals(
        totals[:selected_dates],
        totals[:last_7_days]
      )
    end

    private

    attr_reader :pest, :client, :start_date, :end_date
  end

  def build_foliar_disease_strategy
    FoliarDiseaseStrategy.new(get_pest, ag_weather_client, start_date, end_date)
  end

  class FoliarDiseaseStrategy
    def initialize(pest, client, start_date, end_date)
      Rails.logger.debug ">>> Launching Foliar Disease Strategy"
      @pest = pest
      @client = client
      @start_date = start_date
      @end_date = end_date
    end

    def severities
      selected_dates = []
      last_7_days = []
      last_2_days = []
      begin
        last_7_days = client.pest_forecasts(
          pest: pest.remote_name,
          start_date: end_date - 7.days,
          end_date: end_date
        )[:data]
      rescue => e
        Rails.logger.error "DiseaseStrategy :: Error: #{e.message}"
      end
      {
        last_7_days: last_7_days
      }
    end

    def severities_from_totals(totals)
      pest.severities_from_totals(
        totals[:last_7_days]
      )
    end

    private

    attr_reader :pest, :client, :start_date, :end_date
  end

  def build_late_blight_strategy
    LateBlightStrategy.new(get_pest, ag_weather_client, start_date, end_date)
  end

  class LateBlightStrategy
    def initialize(pest, client, start_date, end_date)
      Rails.logger.debug ">>> Launching Late Blight Strategy"
      @pest = pest
      @client = client
      @start_date = start_date
      @end_date = end_date
    end

    def severities
      past_week = []
      season_to_date = []
      begin
        season_to_date = client.pest_forecasts(
          pest: pest.remote_name,
          start_date: end_date.beginning_of_year,
          end_date: end_date
        )[:data]
        past_week = client.pest_forecasts(
          pest: pest.remote_name,
          start_date: [start_date, end_date - 7.days].max,
          end_date: end_date
        )[:data]
      rescue => e
        Rails.logger.error "LateBlightStrategy :: Error: #{e.message}"
      end
      {
        season_to_date: season_to_date,
        past_week: past_week
      }
    end

    def severities_from_totals(totals)
      pest.severities_from_totals(
        totals[:past_week],
        totals[:season_to_date]
      )
    end

    private

    attr_reader :pest, :client, :start_date, :end_date
  end
end
