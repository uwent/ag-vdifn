require "spec_helper"

RSpec.describe EarlyBlight, type: :model do
  biofix_mm = 2
  biofix_dd = 15

  pest = EarlyBlight.create!(biofix_mm: biofix_mm, biofix_dd: biofix_dd)

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

  it "has a severity legend with 5 levels" do
    legend = pest.severity_legend
    expect(legend).not_to be_empty
    expect(legend.length).to eq(5)
  end

  it "renders severity from selected date range when total < 300" do
    expect(pest.total_to_severity(0, 0)).to eq(0)
    expect(pest.total_to_severity(150, 0)).to eq(1)
    expect(pest.total_to_severity(250, 0)).to eq(3)
    expect(pest.total_to_severity(300, 0)).to eq(0)
  end

  it "renders severity from selected date range when total > 300" do
    expect(pest.total_to_severity(300, 1.8)).to eq(1)
    expect(pest.total_to_severity(300, 4)).to eq(2)
    expect(pest.total_to_severity(300, 6.1)).to eq(3)
    expect(pest.total_to_severity(300, 9.3)).to eq(4)
  end

  it "generates severities from weather" do
    expect(pest).to receive(:total_to_severity).exactly(4).times

    pest.severities_from_totals(selected_dates, last_7_days)
  end

  it "sets biofix date from seeds" do
    expect(pest.biofix_date).to eq(Date.new(Date.current.year, biofix_mm, biofix_dd))
  end
end
