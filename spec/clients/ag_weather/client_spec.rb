require 'spec_helper'

RSpec.describe AgWeather::Client do

  let(:start_date) { Date.today }
  let(:end_date) { Date.tomorrow }
  let(:client) { AgWeather::Client.new }

  describe "#pest_forecasts" do
    it "calls correct endpoint and returns success" do
      remote_name = 'pest_name'
      options = { pest: remote_name, start_date: start_date, end_date: end_date }
      request_url = "#{ENV['AG_WEATHER_BASE_URL']}/pest_forecasts?start_date=#{options[:start_date]}&end_date=#{options[:end_date]}&pest=#{options[:pest]}"
      stub_request(:get, request_url).to_return(status: 200, body: "", headers: {})

      response = client.pest_forecasts(options)

      expect(response.code).to eq(200)
    end
  end

  describe "#stations" do
    it "calls correct endpoint and returns success" do
      request_url = "#{ENV['AG_WEATHER_BASE_URL']}/stations"
      stub_request(:get, request_url).to_return(status: 200, body: "", headers: {})
      response = client.stations()

      expect(response.code).to eq(200)
    end
  end

  describe "#point_details" do
    it  "calls correct endpoint and returns success" do
      options = { pest: "pest_name", start_date: start_date, end_date: end_date, longitude: 10.0, latitude: 11.0 }
      request_url = "#{ENV['AG_WEATHER_BASE_URL']}/pest_forecasts/point_details?pest=#{options[:pest]}&start_date=#{options[:start_date]}&end_date=#{options[:end_date]}&longitude=#{options[:longitude]}&latitude=#{options[:latitude]}"
      stub_request(:get, request_url).to_return(status: 200, body: "", headers: {})
      response = client.point_details(options)

      expect(response.code).to eq(200)
    end
  end

  describe "#station_observations" do
    it  "calls correct endpoint and returns success" do
      options = { name: "name", start_date: start_date, end_date: end_date }
      request_url = "#{ENV['AG_WEATHER_BASE_URL']}/station_observations?name=#{options[:name]}&start_date=#{options[:start_date]}&end_date=#{options[:end_date]}"
      stub_request(:get, request_url).to_return(status: 200, body: "", headers: {})

      response = client.station_observations(options)

      expect(response.code).to eq(200)
    end
  end
end
