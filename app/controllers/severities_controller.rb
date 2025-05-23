class SeveritiesController < ApplicationController
  def index
    @pest = get_pest
    @start_date = start_date
    @end_date = end_date
    @lat_range = lat_range
    @lng_range = lng_range
    @base = t_min
    @upper = t_max
    @units = units
    @opts = {
      start_date: @start_date,
      end_date: @end_date,
      lat_range: @lat_range,
      lng_range: @lng_range,
      units: @units
    }.compact

    grid = get_data_for(@pest.class.name)
    render json: grid
  end

  private

  def season_start
    ["#{@start_date.year}-4-1".to_date, @start_date].min
  rescue
    @start_date
  end

  def get_data_for(pest)
    case pest
    when "Insect", "OakWilt"
      get_insect_data
    when "CarrotFoliar"
      get_carrot_foliar_data
    when "CercosporaLeafSpot"
      get_cercospora_data
    when "BotrytisLeafBlight"
      get_botrytis_data
    when "EarlyBlight"
      get_early_blight_data
    when "LateBlight"
      get_late_blight_data
    when "Custom"
      get_custom_data
    else
      []
    end
  end

  def hash_to_array(grid)
    grid.collect do |key, value|
      lat, lng = key
      if value.is_a? Hash
        {lat:, lng:}.merge(value)
      else
        {lat:, lng:, value:}
      end
    end
  end

  # data received as hash: [lat, lng] => value
  def get_dd_grid(**args)
    opts = @opts.merge(args)
    data = AgWeather.dd_grid(opts)
    hash_to_array(data)
  end

  # data received as hash: [lat, lng] => value or hash
  def get_pest_grid(**args)
    opts = @opts.merge(args)
    opts[:pest] = @pest.remote_name
    opts.delete(:as_hash)
    data = AgWeather.pest_grid(opts)
    args[:as_hash] ? data : hash_to_array(data)
  end

  # fetch number of days below 28F in date range
  def get_freeze_data(end_date)
    nov_1 = Date.new(end_date.year, 11, 1)
    start_date = (end_date > nov_1) ? nov_1 : end_date - 1.week
    AgWeather.freeze_grid(@opts.merge({start_date:}))
  end

  # appends freeze data to totals grid
  def add_freeze_data?(data)
    if @end_date.month >= 11
      freeze_data = get_freeze_data(@end_date)
      data.collect do |point|
        key = [point[:lat], point[:lng]]
        point[:freeze] = freeze_data[key] || 0
        point
      end
    else
      data
    end
  end

  def get_insect_data
    grid = get_dd_grid(model: @pest.remote_name)
    # convert celsius dds to fahrenheit for pest models
    if !in_f
      grid = grid.collect do |pt|
        pt[:value] = pt[:value] * 1.8
        pt
      end
    end
    grid = add_freeze_data?(grid)
    @pest.severities_from_totals(grid, @end_date)
  end

  def get_custom_data
    get_dd_grid(base: @base, upper: @upper)
  end

  def get_botrytis_data
    grid = get_pest_grid
    grid = add_freeze_data?(grid)
    @pest.severities_from_totals(grid)
  end

  def get_carrot_foliar_data
    seven_day = get_pest_grid(start_date: @end_date - 7.days)
    @pest.severities_from_totals(seven_day)
  end

  def get_cercospora_data
    two_day = get_pest_grid(start_date: @end_date - 2.days, as_hash: true)
    seven_day = get_pest_grid(start_date: @end_date - 7.days)
    grid = seven_day.map do |point|
      lat, lng = point[:lat], point[:lng]
      avg2 = two_day[[lat, lng]]&.dig(:avg) || 0
      avg7 = point[:avg] || 0
      {lat:, lng:, avg2:, avg7:}
    end
    @pest.severities_from_totals(grid)
  end

  def get_early_blight_data
    selected_dates = get_pest_grid
    seven_day = get_pest_grid(start_date: @end_date - 7.days, as_hash: true)
    grid = selected_dates.collect do |point|
      lat, lng = point[:lat], point[:lng]
      total = point[:total]
      avg7 = seven_day[[lat, lng]]&.dig(:avg) || 0
      {lat:, lng:, total:, avg7:}
    end
    @pest.severities_from_totals(grid)
  end

  def get_late_blight_data
    season_totals = get_pest_grid(start_date: season_start, as_hash: true)
    selected_dates = get_pest_grid
    grid = selected_dates.collect do |point|
      lat, lng = point[:lat], point[:lng]
      selected_total = point[:total]
      season_total = season_totals[[lat, lng]]&.dig(:total)
      {lat:, lng:, selected_total:, season_total:}
    end
    grid = add_freeze_data?(grid)
    @pest.severities_from_totals(grid)
  end
end
