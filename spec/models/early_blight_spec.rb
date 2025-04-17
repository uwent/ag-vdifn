require "spec_helper"

RSpec.describe EarlyBlight, type: :model do
  let(:biofix_mm) { 5 }
  let(:biofix_dd) { 1 }
  let(:pest) {
    EarlyBlight.new(biofix_mm:, biofix_dd:)
  }
  let(:grid) {
    [
      {lat: 1, lng: 1, total: rand(500), seven_day_avg: rand(10)},
      {lat: 1, lng: 2, total: rand(500), seven_day_avg: rand(10)},
      {lat: 2, lng: 1, total: rand(500), seven_day_avg: rand(10)},
      {lat: 2, lng: 2, total: rand(500), seven_day_avg: rand(10)}
    ]
  }

  it "has a severity legend with 5 levels" do
    legend = pest.severity_legend
    expect(legend).not_to be_empty
    expect(legend.length).to eq(5)
  end

  it "renders severity from selected date range when total < 300" do
    expect(pest.total_to_severity(0, 0)).to eq(0)
    expect(pest.total_to_severity(251, 0)).to eq(1)
    expect(pest.total_to_severity(301, 0)).to eq(2)
    expect(pest.total_to_severity(351, 0)).to eq(3)
    expect(pest.total_to_severity(401, 0)).to eq(4)
    expect(pest.total_to_severity(451, 0)).to eq(0)
  end

  it "renders severity from selected date range when total > 300" do
    expect(pest.total_to_severity(450, 1.8)).to eq(1)
    expect(pest.total_to_severity(450, 4)).to eq(2)
    expect(pest.total_to_severity(450, 6.1)).to eq(3)
    expect(pest.total_to_severity(450, 9.3)).to eq(4)
  end

  it "generates severities from totals" do
    expect(pest).to receive(:total_to_severity).exactly(4).times
    pest.severities_from_totals(grid)
  end

  it "sets biofix date from seeds" do
    expect(pest.biofix_date).to eq(Date.new(Date.current.year, biofix_mm, biofix_dd))
  end
end
