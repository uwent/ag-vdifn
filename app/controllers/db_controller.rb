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
    @start_date = start_date

    case params[:panel]

    when "custom"
      @model_value = "Custom"
      params = {
        lat: @latitude,
        long: @longitude,
        t_base: t_min,
        t_upper: t_max,
        start_date: @start_date,
        end_date: end_date
      }
      response = ag_weather_client.custom_point_details(params)
      @data = response[:data] || []

    when "insect"
      @model_value = @pest.name
      params = {
        pest: @pest.remote_name,
        lat: @latitude,
        long: @longitude,
        start_date: @start_date,
        end_date: end_date
      }
      response = ag_weather_client.point_details(params)
      @data = response[:data] || []

    when "disease"
      params = {
        pest: @pest.remote_name,
        lat: @latitude,
        long: @longitude,
        start_date: end_date.beginning_of_year,
        end_date: end_date
      }
      response = ag_weather_client.point_details(params)
      data = response[:data] || []
      @data = data.collect do |d|
        d[:date] = begin
          d[:date].to_date
        rescue
          d[:date]
        end
        d
      end
      @selected = @data.select { |h| h[:date] >= @start_date }
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
      biofix_label: pest.biofix_label,
      end_date_enabled: pest.end_date_enabled,
      tmin: in_f ? pest.t_min : f_to_c(pest.t_min),
      tmax: if pest.t_max.nil?
              ""
            else
              (in_f ? pest.t_max : f_to_c(pest.t_max))
            end
    }
  end

  def disease_panel
    @crops = create_crops_for_disease_panel.unshift(create_any_option(Disease))
    render json: @crops, include: {diseases: {methods: [:end_date_enabled, :biofix_date, :biofix_label]}}
  end

  def insect_panel
    @crops = create_crops_for_insect_panel.unshift(create_any_option(Insect))
    render json: @crops, include: {insects: {methods: [:end_date_enabled, :biofix_date, :biofix_label]}}
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
end
