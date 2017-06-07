class Crop < ActiveRecord::Base
  has_many :crop_pests, dependent: :destroy
  has_many :pests,  -> { order "name" }, through: :crop_pests

  def diseases
    pests.select { |p| p.is_a? DsvPest }
  end

  def insects
    pests.select { |p| p.is_a? DegreeDayPest }
  end
end
