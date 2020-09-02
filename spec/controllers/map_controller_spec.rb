require "spec_helper"

RSpec.describe MapsController, type: :request do

  describe "GET#maps" do
    it "returns success response" do
      get maps_path

      expect(response).to have_http_status(:success)
    end
  end

  describe "GET#sidebar" do
    it "returns success response" do
      post sidebar_maps_path

      expect(response).to have_http_status(:success)
    end
  end
end
