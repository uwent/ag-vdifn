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

  private

  def season_start
    ["#{@start_date.year}-4-1".to_date, @start_date].min
  rescue
    @start_date
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
    if @pest.is_a? EarlyBlight
      @partial = "infobox_pdays"
      @dsv_units = "P-days"
    else
      @partial = "infobox_dsv"
      @dsv_units = "DSVs"
    end
    @season_data = AgWeather.pest_point(opts.merge({start_date: season_start}))
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
      dd = day[:cumulative_value] * (@in_f ? 1 : 1.8)
      severity = @pest.total_to_severity(dd, date: day[:date])
      if severity
        next unless (legend = @pest.severity_legend[severity])
        day[:severity] = legend[:name]
        day[:severity_class] = "severity-#{legend[:slug]}"
        day[:severity_info] = legend[:description]
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
