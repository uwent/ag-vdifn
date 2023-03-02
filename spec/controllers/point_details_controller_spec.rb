require "spec_helper"

RSpec.describe PointDetailsController, type: :request do
  let(:start_date) {1.week.ago.to_date}
  let(:end_date) {Date.yesterday}
  let(:lat) {45.0}
  let(:long) {-89.0}
  let(:units) {"F"}
  let(:agwx_response) {
    [
      {date: 2.days.ago.to_date, value: 10, cumulative_value: 10},
      {date: 1.day.ago.to_date, value: 5, cumulative_value: 15}
    ]
  }

  describe "POST point_details" do
    before do
      stub_request(:get, /pest_forecasts*/).to_return(body: "foo" )
      stub_request(:get, /degree_days*/).to_return(body: "bar")
    end

    it "returns success response when standard pest from disease panel" do
      pest = Disease.create(remote_name: "pest")

      allow(AgWeather).to receive(:pest_point).and_return(agwx_response)
      expect(AgWeather).to receive(:pest_point).with(
        {lat:, long:, start_date:, end_date:, pest: "pest", units:}
      )

      post point_details_path, params: {
        panel: "disease",
        pest_id: pest.id,
        latitude: lat,
        longitude: long,
        start_date:,
        end_date:,
      }
      expect(response).to have_http_status(:success)
    end

    it "returns success response when standard pest from insect panel" do
      pest = Insect.create(remote_name: "dd_50", t_min: 50, t_max: nil)

      allow(AgWeather).to receive(:dd_point).and_return(agwx_response)
      expect(AgWeather).to receive(:dd_point).with(
        {lat:, long:, start_date:, end_date:, model: pest.remote_name, units:}
      )

      post point_details_path, params: {
        panel: "insect",
        pest_id: pest.id,
        latitude: lat,
        longitude: long,
        start_date:,
        end_date:
      }
      expect(response).to have_http_status(:success)
    end

    it "returns success response when custom pest" do
      base = 50.0
      upper = 100.0

      allow(AgWeather).to receive(:dd_point).and_return(agwx_response)
      expect(AgWeather).to receive(:dd_point).with(
        {lat:, long:, start_date:, end_date:, base:, upper:, units:}
      )

      post point_details_path, params: {
        panel: "custom",
        latitude: lat,
        longitude: long,
        start_date:,
        end_date:,
        t_min: base,
        t_max: upper
      }
      expect(response).to have_http_status(:success)
    end
  end
end
