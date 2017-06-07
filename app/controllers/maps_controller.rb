class MapsController < ApplicationController
  def index
    @sidebar = params[:infliction] || 'disease'
    if (@sidebar == 'insect')
      pests = Pest.all.select { |p| p.is_a? DegreeDayPest }
    elsif (@sidebar == 'custom')
      pests = []
    else
      pests = Pest.all.select { |p| p.is_a? DsvPest }
    end
    @crops = crops_for_pests(pests)
  end

  def sidebar
    @sidebar = params[:interface]
    if (@sidebar == 'insect')
      pests = Pest.all.select { |p| p.is_a? DegreeDayPest }
    elsif (@sidebar == 'custom')
      pests = []
    else
      pests = Pest.all.select { |p| p.is_a? DsvPest }
    end
    @crops = crops_for_pests(pests)
    render layout: false
  end

  private
  def crops_for_pests(pests)
    pests.map { |p| p.crops }.flatten.uniq.sort
  end
end
