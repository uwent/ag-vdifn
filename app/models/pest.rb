class Pest < ActiveRecord::Base
  REMOTE_HOST = ENV['AG_WEATHER_BASE_URL'] || 'http://localhost:3000'

  has_many :crop_pests, dependent: :destroy
  has_many :crops, through: :crop_pests
end
