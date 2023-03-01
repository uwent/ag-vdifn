class DbController < ApplicationController
  def severities
    render json: strategy.severities_from_totals(strategy.severities)
  end

  # def stations
  #   @stations = ag_weather_client.stations
  #   render json: @stations
  # end

  def point_details
    @panel = params[:panel]
    @lat = params[:latitude].to_f.round(1)
    @long = params[:longitude].to_f.round(1)
    @start_date = start_date
    @end_date = end_date
    @in_f = params[:in_f] == "true"
    @pest = get_pest
    query = {
      lat: @lat,
      long: @long,
      start_date: @start_date,
      end_date: @end_date
    }
    response = {}

    case @panel
    when "disease"
      query[:pest] = @pest.remote_name
      response = AgWeather.pest_point(query.compact)
      if @pest.is_a?(EarlyBlight)
        @partial = "infobox_pdays"
        @units = "P-days"
      else
        @partial = "infobox_dsv"
        @units = "DSVs"
      end
    when "insect"
      query[:model] = @pest.remote_name
      @base = @pest.t_min
      @upper = @pest.t_max
      response = AgWeather.dd_point(query.compact)
      @partial = "infobox_dd"
    when "custom"
      query[:base] = @base = params[:t_min]
      query[:upper] = @upper = params[:t_max]
      response = AgWeather.dd_point(query.compact)
      @partial = "infobox_dd"
    else
      return
    end

    @data = response || []
    @data.each { |d| d[:date] = parse_date(d[:date]) }
    @selected_data = @data.select { |h| h[:date] >= @start_date }

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

    tmin = in_f ? pest.t_min : f_to_c(pest.t_min)
    tmax = if pest.t_max.nil?
      ""
    else
      in_f ? pest.t_max : f_to_c(pest.t_max)
    end

    render json: {
      info: info,
      name: pest.name,
      pest_link: pest.link,
      biofix: pest.biofix_date,
      biofix_label: pest.biofix_label,
      end_date_enabled: pest.end_date_enabled,
      tmin:,
      tmax:
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

  def dd_models
    @models = DegreeDay.all.order(:id).select(:id, :name, :remote_name, :t_min, :t_max)
    render json: @models, methods: :name_c
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

  def parse_date(date)
    Date.parse(date)
  rescue
    date
  end
end
