class CropPest < ActiveRecord::Base
  belongs_to :pest
  belongs_to :crop
end
