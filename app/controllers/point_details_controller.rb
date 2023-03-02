class PointDetailsController < ApplicationController

  def index
    @panel = params[:panel]
    @lat = params[:latitude].to_f.round(1)
    @long = params[:longitude].to_f.round(1)
    @start_date = start_date
    @end_date = end_date
    @in_f = in_f
    @units = units
    @pest = get_pest
    @base = t_min
    @upper = t_max
    @opts = {
      lat: @lat,
      long: @long,
      start_date: @start_date,
      end_date: @end_date,
      units:
    }.compact
    
    @data = get_data_for(@panel)
    @selected_data = @data.select { |h| h[:date] >= @start_date }

    render layout: false
  end

  def get_data_for(panel)
    case panel
    when "disease"
      get_disease_data
    when "insect"
      get_insect_data
    when "custom"
      get_custom_data
    else
      []
    end
  end

  def get_disease_data
    opts = @opts.merge({pest: @pest.remote_name})
    if @pest.is_a?(EarlyBlight)
      @partial = "infobox_pdays"
      @units = "P-days"
    else
      @partial = "infobox_dsv"
      @units = "DSVs"
    end
    AgWeather.pest_point(opts)
  end

  def get_insect_data
    opts = @opts.merge({model: @pest.remote_name})
    @base = @pest.t_min
    @upper = @pest.t_max
    @partial = "infobox_dd"
    data = AgWeather.dd_point(opts)

    # get severity for each date
    @severity_col = true
    data.collect do |day|
      severity = @pest.total_to_severity(day[:cumulative_value], date: day[:date])
      if severity
        day[:severity] = @pest.severity_legend[severity]&.dig(:name)
        day[:severity_class] = "severity-#{@pest.severity_legend[severity][:slug]}"
      end
      day
    end
  end

  def get_custom_data
    opts = @opts.merge({base: @base, upper: @upper})
    @partial = "infobox_dd"
    AgWeather.dd_point(opts)
  end
end
