require "spec_helper"

RSpec.describe SeveritiesController, type: :request do
  let(:json) { JSON.parse(response.body, symbolize_names: true) }
  let(:end_date) { Date.today }
  let(:pest_forecast) {{
    data: [
      { lat: 1, long: 1, total: 10, avg: 1 },
      { lat: 2, long: 2, total: 100, avg: 10 },
      { lat: 3, long: 3, total: 1000, avg: 100 }
    ]
  }}
  let(:freeze_data) {{
    data: [
      { lat: 1, long: 1, freeze: 1 },
      { lat: 2, long: 2, freeze: 0 },
      { lat: 3, long: 3, freeze: 0 }
    ]
  }}

  describe "POST severities" do
    describe "Disease models" do
      it "returns success response when CercosporaLeafSpot" do
        leaf_spot = CercosporaLeafSpot.create!
        allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).and_return(pest_forecast)
        post severities_path, params: {pest_id: leaf_spot.id}
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
        expect(json.first.keys).to match([:lat, :long, :severity])
      end

      it "returns success response when EarlyBlight" do
        early_blight = EarlyBlight.create!
        allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).and_return(pest_forecast)
        post severities_path, params: {pest_id: early_blight.id}
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
        expect(json.first.keys).to match([:lat, :long, :severity])
      end

      it "returns success response when FoliarDisease" do
        foliar_disease = CarrotFoliar.create!
        allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).and_return(pest_forecast)
        post severities_path, params: {pest_id: foliar_disease.id}
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
        expect(json.first.keys).to match([:lat, :long, :severity])
      end

      it "returns success response when LateBlight" do
        late_blight = LateBlight.create!
        allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).and_return(pest_forecast)
        allow_any_instance_of(AgWeather::Client).to receive(:freeze_days).and_return(freeze_data)
        post severities_path, params: {pest_id: late_blight.id}
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
        expect(json.first.keys).to match([:lat, :long, :severity])
      end
    end

    describe "Insect models" do
      it "returns success response when Insect" do
        pest = Insect.create!(risk_array: [[100, 200, 300]])
        allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).and_return(pest_forecast)
        allow_any_instance_of(AgWeather::Client).to receive(:freeze_days).and_return(freeze_data)
        post severities_path, params: {pest_id: pest.id}
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
        expect(json.first.keys).to match([:lat, :long, :severity])
      end

      it "returns success response when OakWilt" do
        pest = OakWilt.create!
        allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).and_return(pest_forecast)
        allow_any_instance_of(AgWeather::Client).to receive(:freeze_days).and_return(freeze_data)
        post severities_path, params: {pest_id: pest.id}
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
        expect(json.first.keys).to match([:lat, :long, :severity])
      end
    end

    describe "Custom tab" do
      it "returns success response when custom params sent" do
        allow_any_instance_of(AgWeather::Client).to receive(:custom).and_return(pest_forecast)
        post severities_path, params: {start_date: "2020-10-01", end_date: "2020-10-10", t_min: "10.0", t_max: "50.0"}
        expect(response).to have_http_status(:success)
        expect(response.body).to eq(pest_forecast.to_json)
      end
    end
  end
end
