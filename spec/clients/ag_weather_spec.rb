require "spec_helper"

RSpec.describe AgWeather do
  let(:endpoint) { ENV["AG_WEATHER_BASE_URL"] }
  let(:start_date) { 14.days.ago.to_date }
  let(:end_date) { Date.today }
  let(:dd_grid) {
    {
      [1, 1] => 10,
      [1, 2] => 15,
      [2, 1] => 20,
      [2, 2] => 25
    }
  }
  let(:pf_grid) {
    {
      [1, 1] => {total: 10, avg: 1},
      [1, 2] => {total: 15, avg: 2},
      [2, 1] => {total: 20, avg: 3},
      [2, 2] => {total: 25, avg: 4}
    }
  }
  let(:freeze_grid) {
    {
      [1, 1] => 0,
      [1, 2] => 1,
      [2, 1] => 0,
      [2, 2] => 2
    }
  }
  let(:point_data) {
    [
      {date: 2.days.ago.to_date, value: 10, cumulative_value: 10},
      {date: 1.day.ago.to_date, value: 5, cumulative_value: 15}
    ]
  }

  describe "#pest_grid" do
    it "calls correct endpoint and returns success" do
      remote_name = "bug"
      options = {pest: remote_name, start_date:, end_date:}
      request_url = "#{endpoint}/pest_forecasts/grid?#{options.to_query}"
      stub_request(:get, request_url).to_return(body: {data: pf_grid}.to_json)

      data = AgWeather.pest_grid(options)
      expect(data).to eq(pf_grid)
    end
  end

  describe "#dd_grid" do
    it "calls correct endpoint and returns success" do
      remote_name = "dd_50"
      options = {model: remote_name, start_date:, end_date:}
      request_url = "#{endpoint}/degree_days/grid?#{options.to_query}"
      stub_request(:get, request_url).to_return(body: {data: dd_grid}.to_json)

      data = AgWeather.dd_grid(options)
      expect(data).to eq(dd_grid)
    end
  end

  describe "#freeze" do
    it "calls correct endpoint and returns success" do
      options = {start_date:, end_date:}
      request_url = "#{endpoint}/weather/freeze_grid?#{options.to_query}"
      stub_request(:get, request_url).to_return(body: {data: freeze_grid}.to_json)

      data = AgWeather.freeze_grid(options)
      expect(data).to eq(freeze_grid)
    end
  end

  describe "#pest_point" do
    it "calls correct endpoint and returns success" do
      options = {lat: 10.0, long: 20.0, start_date:, end_date:, pest: "blight"}
      request_url = "#{endpoint}/pest_forecasts?#{options.to_query}"
      stub_request(:get, request_url).to_return(body: {data: point_data}.to_json)

      data = AgWeather.pest_point(options)
      expect(data).to eq(point_data)
    end
  end

  describe "#dd_point" do
    it "calls correct endpoint and returns success" do
      options = {lat: 11.0, long: 20.0, start_date:, end_date:, base: 50}
      request_url = "#{endpoint}/degree_days?#{options.to_query}"
      stub_request(:get, request_url).to_return(body: {data: point_data}.to_json)

      data = AgWeather.dd_point(options)
      expect(data).to eq(point_data)
    end
  end
end
