require "spec_helper"

RSpec.describe CercosporaLeafSpot, type: :model do
  let(:biofix) { Date.today - 14.days }
  let(:pest) { CercosporaLeafSpot.new }
  let(:grid) {
    [
      {lat: 1, lng: 1, avg7: rand(100), avg2: rand(10)},
      {lat: 1, lng: 2, avg7: rand(100), avg2: rand(10)},
      {lat: 2, lng: 1, avg7: rand(100), avg2: rand(10)},
      {lat: 2, lng: 2, avg7: rand(100), avg2: rand(10)}
    ]
  }

  it "has a severity legend with 5 levels" do
    legend = pest.severity_legend
    expect(legend).not_to be_empty
    expect(legend.length).to eq(5)
  end

  it "renders severity from seven and two day totals" do
    expect(pest.total_to_severity(6, 6)).to eq(4)
    expect(pest.total_to_severity(4, 6)).to eq(4)

    expect(pest.total_to_severity(4, 0)).to eq(3)
    expect(pest.total_to_severity(0, 4)).to eq(3)

    expect(pest.total_to_severity(2, 0)).to eq(2)
    expect(pest.total_to_severity(0, 3)).to eq(2)

    expect(pest.total_to_severity(1, 0)).to eq(1)
    expect(pest.total_to_severity(1, 0)).to eq(1)

    expect(pest.total_to_severity(0, 0)).to eq(0)
  end

  it "generates severities from weather" do
    expect(pest).to receive(:total_to_severity).exactly(4).times
    pest.severities_from_totals(grid)
  end

  it "sets biofix date" do
    expect(pest.biofix_date).to eq(biofix)
  end
end
