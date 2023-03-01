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

  def self.pest_grid(query)
    fetch(PEST_GRID, query:)
  end

  def self.pest_point(query)
    fetch(PEST_POINT, query:, timeout: 10)
  end

  def self.dd_grid(query)
    fetch(DD_GRID, query:)
  end

  def self.dd_point(query)
    fetch(DD_POINT, query:, timeout: 10)
  end

  def self.freeze_grid(query)
    fetch(FREEZE_GRID, query:)
  end

  private

  # def get_options(options)
  #   options.each_with_object({}) { |q, h|
  #     h[q[0].to_s.underscore] = q[1]
  #   }
  # end
end
