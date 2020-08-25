require "spec_helper"

RSpec.describe CropPest, type: :model do

  it { should belong_to(:pest) }
  it { should belong_to(:crop) }
end
