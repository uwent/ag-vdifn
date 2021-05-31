require "spec_helper"

RSpec.describe CercosporaLeafSpot, type: :model do

  biofix = Date.today - 14.days

  pest = CercosporaLeafSpot.create!()

  selected_dates = [
    {lat: 1, long: 1, total: rand(500)},
    {lat: 1, long: 2, total: rand(500)},
    {lat: 2, long: 1, total: rand(500)},
    {lat: 2, long: 2, total: rand(500)}
  ]

  last_7_days = [
    {lat: 1, long: 1, total: rand(100)},
    {lat: 1, long: 2, total: rand(100)},
    {lat: 2, long: 1, total: rand(100)},
    {lat: 2, long: 2, total: rand(100)}
  ]

  last_2_days = [
    {lat: 1, long: 1, total: rand(20)},
    {lat: 1, long: 2, total: rand(20)},
    {lat: 2, long: 1, total: rand(20)},
    {lat: 2, long: 2, total: rand(20)}
  ]

  it "has a severity legend with 5 levels" do
    legend = pest.severity_legend
    expect(legend).not_to be_empty
    expect(legend.length).to eq(5)
  end

  it "renders severity from 2 and 7-day totals" do
    expect(pest.total_to_severity(5 * 7, 0)).to eq(4)
    expect(pest.total_to_severity(0, 5 * 2)).to eq(3)
    expect(pest.total_to_severity(2 * 7, 0)).to eq(2)
    expect(pest.total_to_severity(0, 1 * 2)).to eq(1)
    expect(pest.total_to_severity(0, 0)).to eq(0)
  end

  it "generates severities from weather" do
    expect(pest).to receive(:total_to_severity).exactly(4).times

    pest.severities_from_totals(selected_dates, last_7_days, last_2_days)
  end

  it "warns when 2-day weather is missing" do
    expect(Rails.logger).to receive(:warn)

    pest.severities_from_totals(selected_dates, last_7_days, [])
  end

  it "sets biofix date" do
    expect(pest.biofix_date).to eq(biofix)
  end

end