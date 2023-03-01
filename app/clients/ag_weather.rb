class AgWeather
  include HTTParty

  base_uri ENV["AG_WEATHER_BASE_URL"]
  
  PEST_GRID = "/pest_forecasts/grid"
  PEST_POINT = "/pest_forecasts"
  DD_GRID = "/degree_days/grid"
  DD_POINT = "/degree_days"
  FREEZE_GRID = "/weather/freeze_grid"

  def self.fetch(endpoint, query:, timeout: 60)
    response = self.get(endpoint, query:, timeout: 60)
    JSON.parse(response.body, symbolize_names: true)
  end

  ## Grids - returns hash where [lat, long] = value ##

  def self.pest_grid(query)
    resp = fetch(PEST_GRID, query:)
    data = resp[:data] || {}
    parse_grid_keys(data)
  end

  def self.dd_grid(query)
    resp = fetch(DD_GRID, query:)
    data = resp[:data] || {}
    parse_grid_keys(data)
  end

  def self.freeze_grid(query)
    resp = fetch(FREEZE_GRID, query:)
    data = resp[:data] || {}
    parse_grid_keys(data)
  end

  ## Point data - returns array of hashes ##

  def self.pest_point(query)
    resp = fetch(PEST_POINT, query:, timeout: 10)
    resp[:data] || []
  end

  def self.dd_point(query)
    resp = fetch(DD_POINT, query:, timeout: 10)
    resp[:data] || []
  end

  ## Utils ##

  def self.parse_grid_keys(grid)
    hash = {}
    grid.each do |key, value|
      hash[JSON.parse(key.to_s)] = value
    end
    hash
  end
end
