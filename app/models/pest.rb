class Pest < ActiveRecord::Base

  has_many :crop_pests, dependent: :destroy
  has_many :crops, through: :crop_pests
end
