require "spec_helper"

RSpec.describe DbController, type: :request do
  let(:fake_response) { {data: "data"} }

  describe "GET db/disease_panel" do
    it "returns success response" do
      crop = Crop.create(name: "crop")
      crop.pests << CercosporaLeafSpot.create(name: "cercospora_leaf_spot")
      crop.pests << EarlyBlight.create(name: "early_blight", biofix_mm: 1, biofix_dd: 1)
      crop.pests << CarrotFoliar.create(name: "foliar_disease")
      crop.pests << LateBlight.create(name: "late_blight")
      get(disease_panel_db_index_path)
      expect(response).to have_http_status(:success)
      expect(response.body).not_to be_empty
    end
  end

  describe "GET db/insect_panel" do
    it "returns success response" do
      crop = Crop.create(name: "crop")
      crop.pests << Insect.create(name: "test1", biofix_mm: 1, biofix_dd: 2)
      crop.pests << Insect.create(name: "test2", biofix_mm: 1, biofix_dd: 2)
      get(insect_panel_db_index_path)
      expect(response).to have_http_status(:success)
      expect(response.body).not_to be_empty
    end
  end

  describe "POST db/severity_legend" do
    it "returns success response" do
      pest = CarrotFoliar.create
      get(severity_legend_db_index_path, params: {pest_id: pest.id})
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST db/severity_legend_info" do
    it "returns success response" do
      pest = Insect.create
      get(severity_legend_info_db_index_path, params: {pest_id: pest.id})
      expect(response).to have_http_status(:success)
    end
  end
end
