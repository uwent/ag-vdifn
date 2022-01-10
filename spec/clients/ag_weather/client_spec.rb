require "spec_helper"

RSpec.describe AgWeather::Client do
  let(:start_date) { Date.today - 14.days }
  let(:end_date) { Date.today }
  let(:client) { AgWeather::Client.new }
  let(:data) { {data: "data"}.to_json }

  describe "#pest_forecasts" do
    it "calls correct endpoint and returns success" do
      remote_name = "pest_name"
      options = {pest: remote_name, start_date:, end_date:}
      request_url = "#{ENV["AG_WEATHER_BASE_URL"]}/pest_forecasts?start_date=#{options[:start_date]}&end_date=#{options[:end_date]}&pest=#{options[:pest]}"
      stub_request(:get, request_url).to_return(status: 200, body: data, headers: {})

      response = client.pest_forecasts(options)

      expect(response[:data]).to eq("data")
    end
  end

  describe "#freeze" do
    it "calls correct endpoint and returns success" do
      options = {start_date:, end_date:}
      request_url = "#{ENV["AG_WEATHER_BASE_URL"]}/pest_forecasts/freeze?start_date=#{options[:start_date]}&end_date=#{options[:end_date]}"
      stub_request(:get, request_url).to_return(status: 200, body: data, headers: {})

      response = client.freeze_days(options)

      expect(response[:data]).to eq("data")
    end
  end

  # describe "#stations" do
  #   it "calls correct endpoint and returns success" do
  #     request_url = "#{ENV['AG_WEATHER_BASE_URL']}/stations"
  #     stub_request(:get, request_url).to_return(status: 200, body: data, headers: {})
  #     response = client.stations()

  #     expect(response[:data]).to eq("data")
  #   end
  # end

  describe "#point_details" do
    it "calls correct endpoint and returns success" do
      options = {pest: "pest_name", start_date:, end_date:, long: 10.0, lat: 11.0}
      request_url = "#{ENV["AG_WEATHER_BASE_URL"]}/pest_forecasts/point_details?pest=#{options[:pest]}&start_date=#{options[:start_date]}&end_date=#{options[:end_date]}&long=#{options[:long]}&lat=#{options[:lat]}"
      stub_request(:get, request_url).to_return(status: 200, body: data, headers: {})
      response = client.point_details(options)

      expect(response[:data]).to eq("data")
    end
  end

  # describe "#station_observations" do
  #   it  "calls correct endpoint and returns success" do
  #     options = { name: "name", start_date: start_date, end_date: end_date }
  #     request_url = "#{ENV['AG_WEATHER_BASE_URL']}/station_observations?name=#{options[:name]}&start_date=#{options[:start_date]}&end_date=#{options[:end_date]}"
  #     stub_request(:get, request_url).to_return(status: 200, body: data, headers: {})

  #     response = client.station_observations(options)

  #     expect(response[:data]).to eq("data")
  #   end
  # end

  describe "#custom" do
    it "calls correct endpoint and returns success" do
      options = {start_date:, end_date:, t_base: 10, t_upper: 50}
      request_url = "#{ENV["AG_WEATHER_BASE_URL"]}/pest_forecasts/custom?start_date=#{options[:start_date]}&end_date=#{options[:end_date]}&t_base=#{options[:t_base]}&t_upper=#{options[:t_upper]}"
      stub_request(:get, request_url).to_return(status: 200, body: data)
      response = client.custom(options)

      expect(response[:data]).to eq("data")
    end
  end

  describe "#custom_point_details" do
    it "calls correct endpoint and returns success" do
      options = {lat: 10, long: -90, start_date:, end_date:, t_base: 10, t_upper: 50}
      request_url = "#{ENV["AG_WEATHER_BASE_URL"]}/pest_forecasts/custom_point_details?lat=#{options[:lat]}&long=#{options[:long]}&t_base=#{options[:t_base]}&t_upper=#{options[:t_upper]}&start_date=#{options[:start_date]}&end_date=#{options[:end_date]}"
      stub_request(:get, request_url).to_return(status: 200, body: data)
      response = client.custom_point_details(options)

      expect(response[:data]).to eq("data")
    end
  end
end
