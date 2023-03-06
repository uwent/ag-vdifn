require "spec_helper"

RSpec.describe LateBlight, type: :model do
  let(:biofix) { Date.today - 7.days }
  let(:pest) { LateBlight.new }
  let(:grid1) {
    1.upto(5).collect do |i|
      {lat: rand(180), long: rand(180), selected_total: rand(25), season_total: rand(50), freeze: 0}
    end
  }
  let(:grid2) {
    [
      {lat: 1, long: 1, selected_total: rand(25), season_total: rand(50), freeze: 1},
      {lat: 1, long: 2, selected_total: rand(25), season_total: rand(50), freeze: 0},
      {lat: 2, long: 1, selected_total: rand(25), season_total: rand(50), freeze: 3},
      {lat: 2, long: 2, selected_total: rand(25), season_total: rand(50), freeze: 0}
    ]
  }

  it "has a severity legend with 5 levels" do
    legend = pest.severity_legend
    expect(legend).not_to be_empty
    expect(legend.length).to eq(5)
  end

  it "renders severity from selected date range" do
    expect(pest.total_to_severity(0, 0)).to eq(0)
    expect(pest.total_to_severity(1, 10)).to eq(1)
    expect(pest.total_to_severity(5, 35)).to eq(2)
    expect(pest.total_to_severity(14, 40)).to eq(3)
    expect(pest.total_to_severity(21, 50)).to eq(4)
  end

  it "generates severities from weather" do
    expect(pest).to receive(:total_to_severity).exactly(5).times
    pest.severities_from_totals(grid1)
  end

  it "returns no severities when freezing" do
    expect(pest).to receive(:total_to_severity).exactly(4).times
    pest.severities_from_totals(grid2)
  end

  it "sets biofix date" do
    expect(pest.biofix_date).to eq(biofix)
  end
end
