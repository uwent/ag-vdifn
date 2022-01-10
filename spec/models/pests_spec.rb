require "spec_helper"

RSpec.describe Pest, type: :model do
  it { should have_many(:crop_pests) }
  it { should have_many(:crops) }

  let(:pest) { Pest.new(biofix_mm: 1, biofix_dd: 1) }

  it "generates a biofix date" do
    expect(pest.biofix_date).to eq(Date.new(Date.current.year, 1, 1))
  end
end
