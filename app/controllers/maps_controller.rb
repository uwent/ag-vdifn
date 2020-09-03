class MapsController < ApplicationController
  def index
    setup_sidebar
  end

  def sidebar
    setup_sidebar
    render layout: false
  end

  private
  def setup_sidebar
    @sidebar = params[:interface] || 'disease'
    if (@sidebar == 'insect')
      @pests = Pest.all.select { |p| p.is_a? DegreeDayPest }
    elsif (@sidebar == 'custom')
      @pests = []
    else
      @pests = Pest.all.select { |p| p.is_a? DsvPests::DsvPest }
    end
    @crops = crops_for_pests(@pests)
  end

  def crops_for_pests(pests)
    crops = pests.map { |p| p.crops }.flatten.uniq.sort
    any_crop = Crop.new(id:0, name: 'Any')
    any_crop.pests = pests.sort { |x, y| x.name <=> y.name }
    crops.unshift(any_crop)
  end
end
