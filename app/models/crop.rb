class Crop < ActiveRecord::Base
  has_many :crop_pests, dependent: :destroy
  has_many :pests,  -> { order "name" }, through: :crop_pests
end
