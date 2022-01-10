class SeveritiesController < ApplicationController
  def index
    @pest = get_pest
    @start_date = start_date
    @end_date = end_date

    pest_name = @pest.class.name
    grid = []

    case pest_name
    when "Custom"
      grid = get_custom_data
    when "Insect", "OakWilt"
      grid = get_insect_data
    when "CercosporaLeafSpot"
      grid = get_cercospora_data
    when "EarlyBlight"
      grid = get_early_blight_data
    when "CarrotFoliar"
      grid = get_carrot_foliar_data
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
      end_date:
    )
    json[:data]
  end

  def get_freeze_data(end_date)
    json = ag_weather_client.freeze_days(
      start_date: end_date - 7.days,
      end_date:
    )
    hash = {}
    json[:data].each do |point|
      hash[[point[:lat], point[:long]]] = point[:freeze]
    end
    hash
  end

  def add_freeze_data(data, freeze_data)
    data.each do |point|
      freeze = freeze_data[[point[:lat], point[:long]]]
      point[:freeze] = freeze || 0
    end
  end

  def get_insect_data
    freeze_data = get_freeze_data(@end_date)
    totals = get_totals(@pest.remote_name, @start_date, @end_date)
    totals = add_freeze_data(totals, freeze_data)
    @pest.severities_from_totals(totals, @end_date)
  end

  def get_custom_data
    pests = Pest.where(t_max:, t_min:)
    options = if pests.any?
      {
        start_date:,
        end_date:,
        pest: pests.first.remote_name
      }
    else
      {
        start_date:,
        end_date:,
        t_base: t_min,
        t_upper: t_max
      }
    end
    ag_weather_client.custom(options)
  end

  def get_cercospora_data
    two_day = get_totals(@pest.remote_name, @end_date - 2.days, @end_date)
    seven_day = get_totals(@pest.remote_name, @end_date - 7.days, @end_date)

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
    seven_day = get_totals(@pest.remote_name, @end_date - 7.days, @end_date)
    selected_dates = get_totals(@pest.remote_name, @start_date, @end_date)

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

  def get_carrot_foliar_data
    seven_day = get_totals(@pest.remote_name, @end_date - 7.days, @end_date)
    @pest.severities_from_totals(seven_day)
  end

  def get_late_blight_data
    season_total = get_totals(@pest.remote_name, @end_date.beginning_of_year, @end_date)
    seven_day = get_totals(@pest.remote_name, @end_date - 7.days, @end_date)
    freeze_data = get_freeze_data(@end_date)

    seven_day_hash = {}
    seven_day.map do |point|
      seven_day_hash[[point[:lat], point[:long]]] = point[:avg]
    end

    grid = season_total.map do |point|
      {
        lat: point[:lat],
        long: point[:long],
        total: point[:total],
        seven_day: seven_day_hash[[point[:lat], point[:long]]] || 0
      }
    end
    grid = add_freeze_data(grid, freeze_data)

    @pest.severities_from_totals(grid)
  end
end
