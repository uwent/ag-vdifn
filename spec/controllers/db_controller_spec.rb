require "spec_helper"

RSpec.describe DbController, type: :request do
  let(:fake_response) { { data: "data" } }
  let(:severity_data) { [{ lat: 20, long: 40, total: 200 }] }
  let(:days_data) { [{ value: 10, date: "data", avg_temperature: "100"}] }
  let(:station_data) { [{ potato_late_blight_dsv: 15, value: 10, date: "data", avg_temperature: "100"}] }

  describe "POST#severities" do
    it "returns success response" do
      pest = Pest.create!
      allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).
        and_return(severity_data)

      post severities_db_index_path, params: { pest_id: pest.id }

      expect(response).to have_http_status(:success)
      expect(response.body).to eq([{lat: 20, long: 40, severity: 0}].to_json)
    end

    it "returns correct response when Late Blight" do
      late_blight = DsvPests::LateBlight.create!
      allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).
        and_return(severity_data)

      post severities_db_index_path, params: { pest_id: late_blight.id }

      expect(response).to have_http_status(:success)
      expect(response.body).to eq([{lat: 20, long: 40, severity: 4}].to_json)
    end
  end

  describe "POST#stations" do
    it "returns success response" do
      allow_any_instance_of(AgWeather::Client).to receive(:stations).
        and_return(fake_response)

      post stations_db_index_path

      expect(response).to have_http_status(:success)
      expect(response.body).to eq(fake_response.to_json)
    end
  end

  describe "POST#point_details" do
    it "returns success response" do
      pest = Pest.create!
      allow_any_instance_of(AgWeather::Client).to receive(:point_details).
        and_return(days_data)

      post point_details_db_index_path, params: { pest_id: pest.id, latitude: 10, longitude: 20 }

      expect(response).to have_http_status(:success)
    end
  end

  describe "POST#station_details" do
    it "returns success response" do
      allow_any_instance_of(AgWeather::Client).to receive(:station_observations).
        and_return(station_data)

      post station_details_db_index_path, params: { name: "name" }

      expect(response).to have_http_status(:success)
    end
  end

  describe "POST#severity_legend" do
    it "returns success response" do
      pest = DsvPests::FoliarDisease.create!

      post severity_legend_db_index_path, params: { pest_id: pest.id }

      expect(response).to have_http_status(:success)
    end
  end

  describe "POST#pest_info" do
    it "returns success response" do
      pest = Pest.create!(biofix_mm: 10, biofix_dd: 22)

      post pest_info_db_index_path, params: { pest_id: pest.id, in_fahrenheit: "true" }

      expect(response).to have_http_status(:success)
    end
  end
end
