class MapsController < ApplicationController
  def index
    @crops = Crop.all
  end
end
