class CropPest < ApplicationRecord
  belongs_to :pest
  belongs_to :crop
end
