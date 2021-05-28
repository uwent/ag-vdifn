require "spec_helper"

RSpec.describe DbController, type: :request do
  let(:fake_response) { { data: "data" } }
  let(:severity_data) { [{ lat: 20, long: 40, total: 200 }] }
  let(:days_data) { [{ value: 10, date: "data", avg_temp: "100"}] }
  # let(:station_data) { [{ potato_late_blight_dsv: 15, value: 10, date: "data", avg_temp: "100"}] }

  describe "GET db/disease_panel" do
    it "returns success response" do
      crop = Crop.create!(name: "crop")
      crop.pests << CercosporaLeafSpot.create!(name: "cercospora_leaf_spot")
      crop.pests << EarlyBlight.create!(name: "early_blight", biofix_mm: 1, biofix_dd: 1)
      crop.pests << FoliarDisease.create!(name: "foliar_disease")
      crop.pests << LateBlight.create!(name: "late_blight")
      get disease_panel_db_index_path
      expect(response).to have_http_status(:success)
      expect(response.body).not_to be_empty
    end
  end

  describe "GET db/insect_panel" do
    it "returns success response" do
      crop = Crop.create!(name: "crop")
      crop.pests << Insect.create!(name: "test1", biofix_mm: 1, biofix_dd: 2)
      crop.pests << Insect.create!(name: "test2", biofix_mm: 1, biofix_dd: 2)

      get insect_panel_db_index_path

      expect(response).to have_http_status(:success)
      expect(response.body).not_to be_empty
    end
  end

  describe "POST db/severities" do

    describe "Pest models" do
      it "returns success response when Pest" do
        pest = Pest.create!
        allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).and_return(severity_data)
        post severities_db_index_path, params: { pest_id: pest.id }
        expect(response).to have_http_status(:success)
        expect(response.body).to eq([{lat: 20, long: 40, severity: 0}].to_json)
      end
    end

    describe "Disease models" do
      it "returns success response when CercosporaLeafSpot" do
        leaf_spot = CercosporaLeafSpot.create!
        allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).and_return(severity_data)
        post severities_db_index_path, params: { pest_id: leaf_spot.id }
        expect(response).to have_http_status(:success)
        expect(response.body).to eq([{lat: 20, long: 40, severity: 4}].to_json)
      end

      it "returns success response when EarlyBlight" do
        early_blight = EarlyBlight.create!
        allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).and_return(severity_data)
        post severities_db_index_path, params: { pest_id: early_blight.id }
        expect(response).to have_http_status(:success)
        expect(response.body).to eq([{lat: 20, long: 40, severity: 2}].to_json)
      end

      it "returns success response when FoliarDisease" do
        foliar_disease = FoliarDisease.create!
        allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).and_return(severity_data)
        post severities_db_index_path, params: { pest_id: foliar_disease.id }
        expect(response).to have_http_status(:success)
        expect(response.body).to eq([{lat: 20, long: 40, severity: 4}].to_json)
      end

      it "returns success response when LateBlight" do
        late_blight = LateBlight.create!
        allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).and_return(severity_data)
        post severities_db_index_path, params: { pest_id: late_blight.id }
        expect(response).to have_http_status(:success)
        expect(response.body).to eq([{lat: 20, long: 40, severity: 4}].to_json)
      end
    end

    describe "Insect models" do
      it "returns success response when Insect" do
        pest = Insect.create!(risk_array: [[100, 200, 300]])
        allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).and_return(severity_data)
        post severities_db_index_path, params: { pest_id: pest.id }
        expect(response).to have_http_status(:success)
        expect(response.body).to eq([{lat: 20, long: 40, severity: 4}].to_json)
      end

      it "returns success response when OakWilt" do
        pest = OakWilt.create!()
        allow_any_instance_of(AgWeather::Client).to receive(:pest_forecasts).and_return(severity_data)
        post severities_db_index_path, params: { pest_id: pest.id }
        expect(response).to have_http_status(:success)
        expect(response.body).to eq([{lat: 20, long: 40, severity: 2}].to_json)
      end
    end

    describe "Custom tab" do
      it "returns success response when custom params sent" do
        allow_any_instance_of(AgWeather::Client).to receive(:custom).and_return(severity_data)
        post severities_db_index_path, params: { start_date: "2020-10-01", end_date: "2020-10-10", t_min: "10.0", t_max: "50.0" }
        expect(response).to have_http_status(:success)
        expect(response.body).to eq(severity_data.to_json)
      end
    end
  end

  # describe "POST db/stations" do
  #   it "returns success response" do
  #     allow_any_instance_of(AgWeather::Client).to receive(:stations).and_return(fake_response)

  #     post stations_db_index_path

  #     expect(response).to have_http_status(:success)
  #     expect(response.body).to eq(fake_response.to_json)
  #   end
  # end

  describe "POST db/point_details" do
    it "returns success response when standard pest from disease panel" do
      pest = Pest.create!(remote_name: "pest")
      start_date = Date.current
      end_date = Date.current - 20.days
      latitude = 10
      longitude = 20
      allow_any_instance_of(AgWeather::Client).to receive(:point_details).and_return(days_data)

      expect_any_instance_of(AgWeather::Client).to receive(:point_details).with({
        start_date: start_date,
        end_date: end_date,
        latitude: latitude.to_f,
        longitude: longitude.to_f,
        pest: "pest",
      })

      post point_details_db_index_path, params: {
        pest_id: pest.id,
        latitude: latitude,
        longitude: longitude,
        start_date: start_date,
        end_date: end_date,
        panel: "disease"
      }

      expect(response).to have_http_status(:success)
    end

    it "returns success response when standard pest from insect panel" do
      pest = Pest.create!(remote_name: "pest")
      start_date = Date.current
      end_date = Date.current - 20.days
      latitude = 10
      longitude = 20
      allow_any_instance_of(AgWeather::Client).to receive(:point_details).and_return(days_data)

      expect_any_instance_of(AgWeather::Client).to receive(:point_details).with({
        start_date: start_date,
        end_date: end_date,
        latitude: latitude.to_f,
        longitude: longitude.to_f,
        pest: "pest",
      })

      post point_details_db_index_path, params: {
        pest_id: pest.id,
        latitude: latitude,
        longitude: longitude,
        start_date: start_date,
        end_date: end_date,
        panel: "insect"
      }

      expect(response).to have_http_status(:success)
    end

    it "returns success response when custom pest" do
      Pest.create!
      t_min = 50
      t_max = 100
      start_date = Date.current
      end_date = Date.current - 20.days
      latitude = 10
      longitude = 20
      allow_any_instance_of(AgWeather::Client).to receive(:custom_point_details).and_return(days_data)

      expect_any_instance_of(AgWeather::Client).to receive(:custom_point_details).with({
        start_date: start_date,
        end_date: end_date,
        latitude: latitude.to_f,
        longitude: longitude.to_f,
        t_min: t_min,
        t_max: t_max
      })

      post point_details_db_index_path, params: {
        t_min: t_min,
        t_max: t_max,
        latitude: latitude,
        longitude: longitude,
        start_date: start_date,
        end_date: end_date,
        panel: "custom"
      }

      expect(response).to have_http_status(:success)
    end
  end

  # describe "POST db/station_details" do
  #   it "returns success response" do
  #     allow_any_instance_of(AgWeather::Client).to receive(:station_observations).
  #       and_return(station_data)

  #     post station_details_db_index_path, params: { name: "name" }

  #     expect(response).to have_http_status(:success)
  #   end
  # end

  describe "POST db/severity_legend" do
    it "returns success response" do
      pest = FoliarDisease.create!

      post severity_legend_db_index_path, params: { pest_id: pest.id }

      expect(response).to have_http_status(:success)
    end
  end

  describe "POST db/severity_legend_info" do
    it "returns success response" do
      pest = Insect.create!

      post severity_legend_info_db_index_path, params: { pest_id: pest.id }

      expect(response).to have_http_status(:success)
    end
  end

  describe "POST db/pest_info" do
    it "returns success response" do
      pest = Pest.create!(biofix_mm: 10, biofix_dd: 22)

      post pest_info_db_index_path, params: { pest_id: pest.id, in_fahrenheit: "true" }

      expect(response).to have_http_status(:success)
    end
  end
end
