class Crop < ActiveRecord::Base
  has_many :crop_pests, dependent: :destroy
  has_many :pests, through: :crop_pests
end
