require "spec_helper"

RSpec.describe SeveritiesController, type: :request do
  let(:json) { JSON.parse(response.body, symbolize_names: true) }
  let(:end_date) { Date.today }
  let(:degree_days_data) {
    {
      [1, 1] => 10,
      [1, 2] => 15,
      [2, 1] => 20,
      [2, 2] => 25
    }
  }
  let(:pest_forecast_data) {
    {
      [1, 1] => {total: 10, avg: 1},
      [1, 2] => {total: 15, avg: 2},
      [2, 1] => {total: 20, avg: 3},
      [2, 2] => {total: 25, avg: 4}
    }
  }
  let(:freeze_data) {
    {
      [1, 1] => 0,
      [1, 2] => 1,
      [2, 1] => 0,
      [2, 2] => 2
    }
  }

  describe "POST severities" do
    before do
      stub_request(:get, /degree_days\/grid*/).to_return(body: degree_days_data.to_json)
      stub_request(:get, /pest_forecasts\/grid*/).to_return(body: pest_forecast_data.to_json)
    end

    describe "Disease models" do
      it "returns success response when CercosporaLeafSpot" do
        leaf_spot = CercosporaLeafSpot.create!
        allow(AgWeather).to receive(:pest_grid).and_return(pest_forecast_data)
        post severities_path, params: {pest_id: leaf_spot.id}
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
        expect(json.first.keys).to match([:lat, :long, :value])
      end

      it "returns success response when EarlyBlight" do
        early_blight = EarlyBlight.create!
        allow(AgWeather).to receive(:pest_grid).and_return(pest_forecast_data)
        post severities_path, params: {pest_id: early_blight.id}
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
        expect(json.first.keys).to match([:lat, :long, :value])
      end

      it "returns success response when FoliarDisease" do
        foliar_disease = CarrotFoliar.create!
        allow(AgWeather).to receive(:pest_grid).and_return(pest_forecast_data)
        post severities_path, params: {pest_id: foliar_disease.id}
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
        expect(json.first.keys).to match([:lat, :long, :value])
      end

      it "returns success response when LateBlight" do
        late_blight = LateBlight.create!
        allow(AgWeather).to receive(:pest_grid).and_return(pest_forecast_data)
        allow(AgWeather).to receive(:freeze_days).and_return(freeze_data)
        post severities_path, params: {pest_id: late_blight.id}
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
        expect(json.first.keys).to match([:lat, :long, :value])
      end
    end

    describe "Insect models" do
      it "returns success response when Insect" do
        pest = Insect.create(risk_array: [[100, 200, 300]])
        allow(AgWeather).to receive(:dd_grid).and_return(degree_days_data)
        allow(AgWeather).to receive(:freeze_days).and_return(freeze_data)
        post severities_path, params: {pest_id: pest.id}
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
        expect(json.first.keys).to match([:lat, :long, :value])
      end

      it "returns success response when OakWilt" do
        pest = OakWilt.create!
        allow(AgWeather).to receive(:dd_grid).and_return(degree_days_data)
        allow(AgWeather).to receive(:freeze_days).and_return(freeze_data)
        post severities_path, params: {pest_id: pest.id}
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
        expect(json.first.keys).to match([:lat, :long, :value])
      end
    end

    describe "Custom tab" do
      it "returns success response when custom params sent" do
        allow(AgWeather).to receive(:dd_grid).and_return(degree_days_data)
        post severities_path, params: {start_date: "2020-10-01", end_date: "2020-10-10", base: "10.0", upper: "50.0"}
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
        expect(json.first.keys).to match([:lat, :long, :value])
      end
    end
  end
end
