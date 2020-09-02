require "spec_helper"

RSpec.describe Pest, type: :model do
  it { should have_many(:crop_pests) }
  it { should have_many(:crops) }

end
