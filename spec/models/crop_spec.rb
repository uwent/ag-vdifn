require "spec_helper"

RSpec.describe Crop, type: :model do
  it { should have_many(:crop_pests) }
  it { should have_many(:pests) }
end
