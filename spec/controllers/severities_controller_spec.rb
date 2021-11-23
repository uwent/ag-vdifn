require "spec_helper"

RSpec.describe SeveritiesController, type: :request do
  let(:end_date) { Date.today }
  let(:pest_forecast) {
    { data: [{lat: 20, long: 40, total: 200, avg: 10}] }
  }
  let(:freeze_data) {
    { data: [{lat: 20, long: 40, freeze: 0}] }
  }

  describe "POST severities" do
    describe "Disease models" do
      it "returns success response when CercosporaLeafSpot" do
        leaf_spot = CercosporaLeafSpot.create!
        allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).and_return(pest_forecast)
        post severities_path, params: {pest_id: leaf_spot.id}
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
      end

      it "returns success response when EarlyBlight" do
        early_blight = EarlyBlight.create!
        allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).and_return(pest_forecast)
        post severities_path, params: {pest_id: early_blight.id}
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
      end

      it "returns success response when FoliarDisease" do
        foliar_disease = CarrotFoliar.create!
        allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).and_return(pest_forecast)
        post severities_path, params: {pest_id: foliar_disease.id}
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
      end

      it "returns success response when LateBlight" do
        late_blight = LateBlight.create!
        allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).and_return(pest_forecast)
        allow_any_instance_of(AgWeather::Client).to receive(:freeze_days).and_return(freeze_data)
        post severities_path, params: {pest_id: late_blight.id}
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
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
      end

      it "returns success response when OakWilt" do
        pest = OakWilt.create!
        allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).and_return(pest_forecast)
        allow_any_instance_of(AgWeather::Client).to receive(:freeze_days).and_return(freeze_data)
        post severities_path, params: {pest_id: pest.id}
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
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
