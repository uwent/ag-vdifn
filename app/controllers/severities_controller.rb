class SeveritiesController < ApplicationController
  def index
    @pest = get_pest
    @start_date = start_date
    @end_date = end_date
    @lat_range = lat_range
    @long_range = long_range

    pest_name = @pest.class.name
    grid = []

    case pest_name
    when "Custom"
      grid = get_custom_data
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
    end

    render json: grid
  end

  private

  def get_totals(pest, start_date, end_date)
    json = ag_weather_client.pest_forecasts(
      pest:,
      start_date:,
      end_date:,
      lat_range: @lat_range,
      long_range: @long_range
    )
    json[:data]
  end

  # fetch number of days below 28F in date range
  def get_freeze_data(end_date)
    nov_1 = Date.new(end_date.year, 11, 1)
    start_date = end_date > nov_1 ? nov_1 : end_date - 1.week
    json = ag_weather_client.freeze_days(
      start_date: start_date,
      end_date: end_date,
      lat_range: @lat_range,
      long_range: @long_range
    )
    hash = {}
    json[:data].each do |point|
      hash[[point[:lat], point[:long]]] = point[:freeze]
    end
    hash
  end

  # appends freeze data to totals grid
  def add_freeze_data(data, freeze_data)
    data.each do |point|
      freeze = freeze_data[[point[:lat], point[:long]]]
      point[:freeze] = freeze || 0
    end
  end

  def get_insect_data
    freeze_data, totals = [
      Thread.new { get_freeze_data(@end_date) },
      Thread.new { get_totals(@pest.remote_name, @start_date, @end_date) }
    ].map(&:value)
    totals = add_freeze_data(totals, freeze_data)
    @pest.severities_from_totals(totals, @end_date)
  end

  def get_botrytis_data
    totals = get_totals(@pest.remote_name, @start_date, @end_date)
    if @end_date.month > 7
      freeze_data = get_freeze_data(@end_date)
      totals = add_freeze_data(totals, freeze_data)
    end
    @pest.severities_from_totals(totals)
  end

  def get_carrot_foliar_data
    seven_day = get_totals(@pest.remote_name, @end_date - 7.days, @end_date)
    @pest.severities_from_totals(seven_day)
  end

  def get_cercospora_data
    two_day, seven_day = [
      Thread.new { get_totals(@pest.remote_name, @end_date - 2.days, @end_date) },
      Thread.new { get_totals(@pest.remote_name, @end_date - 7.days, @end_date) }
    ].map(&:value)

    two_day_hash = {}
    two_day.map do |point|
      two_day_hash[[point[:lat], point[:long]]] = point[:avg]
    end

    grid = seven_day.map do |point|
      {
        lat: point[:lat],
        long: point[:long],
        avg7: point[:avg],
        avg2: two_day_hash[[point[:lat], point[:long]]] || 0
      }
    end

    @pest.severities_from_totals(grid)
  end

  def get_early_blight_data
    seven_day, selected_dates = [
      Thread.new { get_totals(@pest.remote_name, @end_date - 7.days, @end_date) },
      Thread.new { get_totals(@pest.remote_name, @start_date, @end_date) }
    ].map(&:value)

    seven_day_hash = {}
    seven_day.map do |point|
      seven_day_hash[[point[:lat], point[:long]]] = point[:avg]
    end

    grid = selected_dates.map do |point|
      {
        lat: point[:lat],
        long: point[:long],
        total: point[:total],
        seven_day_avg: seven_day_hash[[point[:lat], point[:long]]] || 0
      }
    end

    @pest.severities_from_totals(grid)
  end

  def get_late_blight_data
    total, season_total = [
      Thread.new { get_totals(@pest.remote_name, @start_date, @end_date) },
      Thread.new { get_totals(@pest.remote_name, @end_date.beginning_of_year, @end_date) }
    ].map(&:value)

    total_hash = {}
    total.map do |point|
      total_hash[[point[:lat], point[:long]]] = point[:total]
    end

    grid = season_total.map do |point|
      {
        lat: point[:lat],
        long: point[:long],
        total: total_hash[[point[:lat], point[:long]]] || 0,
        season_total: point[:total]
      }
    end

    # get freezing data in the fall/winter
    unless (4..8) === @end_date.month
      freeze_data = get_freeze_data(@end_date)
      grid = add_freeze_data(grid, freeze_data)
    end

    @pest.severities_from_totals(grid)
  end

  def get_custom_data
    # puts "===> TMIN: #{t_min}, TMAX: #{t_max} <==="
    pests = Pest.where(t_min:, t_max:)
    # puts pests.pluck(:remote_name)
    opts = {
      start_date:,
      end_date:,
      lat_range: @lat_range,
      long_range: @long_range
    }
    opts = if pests.any?
      opts.merge({
        pest: pests.first.remote_name
      })
    else
      opts.merge({
        t_base: t_min,
        t_upper: t_max
      })
    end
    ag_weather_client.custom(opts)
  end
end
