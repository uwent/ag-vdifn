module AgWeather
  class Client
    include AgWeather::Endpoints
    include HTTParty

    base_uri ENV['AG_WEATHER_BASE_URL']

    def custom(options)
      forecasts = self.class.get(
        AgWeather::Endpoints::CUSTOM,
        query: get_options(options),
        timeout: 12000
      )
      JSON.parse(forecasts.body, symbolize_names: true)
    end

    def custom_point_details(options)
      point_details = self.class.get(
        AgWeather::Endpoints::CUSTOM_POINT_DETAILS,
        query: get_options(options),
        timeout: 1000
      )
      JSON.parse(point_details.body, symbolize_names: true)
    end

    def pest_forecasts(options)
      forecasts = self.class.get(
        AgWeather::Endpoints::PEST_FORECASTS,
        query: get_options(options),
        timeout: 10
      )
      JSON.parse(forecasts.body, symbolize_names: true)
    end

    def stations
      stations = self.class.get(
        AgWeather::Endpoints::STATIONS,
        timeout: 10
      )
      JSON.parse(stations.body, symbolize_names: true)
    end

    def point_details(options)
      point_details = self.class.get(
        AgWeather::Endpoints::POINT_DETAILS,
        query: get_options(options),
        timeout: 10
      )
      JSON.parse(point_details.body, symbolize_names: true)
    end

    def station_observations(options)
      station_observations = self.class.get(
        AgWeather::Endpoints::STATION_OBSERVATIONS,
        query: get_options(options),
        timeout: 10
      )
      JSON.parse(station_observations.body, symbolize_names: true)
    end

    private

    def get_options(options)
      options.inject({}) { |h, q| h[q[0].to_s.underscore] = q[1]; h }
    end
  end
end
