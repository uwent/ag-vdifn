module AgWeather
  class Client
    include AgWeather::Endpoints
    include HTTParty

    base_uri ENV['AG_WEATHER_BASE_URL']

    def pest_forecasts(options)
      self.class.get(AgWeather::Endpoints::PEST_FORECASTS, query: get_options(options), timeout: 10)
    end

    def stations
      self.class.get(AgWeather::Endpoints::STATIONS, timeout: 10)
    end

    def point_details(options)
      self.class.get(AgWeather::Endpoints::POINT_DETAILS, query: get_options(options), timeout: 10)
    end

    def station_observations(options)
      self.class.get(AgWeather::Endpoints::STATION_OBSERVATIONS, query: get_options(options), timeout: 10)
    end

    private

    def get_options(options)
      options.inject({}) { |h, q| h[q[0].to_s.underscore] = q[1]; h }
    end
    attr_reader :client, :base_url
  end
end
