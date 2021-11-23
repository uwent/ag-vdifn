module AgWeather
  class Client
    include AgWeather::Endpoints
    include HTTParty

    base_uri ENV["AG_WEATHER_BASE_URL"]

    def pest_forecasts(options)
      Rails.logger.debug ">>> Getting Pest Forecasts"
      Rails.logger.debug "options: #{options}"
      forecasts = self.class.get(
        AgWeather::Endpoints::PEST_FORECASTS,
        query: options,
        timeout: 10
      )
      JSON.parse(forecasts.body, symbolize_names: true)
    end

    def custom(options)
      forecasts = self.class.get(
        AgWeather::Endpoints::CUSTOM,
        query: options,
        timeout: 10
      )
      JSON.parse(forecasts.body, symbolize_names: true)
    end

    def point_details(options)
      point_details = self.class.get(
        AgWeather::Endpoints::POINT_DETAILS,
        query: options,
        timeout: 10
      )
      JSON.parse(point_details.body, symbolize_names: true)
    end

    def custom_point_details(options)
      point_details = self.class.get(
        AgWeather::Endpoints::CUSTOM_POINT_DETAILS,
        query: options,
        timeout: 10
      )
      JSON.parse(point_details.body, symbolize_names: true)
    end

    def freeze_days(options)
      response = self.class.get(
        AgWeather::Endpoints::FREEZE,
        query: options,
        timeout: 10
      )
      JSON.parse(response.body, symbolize_names: true)
    end

    # def stations
    #   stations = self.class.get(
    #     AgWeather::Endpoints::STATIONS,
    #     timeout: 10
    #   )
    #   JSON.parse(stations.body, symbolize_names: true)
    # end

    # def station_observations(options)
    #   station_observations = self.class.get(
    #     AgWeather::Endpoints::STATION_OBSERVATIONS,
    #     query: get_options(options),
    #     timeout: 10
    #   )
    #   JSON.parse(station_observations.body, symbolize_names: true)
    # end

    private

    def get_options(options)
      options.each_with_object({}) { |q, h|
        h[q[0].to_s.underscore] = q[1]
      }
    end
  end
end
