class AgWeather
  include HTTParty

  base_uri ENV["AG_WEATHER_BASE_URL"]
  
  PEST_GRID = "/pest_forecasts/grid"
  PEST_POINT = "/pest_forecasts"
  DD_GRID = "/degree_days/grid"
  DD_POINT = "/degree_days"
  FREEZE_GRID = "/weather/freeze_grid"

  def self.fetch(endpoint, query:, timeout: 60)
    resp = self.get(endpoint, query:, timeout: 60)
    data = JSON.parse(resp.body, symbolize_names: true)
    Rails.logger.debug data[:info]
    data[:data]
  end

  ## Grids - returns hash where [lat, long] = value ##

  def self.pest_grid(query)
    data = fetch(PEST_GRID, query:) || {}
    parse_grid_keys(data)
  end

  def self.dd_grid(query)
    data = fetch(DD_GRID, query:) || {}
    parse_grid_keys(data)
  end

  def self.freeze_grid(query)
    data = fetch(FREEZE_GRID, query:) || {}
    parse_grid_keys(data)
  end

  ## Point data - returns array of hashes ##

  def self.pest_point(query)
    data = fetch(PEST_POINT, query:, timeout: 10) || []
    parse_dates(data)
  end

  def self.dd_point(query)
    data = fetch(DD_POINT, query:, timeout: 10) || []
    parse_dates(data)
  end

  ## Utils ##

  def self.parse_grid_keys(grid)
    hash = {}
    grid.each do |key, value|
      hash[JSON.parse(key.to_s)] = value
    end
    hash
  end

  def self.parse_dates(data)
    data.each { |d| d[:date] = parse_date(d[:date]) }
  end

  def self.parse_date(date)
    Date.parse(date)
  rescue
    date
  end
end
