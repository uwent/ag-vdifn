class SeveritiesController < ApplicationController
  def index
    @pest = get_pest
    @start_date = start_date
    @end_date = end_date
    @lat_range = lat_range
    @long_range = long_range
    @base = t_min
    @upper = t_max
    @opts = {
      start_date: @start_date,
      end_date: @end_date,
      lat_range: @lat_range,
      long_range: @long_range
    }.compact

    puts @opts

    pest_type = @pest.class.name
    grid = []

    case pest_type
    when "Insect", "OakWilt"
      grid = get_insect_data
    when "CarrotFoliar"
      grid = get_carrot_foliar_data
    when "CercosporaLeafSpot"
      grid = get_cercospora_data
    when "BotrytisLeafBlight"
      grid = get_botrytis_data
    when "EarlyBlight"
      grid = get_early_blight_data
    when "LateBlight"
      grid = get_late_blight_data
    when "Custom"
      grid = get_custom_data
    end

    render json: grid
  end

  private

  def hash_to_array(grid)
    grid.collect do |key, value|
      lat, long = key
      if value.is_a? Hash
        {lat:, long:}.merge(value)
      else
        {lat:, long:, value:}
      end
    end
  end

  def get_dd_grid(**args)
    opts = @opts.merge(args)
    data = AgWeather.dd_grid(opts)
    hash_to_array(data)
  end

  # option to leave as hash or convert to array
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
    freeze_data = AgWeather.freeze_grid(@opts.merge({start_date:}))
  end

  # appends freeze data to totals grid
  def add_freeze_data?(data)
    if @end_date.month >= 11
      freeze_data = get_freeze_data(@end_date)
      data.collect do |point|
        key = [point[:lat], point[:long]]
        point[:freeze] = freeze_data[key] || 0
        point
      end
    else
      data
    end
  end

  def get_insect_data
    grid = get_dd_grid(model: @pest.remote_name)
    grid = add_freeze_data?(grid)
    @pest.severities_from_totals(totals, @end_date)
  end

  def get_custom_data
    get_dd_grid(base: @base, upper: @upper)
  end

  def get_botrytis_data
    grid = get_pest_grid
    grid = hash_to_array(grid)
    grid = add_freeze_data?(grid)
    @pest.severities_from_totals(grid)
  end

  def get_carrot_foliar_data
    seven_day = get_pest_grid(start_date: @end_date - 7.days)
    seven_day = hash_to_array(seven_day)
    @pest.severities_from_totals(seven_day)
  end

  def get_cercospora_data
    two_day = get_pest_grid(start_date: @end_date - 2.days, as_hash: true)
    seven_day = get_pest_grid(start_date: @end_date - 7.days)
    grid = seven_day.map do |point|
      lat, long = point[:lat], point[:long]
      {
        lat:,
        long:,
        avg7: point[:avg] || 0,
        avg2: two_day[[lat, long]]&.dig(:avg) || 0
      }
    end
    @pest.severities_from_totals(grid)
  end

  def get_early_blight_data
    seven_day = get_pest_grid(start_date: @end_date - 7.days, as_hash: true)
    selected_dates = get_pest_grid()
    grid = selected_dates.collect do |point|
      lat, long = point[:lat], point[:long]
      total = point[:total]
      avg7 = seven_day[[lat, long]]&.dig(:avg) || 0
      {lat:, long:, total:, avg7:}
    end
    @pest.severities_from_totals(grid)
  end

  def get_late_blight_data
    total = get_totals(@pest.remote_name, @start_date, @end_date)
    total_hash = {}
    total.map do |point|
      total_hash[[point[:lat], point[:long]]] = point[:total]
    end

    season_total = get_totals(@pest.remote_name, @end_date.beginning_of_year, @end_date)
    grid = season_total.map do |point|
      {
        lat: point[:lat],
        long: point[:long],
        total: total_hash[[point[:lat], point[:long]]] || 0,
        season_total: point[:total]
      }
    end

    # get freezing data in the fall/winter
    unless (3..10) === @end_date.month
      freeze_data = get_freeze_data(@end_date)
      grid = add_freeze_data(grid, freeze_data)
    end

    @pest.severities_from_totals(grid)
  end
end
