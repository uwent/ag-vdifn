require "spec_helper"

RSpec.describe LateBlight, type: :model do

  biofix = Date.today - 14.days

  pest = LateBlight.create!()

  past_week = [
    {lat: 1, long: 1, total: rand(28)},
    {lat: 1, long: 2, total: rand(28)},
    {lat: 2, long: 1, total: rand(28)},
    {lat: 2, long: 2, total: rand(28)}
  ]

  season_to_date = [
    {lat: 1, long: 1, total: rand(50)},
    {lat: 1, long: 2, total: rand(50)},
    {lat: 2, long: 1, total: rand(50)},
    {lat: 2, long: 2, total: rand(50)}
  ]

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
    expect(pest).to receive(:total_to_severity).exactly(4).times

    pest.severities_from_totals(past_week, season_to_date)
  end

  it "sets biofix date" do
    expect(pest.biofix_date).to eq(biofix)
  end
  
end