require "spec_helper"

RSpec.describe BotrytisLeafBlight, type: :model do
  let(:biofix) { Date.today - 14.days }
  let(:pest) { BotrytisLeafBlight.new }
  let(:grid) {
    [
      {lat: 1, lng: 1, total: rand(10)},
      {lat: 1, lng: 2, total: rand(25)},
      {lat: 2, lng: 1, total: rand(50)},
      {lat: 2, lng: 2, total: rand(100)}
    ]
  }

  it "has a severity legend with 5 levels" do
    legend = pest.severity_legend
    expect(legend).not_to be_empty
    expect(legend.length).to eq(5)
  end

  it "renders severity from totals" do
    expect(pest.total_to_severity(0)).to eq(0)
    expect(pest.total_to_severity(1)).to eq(1)
    expect(pest.total_to_severity(21)).to eq(2)
    expect(pest.total_to_severity(31)).to eq(3)
    expect(pest.total_to_severity(40)).to eq(4)
  end

  it "generates severities from weather" do
    expect(pest).to receive(:total_to_severity).exactly(4).times
    pest.severities_from_totals(grid)
  end

  it "sets biofix date" do
    expect(pest.biofix_date).to eq(biofix)
  end
end
