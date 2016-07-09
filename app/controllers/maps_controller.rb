class MapsController < ApplicationController
  def index
    @crops = { "carrot" => "Carrot", "potato" => "Potato" }
  end
end
